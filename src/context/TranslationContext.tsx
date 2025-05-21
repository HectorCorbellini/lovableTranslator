import React, { createContext, useContext, useState, ReactNode } from "react";
import { pipeline, env } from "@xenova/transformers";
import { CHUNK_SIZE, MAX_LENGTH, MODEL_PROGRESS_SCALE, TRANSLATION_PROGRESS_SCALE } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { UI_STRINGS } from "@/lib/strings";

// Configure transformers.js to use CDN
env.allowLocalModels = false;
env.useBrowserCache = true;
// Provide Hugging Face access token for API requests via Vite env
env.HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

type TranslationDirection = "en-to-es" | "es-to-en";

interface TranslationContextType {
  sourceText: string;
  setSourceText: (text: string) => void;
  translatedText: string;
  direction: TranslationDirection;
  setDirection: (direction: TranslationDirection) => void;
  isTranslating: boolean;
  characterCount: number;
  translate: () => Promise<void>;
  copyToClipboard: () => void;
  isCopied: boolean;
  progress: number;
  progressMessage: string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [direction, setDirection] = useState<TranslationDirection>("en-to-es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const characterCount = sourceText.length;

  const getTranslationTaskAndModel = () => {
    if (direction === "en-to-es") {
      // English to Spanish
      return {
        task: "translation",
        model: "Xenova/opus-mt-en-es",
      };
    } else {
      // Spanish to English
      return {
        task: "translation",
        model: "Xenova/opus-mt-es-en",
      };
    }
  };

  const translate = async () => {
    if (!sourceText.trim() || isTranslating) return;

    setIsTranslating(true);
    setTranslatedText("");
    setProgress(0);
    setProgressMessage(UI_STRINGS.loadingInfo);

    const worker = new Worker(new URL("../workers/translation.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "progress") {
        setProgress(msg.progress);
        setProgressMessage(msg.message);
      } else if (msg.type === "result") {
        setTranslatedText(msg.result);
        setProgress(100);
        setProgressMessage(UI_STRINGS.status.translationComplete);
        worker.terminate();
        setIsTranslating(false);
      } else if (msg.type === "error") {
        setTranslatedText(`Error: ${msg.error}`);
        setProgress(0);
        setProgressMessage(UI_STRINGS.status.translationFailed);
        worker.terminate();
        setIsTranslating(false);
      }
    };
    worker.onerror = (err) => {
      console.error("Worker error:", err);
      setTranslatedText(UI_STRINGS.status.translationFailed);
      setProgress(0);
      setProgressMessage(UI_STRINGS.status.translationFailed);
      worker.terminate();
      setIsTranslating(false);
    };
    worker.postMessage({ sourceText, direction });
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    
    navigator.clipboard.writeText(translatedText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        logger.error("Failed to copy: ", err);
      });
  };

  const value = {
    sourceText,
    setSourceText,
    translatedText,
    direction,
    setDirection,
    isTranslating,
    characterCount,
    translate,
    copyToClipboard,
    isCopied,
    progress,
    progressMessage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
