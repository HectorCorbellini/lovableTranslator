
import { Loader2 } from "lucide-react";

export function LoadingInfo() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Loader2 className="h-8 w-8 animate-spin mb-2" />
      <p className="text-sm text-muted-foreground">
        Loading translation model for the first time.
        <br />
        This may take a moment...
      </p>
    </div>
  );
}
