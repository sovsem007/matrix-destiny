"use client";

import { motion } from "framer-motion";
import type { CompatibilityResult } from "@/types";
import { ARCANA } from "@/lib/interpretations/arcana";

interface StrengthsAndRisksProps {
  result: CompatibilityResult;
}

export function StrengthsAndRisks({ result }: StrengthsAndRisksProps) {
  const nameA = result.personA.input.name || "Партнёр А";
  const nameB = result.personB.input.name || "Партнёр Б";

  // Derive strengths from shared arcana
  const sharedStrengths = result.overlaps
    .slice(0, 4)
    .map((n) => ARCANA[n])
    .filter(Boolean)
    .flatMap((a) => a!.strengths.slice(0, 1));

  // Best subscore
  const subscores = Object.values(result.subscores);
  const topSubscore = [...subscores].sort((a, b) => b.score - a.score)[0];
  const weakSubscore = [...subscores].sort((a, b) => a.score - b.score)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid sm:grid-cols-2 gap-4"
    >
      {/* Strengths */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
          <span>💚</span> Сильные стороны пары
        </h3>
        <ul className="space-y-2">
          {topSubscore && (
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-emerald-400 flex-shrink-0">✓</span>
              <span>
                <strong className="text-foreground">{topSubscore.label}</strong> —
                {" "}{topSubscore.description.toLowerCase()}
              </span>
            </li>
          )}
          {sharedStrengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-emerald-400 flex-shrink-0">✓</span>
              {s}
            </li>
          ))}
          {result.overlaps.length > 0 && (
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-emerald-400 flex-shrink-0">✓</span>
              Общая энергия {result.overlaps.slice(0, 2).map(n => ARCANA[n]?.title).join(" и ")} создаёт глубокое взаимопонимание
            </li>
          )}
        </ul>
      </div>

      {/* Growth points */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
          <span>🌱</span> Точки роста пары
        </h3>
        <ul className="space-y-2">
          {weakSubscore && weakSubscore.score < 75 && (
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-amber-400 flex-shrink-0">△</span>
              <span>
                <strong className="text-foreground">{weakSubscore.label}</strong> требует
                осознанной работы. {weakSubscore.description.toLowerCase()}
              </span>
            </li>
          )}
          {result.tensions.slice(0, 2).map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-amber-400 flex-shrink-0">△</span>
              {t.note}
            </li>
          ))}
          {result.tensions.length === 0 && (
            <li className="text-sm text-muted-foreground">
              Серьёзных энергетических противоречий не обнаружено. Поддерживайте открытый диалог.
            </li>
          )}
        </ul>
      </div>

      {/* Individual matrices quick reference */}
      <div className="sm:col-span-2 rounded-2xl border border-border/40 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Ключевые энергии партнёров</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: nameA, matrix: result.personA },
            { name: nameB, matrix: result.personB },
          ].map(({ name, matrix }) => (
            <div key={name} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{name}</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Центр", value: matrix.positions.center },
                  { label: "Цель", value: matrix.positions.sky },
                  { label: "♡", value: matrix.interpretations.relationships },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-violet-400">{item.value}</span>
                    <span className="text-muted-foreground/60">{ARCANA[item.value]?.title}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
