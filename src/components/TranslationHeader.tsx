import { Button } from "@/components/ui/button";
import { useTranslation } from "@/context/TranslationContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { UI_STRINGS } from "@/lib/strings";

export function TranslationHeader() {
  const { direction, setDirection, isTranslating } = useTranslation();
  
  const toggleDirection = () => {
    if (isTranslating) return;
    setDirection(direction === "en-to-es" ? "es-to-en" : "en-to-es");
  };

  return (
    <div className="flex items-center justify-between mb-4 px-1" role="region" aria-label="Translation direction">
      <div 
        className="font-medium text-sm sm:text-base"
        aria-live="polite"
      >
        {direction === "en-to-es"
          ? UI_STRINGS.header.enToEs
          : UI_STRINGS.header.esToEn}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={toggleDirection}
        disabled={isTranslating}
        aria-label="Switch translation direction"
      >
        <ArrowLeft className="h-4 w-4" />
        <ArrowRight className="h-4 w-4" />
        <span className="hidden sm:inline">{UI_STRINGS.button.swapLanguages}</span>
      </Button>
    </div>
  );
}
