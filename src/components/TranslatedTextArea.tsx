import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/context/TranslationContext";
import { CopyIcon, CheckIcon, SaveIcon } from "lucide-react";
import { UI_STRINGS } from "@/lib/strings";
import { useState } from "react";

export function TranslatedTextArea() {
  const { translatedText, isTranslating, copyToClipboard, isCopied } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);
  
  const saveToFile = () => {
    if (!translatedText) return;
    
    // Create blob and download link
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 100);
  };

  return (
    <div className="relative flex flex-col">
      <div className="relative">
        <Textarea
          className="min-h-36 resize-none text-base p-4 bg-pink-100 text-gray-800"
          value={isTranslating ? "Translating..." : translatedText}
          readOnly
          placeholder={UI_STRINGS.placeholders.translationArea}
          aria-label="Translation result"
          aria-live="polite"
          aria-readonly="true"
        />
        {translatedText && !isTranslating && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={saveToFile}
              aria-label={UI_STRINGS.button.saveResult}
              aria-pressed={isSaved}
            >
              {isSaved ? (
                <CheckIcon className="h-6 w-6 text-green-500" />
              ) : (
                <SaveIcon className="h-6 w-6" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={copyToClipboard}
              aria-label="Copy translation to clipboard"
              aria-pressed={isCopied}
            >
              {isCopied ? (
                <CheckIcon className="h-6 w-6 text-green-500" />
              ) : (
                <CopyIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TranslatedTextArea;
