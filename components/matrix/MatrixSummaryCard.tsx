"use client";

import { motion } from "framer-motion";
import type { MatrixResult } from "@/types";
import { ARCANA } from "@/lib/interpretations/arcana";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateRu } from "@/lib/utils";

interface MatrixSummaryCardProps {
  result: MatrixResult;
}

const ELEMENT_LABEL: Record<string, string> = {
  fire: "Огонь 🔥",
  water: "Вода 💧",
  earth: "Земля 🌿",
  air: "Воздух 💨",
  spirit: "Дух ✨",
};

export function MatrixSummaryCard({ result }: MatrixSummaryCardProps) {
  const centerArcana = ARCANA[result.positions.center];
  const purposeArcana = ARCANA[result.interpretations.purpose];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Center arcana number — hero display */}
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/30 flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-violet-500/10">
            <span className="text-3xl font-bold text-white">{result.positions.center}</span>
            <span className="text-[10px] text-violet-300 font-medium">аркан</span>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              {result.input.name && (
                <p className="text-sm text-muted-foreground mb-1">
                  {result.input.name} · {formatDateRu(result.input.dateOfBirth)}
                </p>
              )}
              {!result.input.name && (
                <p className="text-sm text-muted-foreground mb-1">
                  {formatDateRu(result.input.dateOfBirth)}
                </p>
              )}
              <h2 className="font-heading text-2xl font-bold">
                {centerArcana?.title ?? `Аркан ${result.positions.center}`}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {centerArcana?.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="violet">Центральная энергия</Badge>
              {centerArcana && (
                <Badge variant={`element_${centerArcana.element}` as "element_fire"}>
                  {ELEMENT_LABEL[centerArcana.element]}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Short meaning */}
        {centerArcana && (
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
            {centerArcana.shortMeaning}
          </p>
        )}

        {/* Purpose highlight */}
        {purposeArcana && result.interpretations.purpose !== result.positions.center && (
          <div className="mt-4 p-4 rounded-xl bg-gold-500/5 border border-gold-500/20">
            <p className="text-xs font-medium text-gold-400 mb-1">Предназначение</p>
            <p className="text-sm font-semibold">
              {result.interpretations.purpose} — {purposeArcana.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{purposeArcana.shortMeaning}</p>
          </div>
        )}

        {/* Base numbers */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { label: "День", value: result.baseNumbers.day },
            { label: "Месяц", value: result.baseNumbers.month },
            { label: "Год", value: result.baseNumbers.year },
            { label: "Итог", value: result.baseNumbers.total },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-2 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="text-lg font-bold text-violet-400">{item.value}</div>
              <div className="text-[10px] text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
