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
    const useQuantized = import.meta.env.VITE_USE_QUANTIZED === "true";
    const baseModel = direction === "en-to-es" ? "Xenova/opus-mt-en-es" : "Xenova/opus-mt-es-en";
    const quantizedModel = direction === "en-to-es" ? "Xenova/opus-mt-en-es-int8" : "Xenova/opus-mt-es-en-int8";
    const model = useQuantized ? quantizedModel : baseModel;

    postMessage({ type: "progress", progress: 10, message: "Loading model..." });
    const translator = await pipeline("translation", model, {
      progress_callback: (p) => {
        const scaled = Math.round(p * MODEL_PROGRESS_SCALE);
        postMessage({ type: "progress", progress: 10 + scaled, message: `Loading model: ${scaled}%` });
      },
    });

    postMessage({ type: "progress", progress: 50, message: "Translating text..." });
    // Split into paragraphs preserving blank lines
    const paragraphs = sourceText.split(/\n{2,}/g);
    const paragraphChunks = paragraphs.map(paragraph => {
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      const chunks: string[] = [];
      let current = "";
      for (const sentence of sentences) {
        if ((current + sentence).length <= CHUNK_SIZE) current += sentence;
        else {
          if (current) chunks.push(current);
          current = sentence;
        }
      }
      if (current) chunks.push(current);
      return chunks;
    });
    const totalChunks = paragraphChunks.reduce((acc, arr) => acc + arr.length, 0);
    let globalIndex = 0;
    const paragraphTranslations: string[] = [];

    // Helper for translating a single chunk with retry and cache
    const translateSingle = async (text: string) => {
      if (translationCache.has(text)) return translationCache.get(text)!;
      let attempt = 0;
      let result = "";
      while (attempt < MAX_CHUNK_RETRIES) {
        try {
          const res: any = await translator(text, { max_length: MAX_LENGTH });
          result = res?.[0]?.translation_text || "";
          translationCache.set(text, result);
          break;
        } catch {
          attempt++;
          if (attempt === MAX_CHUNK_RETRIES) result = "[Error]";
        }
      }
      return result;
    };

    // Translate each paragraph sequentially, with parallelism per paragraph
    const MAX_PARALLEL = 3;
    for (const chunks of paragraphChunks) {
      const results: string[] = [];
      for (let i = 0; i < chunks.length; i += MAX_PARALLEL) {
        const batch = chunks.slice(i, i + MAX_PARALLEL);
        const batchRes = await Promise.all(batch.map(ch => translateSingle(ch)));
        batchRes.forEach((translation) => {
          globalIndex++;
          const prog = 50 + Math.round((globalIndex / totalChunks) * TRANSLATION_PROGRESS_SCALE);
          postMessage({ type: "progress", progress: prog, message: `Translated ${globalIndex}/${totalChunks}` });
          results.push(translation);
        });
      }
      paragraphTranslations.push(results.join(''));
    }
    const final = paragraphTranslations.join('\n\n');

    postMessage({ type: "progress", progress: 90, message: "Finalizing..." });
    postMessage({ type: "result", result: final });
  } catch (e: any) {
    postMessage({ type: "error", error: e.message || "Unknown error" });
  }
};
