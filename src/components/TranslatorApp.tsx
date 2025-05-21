
import { TranslationHeader } from "./TranslationHeader";
import { SourceTextArea } from "./SourceTextArea";
import { TranslatedTextArea } from "./TranslatedTextArea";
import { TranslateButton } from "./TranslateButton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export function TranslatorApp() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="pt-6">
        <section aria-labelledby="translation-header">
          <h2 id="translation-header" className="sr-only">Translation Controls</h2>
          <TranslationHeader />
        </section>
        
        <section aria-label="Source text input">
          <SourceTextArea />
        </section>
        
        <Separator className="my-4" role="separator" />
        
        <section aria-label="Translation output">
          <TranslatedTextArea />
        </section>
        
        <section aria-label="Translation actions">
          <TranslateButton />
        </section>
      </CardContent>
    </Card>
  );
}
