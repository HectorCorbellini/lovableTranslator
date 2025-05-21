import { Button } from "@/components/ui/button";
import { useTranslation } from "@/context/TranslationContext";
import { Progress } from "@/components/ui/progress";
import { UI_STRINGS } from "@/lib/strings";

export function TranslateButton() {
  const { translate, isTranslating, sourceText, progress, progressMessage } = useTranslation();

  return (
    <div className="space-y-2">
      <Button 
        className="w-full"
        onClick={translate}
        disabled={isTranslating || !sourceText.trim()}
        aria-label="Translate text"
        aria-busy={isTranslating}
      >
        {isTranslating ? UI_STRINGS.button.translating : UI_STRINGS.button.translate}
      </Button>
      {isTranslating && (
        <div className="space-y-1" role="status">
          <Progress 
            value={progress} 
            className="h-2" 
            aria-label="Translation progress" 
            aria-valuenow={progress} 
            aria-valuemin={0} 
            aria-valuemax={100}
          />
          <p 
            className="text-xs text-muted-foreground"
            aria-live="polite"
          >
            {progressMessage || "Processing..."}
          </p>
        </div>
      )}
    </div>
  );
}
