"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { CompatibilityResult } from "@/types";

interface CompatibilityScoreProps {
  result: CompatibilityResult;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981"; // emerald
  if (score >= 65) return "#8b5cf6"; // violet
  if (score >= 50) return "#f59e0b"; // amber
  return "#ef4444";                  // red
}

export function CompatibilityScore({ result }: CompatibilityScoreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const { score, grade } = result;
  const color = getScoreColor(score);

  // SVG circle progress
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);

  const nameA = result.personA.input.name || "Партнёр А";
  const nameB = result.personB.input.name || "Партнёр Б";

  return (
    <div ref={ref} className="flex flex-col items-center gap-6 py-6">
      {/* Names */}
      <div className="flex items-center gap-4 text-center">
        <span className="font-heading text-lg font-semibold">{nameA}</span>
        <span className="text-2xl">♡</span>
        <span className="font-heading text-lg font-semibold">{nameB}</span>
      </div>

      {/* Circular score */}
      <div className="relative w-48 h-48">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 200 200"
          aria-label={`Совместимость: ${score} из 100`}
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">из 100</span>
        </div>
      </div>

      {/* Grade label */}
      <motion.div
        className="text-center space-y-1"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <p
          className="text-xl font-heading font-semibold"
          style={{ color }}
        >
          {grade}
        </p>
        <p className="text-sm text-muted-foreground max-w-xs text-center">
          {result.summary}
        </p>
      </motion.div>

      {/* Overlaps */}
      {result.overlaps.length > 0 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <p className="text-xs text-muted-foreground mb-2">Общие энергии</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {result.overlaps.slice(0, 5).map((n) => (
              <span
                key={n}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs font-bold"
              >
                {n}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
