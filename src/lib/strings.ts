// Centralized UI strings for localization/configuration
export const UI_STRINGS = {
  appTitle: "Free Language Translator",
  appSubtitle: "English ↔ Spanish translation without API costs",
  footerText: "Powered by Hugging Face Transformers.js - No API keys required",
  loadingInfo: "Loading translation model for the first time. This may take a moment...",

  placeholders: {
    enToEs: "Enter English text...",
    esToEn: "Ingrese texto en español...",
    translationArea: "Translation will appear here...",
  },

  button: {
    translate: "Translate",
    translating: "Translating...",
    swapLanguages: "Swap Languages",
    uploadFile: "Upload .txt file",
    saveResult: "Save Result",
    copyToClipboard: "Copy to clipboard",
  },

  header: {
    enToEs: "English → Spanish",
    esToEn: "Spanish → English",
  },

  status: {
    translationComplete: "Translation complete!",
    translationFailed: "Translation failed",
  },

  errorBoundary: {
    title: "Something went wrong.",
    message: "Please try refreshing the page or contact support.",
  },
};
