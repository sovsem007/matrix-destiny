"use client";

import { motion } from "framer-motion";
import type { CompatibilityResult } from "@/types";
import { GlassCard } from "@/components/ui/card";

interface RelationshipSummaryProps {
  result: CompatibilityResult;
}

export function RelationshipSummary({ result }: RelationshipSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Text summary */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold mb-2 text-violet-400">Резюме пары</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
      </GlassCard>

      {/* Tensions */}
      {result.tensions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-amber-400">
            Точки напряжения
          </h3>
          {result.tensions.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
            >
              <div className="flex gap-2 mb-1">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex-shrink-0">
                  {t.arcana[0]}
                </span>
                <span className="text-xs text-muted-foreground">↔</span>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex-shrink-0">
                  {t.arcana[1]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-400">
          Рекомендации для пары
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-muted-foreground"
            >
              <span className="flex-shrink-0 mt-0.5 text-violet-400 font-bold">{i + 1}.</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
