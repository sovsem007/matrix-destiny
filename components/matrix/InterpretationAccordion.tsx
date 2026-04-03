"use client";

import { motion } from "framer-motion";
import type { InterpretationPositions } from "@/types";
import { ARCANA } from "@/lib/interpretations/arcana";
import { POSITION_META, INTERPRETATION_ORDER } from "@/lib/interpretations/position-meanings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface InterpretationAccordionProps {
  interpretations: InterpretationPositions;
}

const ELEMENT_BADGE: Record<string, "element_fire" | "element_water" | "element_earth" | "element_air" | "element_spirit"> = {
  fire: "element_fire",
  water: "element_water",
  earth: "element_earth",
  air: "element_air",
  spirit: "element_spirit",
};

export function InterpretationAccordion({ interpretations }: InterpretationAccordionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="space-y-1"
    >
      <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="purpose">
        {INTERPRETATION_ORDER.map((key, idx) => {
          const meta = POSITION_META[key];
          if (!meta) return null;

          const num = interpretations[key as keyof InterpretationPositions];
          const arcana = ARCANA[num];
          if (!arcana) return null;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
            >
              <AccordionItem
                value={key}
                className="rounded-xl border border-border/50 bg-card px-5 [&[data-state=open]]:border-violet-500/30 [&[data-state=open]]:bg-violet-500/5 transition-colors duration-200 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left flex-1">
                    {/* Icon */}
                    <span className="text-lg w-6 text-center flex-shrink-0">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{meta.label}</span>
                        <Badge
                          variant={ELEMENT_BADGE[arcana.element] ?? "outline"}
                          className="text-[10px] py-0 px-2"
                        >
                          {arcana.title}
                        </Badge>
                        <span className="text-xs font-bold text-violet-400">#{num}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 pr-4">
                        {arcana.shortMeaning}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-0 pb-5 space-y-5">
                  {/* Main meaning */}
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium">{arcana.title} — {arcana.subtitle}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {arcana.shortMeaning}
                    </p>
                  </div>

                  {/* Context-specific meaning */}
                  {key === "relationships" && (
                    <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-4">
                      <p className="text-xs font-medium text-rose-400 mb-1.5">В отношениях</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {arcana.relationshipMeaning}
                      </p>
                    </div>
                  )}

                  {key === "finances" && (
                    <div className="rounded-lg bg-gold-500/5 border border-gold-500/20 p-4">
                      <p className="text-xs font-medium text-gold-400 mb-1.5">В финансах</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {arcana.financeMeaning}
                      </p>
                    </div>
                  )}

                  {/* Strengths */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                      Сильные стороны
                    </p>
                    <ul className="space-y-1">
                      {arcana.strengths.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenges */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                      Зоны роста
                    </p>
                    <ul className="space-y-1">
                      {arcana.challenges.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-amber-400 mt-0.5 flex-shrink-0">△</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Advice */}
                  <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-4">
                    <p className="text-xs font-medium text-violet-400 mb-1.5">Совет</p>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      {arcana.advice}
                    </p>
                  </div>

                  <p className="text-[11px] text-muted-foreground/50 italic">
                    {arcana.numericalNote}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>
    </motion.div>
  );
}
