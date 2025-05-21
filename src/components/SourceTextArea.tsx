import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/context/TranslationContext";
import { UI_STRINGS } from "@/lib/strings";

export function SourceTextArea() {
  const { sourceText, setSourceText, direction, characterCount } = useTranslation();

  return (
    <div className="relative flex flex-col">
      <input
        type="file"
        accept=".txt"
        aria-label={UI_STRINGS.button.uploadFile}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => setSourceText(reader.result as string);
            reader.readAsText(file);
          }
        }}
        className="mb-2 block"
      />
      <Textarea
        aria-label={direction === "en-to-es" ? "English source text" : "Spanish source text"}
        aria-required="true"
        placeholder={
          direction === "en-to-es"
            ? UI_STRINGS.placeholders.enToEs
            : UI_STRINGS.placeholders.esToEn
        }
        className="min-h-36 resize-none text-base p-4 bg-green-100 text-gray-800"
        value={sourceText}
        onChange={(e) => setSourceText(e.target.value)}
      />
      <div 
        className="text-xs text-muted-foreground mt-1 self-end"
        aria-live="polite"
        aria-atomic="true"
      >
        {characterCount} characters
      </div>
    </div>
  );
}
