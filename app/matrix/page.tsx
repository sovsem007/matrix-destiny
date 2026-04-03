import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { MatrixClient } from "./MatrixClient";

export default function MatrixPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-12 max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
            <span className="text-muted-foreground">Вычисляем вашу матрицу судьбы...</span>
          </div>
        </div>
      }
    >
      <MatrixClient />
    </Suspense>
  );
}
