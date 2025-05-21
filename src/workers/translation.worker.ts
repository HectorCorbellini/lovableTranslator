import { pipeline, env } from "@xenova/transformers";
import { CHUNK_SIZE, MAX_LENGTH, MODEL_PROGRESS_SCALE, TRANSLATION_PROGRESS_SCALE } from "../lib/constants";

env.allowLocalModels = false;
env.useBrowserCache = true;
// @ts-ignore: HF_TOKEN is dynamically added
env.HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

type WorkerMessage = { sourceText: string; direction: "en-to-es" | "es-to-en" };
type ProgressMessage = { type: "progress"; progress: number; message: string };
type ResultMessage = { type: "result"; result: string };
type ErrorMessage = { type: "error"; error: string };

// Cache translations for text chunks
const translationCache = new Map<string, string>();
// Maximum retry attempts for chunk translation
const MAX_CHUNK_RETRIES = 2;

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { sourceText, direction } = e.data;
  try {
    const task = "translation";
    const model = direction === "en-to-es" ? "Xenova/opus-mt-en-es" : "Xenova/opus-mt-es-en";

    postMessage({ type: "progress", progress: 10, message: "Loading model..." });
    const translator = await pipeline(task, model, {
      progress_callback: (p) => {
        const scaled = Math.round(p * MODEL_PROGRESS_SCALE);
        postMessage({ type: "progress", progress: 10 + scaled, message: `Loading model: ${scaled}%` });
      },
    });

    postMessage({ type: "progress", progress: 50, message: "Translating text..." });
    // Split by double-newline separators, preserving them
    const parts = sourceText.split(/(\n{2,})/g);
    const translatedParts: string[] = [];
    // Count chunks only in non-separator parts
    let totalChunks = parts.reduce((acc, part) => {
      if (!/^\n{2,}$/.test(part) && part.trim()) {
        acc += Math.ceil(part.length / CHUNK_SIZE);
      }
      return acc;
    }, 0);
    let idx = 0;

    for (const part of parts) {
      // Preserve separators directly
      if (/^\n{2,}$/.test(part)) {
        translatedParts.push(part);
        continue;
      }
      if (!part.trim()) { translatedParts.push(""); continue; }
      const chunks: string[] = [];
      for (let i = 0; i < part.length; i += CHUNK_SIZE) {
        chunks.push(part.slice(i, i + CHUNK_SIZE));
      }
      const paraResults: string[] = [];
      for (const chunk of chunks) {
        // Check cache before translating
        let translation: string;
        if (translationCache.has(chunk)) {
          translation = translationCache.get(chunk)!;
        } else {
          let attempt = 0;
          let resultText = "";
          while (attempt < MAX_CHUNK_RETRIES) {
            try {
              const res: any = await translator(chunk, { max_length: MAX_LENGTH });
              resultText = res?.[0]?.translation_text || "";
              // Store successful translation in cache
              translationCache.set(chunk, resultText);
              break;
            } catch {
              attempt++;
              if (attempt === MAX_CHUNK_RETRIES) {
                resultText = "[Error]";
              }
            }
          }
          translation = resultText;
        }
        paraResults.push(translation);
        idx++;
        const prog = 50 + Math.round((idx / totalChunks) * TRANSLATION_PROGRESS_SCALE);
        postMessage({ type: "progress", progress: prog, message: `Translated ${idx}/${totalChunks}` });
      }
      // Append translated paragraph preserving chunk order
      translatedParts.push(paraResults.join(''));
    }

    postMessage({ type: "progress", progress: 90, message: "Finalizing..." });
    // Reassemble all parts including original separators
    const final = translatedParts.join('');
    postMessage({ type: "result", result: final });
  } catch (e: any) {
    postMessage({ type: "error", error: e.message || "Unknown error" });
  }
};
