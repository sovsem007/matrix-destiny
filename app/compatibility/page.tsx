import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CompatibilityClient } from "./CompatibilityClient";

export default function CompatibilityPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-rose-500" />
            <span className="text-muted-foreground">Анализируем совместимость...</span>
          </div>
        </div>
      }
    >
      <CompatibilityClient />
    </Suspense>
  );
}
