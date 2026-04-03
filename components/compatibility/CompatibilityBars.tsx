"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { CompatibilityResult } from "@/types";
import { Progress } from "@/components/ui/progress";

interface CompatibilityBarsProps {
  result: CompatibilityResult;
}

function scoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 65) return "bg-violet-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

function scoreEmoji(score: number): string {
  if (score >= 80) return "💚";
  if (score >= 65) return "💜";
  if (score >= 50) return "💛";
  return "🔴";
}

export function CompatibilityBars({ result }: CompatibilityBarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const subscores = [
    result.subscores.emotional,
    result.subscores.practical,
    result.subscores.communication,
    result.subscores.values,
  ];

  return (
    <div ref={ref} className="space-y-5">
      {subscores.map((sub, idx) => (
        <motion.div
          key={sub.label}
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">{scoreEmoji(sub.score)}</span>
              <span className="text-sm font-medium">{sub.label}</span>
            </div>
            <span className="text-sm font-bold" style={{ color: sub.score >= 80 ? "#10b981" : sub.score >= 65 ? "#8b5cf6" : sub.score >= 50 ? "#f59e0b" : "#ef4444" }}>
              {sub.score}%
            </span>
          </div>

          <Progress
            value={isInView ? sub.score : 0}
            className="h-2.5"
            indicatorClassName={scoreColor(sub.score)}
          />

          <p className="text-xs text-muted-foreground">{sub.description}</p>

          {/* Detail items */}
          <div className="space-y-1 pl-2">
            {sub.details.map((detail) => (
              <p key={detail} className="text-xs text-muted-foreground/70 flex items-start gap-1.5">
                <span className="text-border mt-0.5 flex-shrink-0">·</span>
                {detail}
              </p>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
