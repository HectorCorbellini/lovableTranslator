import { TranslatorApp } from "@/components/TranslatorApp";
import { TranslationProvider } from "@/context/TranslationContext";
import { Suspense } from "react";
import { LoadingInfo } from "@/components/LoadingInfo";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UI_STRINGS } from "@/lib/strings";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-900 text-white">
      <header className="py-6 px-4 border-b bg-white">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600">
            {UI_STRINGS.appTitle}
          </h1>
          <p className="text-center text-muted-foreground mt-1">
            {UI_STRINGS.appSubtitle}
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <TranslationProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingInfo />}>
              <TranslatorApp />
            </Suspense>
          </ErrorBoundary>
        </TranslationProvider>
      </main>

      <footer className="py-4 px-4 border-t bg-white">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            {UI_STRINGS.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
