"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Share2, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { CompatibilityScore } from "@/components/compatibility/CompatibilityScore";
import { CompatibilityBars } from "@/components/compatibility/CompatibilityBars";
import { RelationshipSummary } from "@/components/compatibility/RelationshipSummary";
import { StrengthsAndRisks } from "@/components/compatibility/StrengthsAndRisks";
import { CompatibilityForm } from "@/components/home/CompatibilityForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/card";
import { calculateMatrix } from "@/lib/numerology/matrix-engine";
import { calculateCompatibility } from "@/lib/numerology/compatibility-engine";
import { buildCompatibilityShareUrl, copyToClipboard } from "@/lib/utils/share";
import { useAppStore } from "@/store/useAppStore";
import type { CompatibilityResult } from "@/types";

export function CompatibilityClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dob1 = searchParams.get("dob1");
  const dob2 = searchParams.get("dob2");
  const name1 = searchParams.get("name1") ?? undefined;
  const name2 = searchParams.get("name2") ?? undefined;

  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { saveCompatibility } = useAppStore();

  useEffect(() => {
    if (!dob1 || !dob2) return;
    setLoading(true);
    setError(null);
    try {
      const matrixA = calculateMatrix(dob1, name1);
      const matrixB = calculateMatrix(dob2, name2);
      const compat = calculateCompatibility(matrixA, matrixB);
      setResult(compat);
      saveCompatibility(compat);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка расчёта. Проверьте даты рождения.");
    } finally {
      setLoading(false);
    }
  }, [dob1, dob2, name1, name2]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleShare() {
    if (!dob1 || !dob2) return;
    const url = buildCompatibilityShareUrl({ dob1, name1, dob2, name2 });
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!dob1 || !dob2) {
    return (
      <div className="container py-16 max-w-2xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-8 text-center">
          Совместимость пары
        </h1>
        <CompatibilityForm />
      </div>
    );
  }

  if (loading) {
    return <CompatibilityPageSkeleton />;
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
    <div className="container py-8 md:py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <Button variant="mystic-outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          {copied ? "Скопировано!" : "Поделиться"}
        </Button>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-3xl md:text-4xl font-bold text-center mb-2"
      >
        Анализ совместимости
      </motion.h1>
      <p className="text-center text-muted-foreground mb-10">
        {name1 || "Партнёр А"} & {name2 || "Партнёр Б"}
      </p>

      <GlassCard className="mb-8">
        <CompatibilityScore result={result} />
      </GlassCard>

      <Tabs defaultValue="scores">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="scores" className="flex-1">Показатели</TabsTrigger>
          <TabsTrigger value="summary" className="flex-1">Анализ</TabsTrigger>
          <TabsTrigger value="strengths" className="flex-1">Сильные стороны</TabsTrigger>
        </TabsList>

        <TabsContent value="scores">
          <GlassCard className="p-6">
            <h2 className="font-heading text-xl font-semibold mb-6">
              Детальные показатели совместимости
            </h2>
            <CompatibilityBars result={result} />
          </GlassCard>
        </TabsContent>

        <TabsContent value="summary">
          <RelationshipSummary result={result} />
        </TabsContent>

        <TabsContent value="strengths">
          <StrengthsAndRisks result={result} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CompatibilityPageSkeleton() {
  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Loader2 className="h-5 w-5 animate-spin text-rose-500" />
        <span className="text-muted-foreground">Анализируем совместимость...</span>
      </div>
      <Skeleton className="h-72 rounded-2xl mb-8" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
