"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Share2, Download, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { MatrixChart } from "@/components/matrix/MatrixChart";
import { MatrixLegend } from "@/components/matrix/MatrixLegend";
import { MatrixSummaryCard } from "@/components/matrix/MatrixSummaryCard";
import { InterpretationAccordion } from "@/components/matrix/InterpretationAccordion";
import { MatrixForm } from "@/components/home/MatrixForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { calculateMatrix } from "@/lib/numerology/matrix-engine";
import { ARCANA } from "@/lib/interpretations/arcana";
import { buildMatrixShareUrl, copyToClipboard } from "@/lib/utils/share";
import { exportToPdf } from "@/lib/utils/pdf";
import { useAppStore } from "@/store/useAppStore";
import type { MatrixResult } from "@/types";

export default function MatrixPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dob = searchParams.get("dob");
  const name = searchParams.get("name") ?? undefined;

  const [result, setResult] = useState<MatrixResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [highlightedPosition, setHighlightedPosition] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const { saveMatrix } = useAppStore();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dob) return;
    setLoading(true);
    setError(null);
    try {
      const r = calculateMatrix(dob, name);
      setResult(r);
      saveMatrix(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка расчёта. Проверьте дату рождения.");
    } finally {
      setLoading(false);
    }
  }, [dob, name]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleShare() {
    if (!dob) return;
    const url = buildMatrixShareUrl({ dob, name });
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleExportPdf() {
    setPdfLoading(true);
    try {
      await exportToPdf("matrix-pdf-export", `matrix-${dob}.pdf`);
    } catch {
      // silent
    } finally {
      setPdfLoading(false);
    }
  }

  if (!dob) {
    return (
      <div className="container py-16 max-w-2xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-8 text-center">
          Матрица судьбы
        </h1>
        <MatrixForm />
      </div>
    );
  }

  if (loading) {
    return <MatrixPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container py-16 max-w-lg mx-auto text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="font-heading text-2xl font-bold">Ошибка расчёта</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="mystic" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="container py-8 md:py-12 max-w-6xl mx-auto">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>

        <div className="flex gap-2">
          <Button
            variant="mystic-outline"
            size="sm"
            onClick={handleShare}
            aria-label="Скопировать ссылку на результат"
          >
            <Share2 className="h-4 w-4" />
            {copied ? "Скопировано!" : "Поделиться"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={pdfLoading}
            aria-label="Экспорт в PDF"
          >
            {pdfLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            PDF
          </Button>
        </div>
      </div>

      {/* PDF export wrapper */}
      <div id="matrix-pdf-export" ref={resultRef}>
        {/* Summary card */}
        <MatrixSummaryCard result={result} />

        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          {/* Left: Chart + Legend */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <h2 className="font-heading text-xl font-semibold mb-6 text-center">
                Визуальная схема матрицы
              </h2>
              <MatrixChart
                positions={result.positions}
                baseNumbers={result.baseNumbers}
                highlightedPosition={highlightedPosition}
                onPositionHover={setHighlightedPosition}
                size={320}
              />
            </motion.div>

            {/* Legend */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                Позиции матрицы
              </h3>
              <MatrixLegend
                positions={result.positions}
                highlightedPosition={highlightedPosition}
                onPositionHover={setHighlightedPosition}
              />
            </div>
          </div>

          {/* Right: Interpretations */}
          <div className="space-y-4">
            <Tabs defaultValue="interpretations">
              <TabsList className="w-full">
                <TabsTrigger value="interpretations" className="flex-1">
                  Расшифровка
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex-1">
                  Ключевые слова
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interpretations" className="mt-4">
                <InterpretationAccordion interpretations={result.interpretations} />
              </TabsContent>

              <TabsContent value="keywords" className="mt-4">
                <KeywordsTab result={result} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Subcomponents ----------------------------------------

function KeywordsTab({ result }: { result: MatrixResult }) {
  const centerArcana = ARCANA[result.positions.center];

  return (
    <div className="space-y-6">
      {centerArcana && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{centerArcana.title} — ключевые слова</h3>
          <div className="flex flex-wrap gap-2">
            {centerArcana.keywords.map((kw: string) => (
              <span
                key={kw}
                className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Совет</h3>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          {centerArcana?.advice}
        </p>
      </div>
    </div>
  );
}

function MatrixPageSkeleton() {
  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
        <span className="text-muted-foreground">Вычисляем вашу матрицу судьбы...</span>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
