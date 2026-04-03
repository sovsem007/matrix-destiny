"use client";

import { POSITION_META, OCTAGRAM_POSITIONS } from "@/lib/interpretations/position-meanings";
import type { MatrixPositions } from "@/types";
import { ARCANA } from "@/lib/interpretations/arcana";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MatrixLegendProps {
  positions: MatrixPositions;
  highlightedPosition?: string | null;
  onPositionHover?: (key: string | null) => void;
}

const ELEMENT_BADGE: Record<string, "element_fire" | "element_water" | "element_earth" | "element_air" | "element_spirit"> = {
  fire: "element_fire",
  water: "element_water",
  earth: "element_earth",
  air: "element_air",
  spirit: "element_spirit",
};

const ELEMENT_LABEL: Record<string, string> = {
  fire: "Огонь",
  water: "Вода",
  earth: "Земля",
  air: "Воздух",
  spirit: "Дух",
};

export function MatrixLegend({ positions, highlightedPosition, onPositionHover }: MatrixLegendProps) {
  return (
    <div className="space-y-2" role="list" aria-label="Позиции матрицы">
      {OCTAGRAM_POSITIONS.map((key) => {
        const meta = POSITION_META[key];
        const num = positions[key as keyof MatrixPositions];
        const arcana = ARCANA[num];
        const isHighlighted = highlightedPosition === key;

        return (
          <div
            key={key}
            role="listitem"
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer",
              isHighlighted
                ? "border-violet-500/50 bg-violet-500/10"
                : "border-border/30 hover:border-border/60 hover:bg-muted/30"
            )}
            onMouseEnter={() => onPositionHover?.(key)}
            onMouseLeave={() => onPositionHover?.(null)}
            tabIndex={0}
            onFocus={() => onPositionHover?.(key)}
            onBlur={() => onPositionHover?.(null)}
            aria-label={`${meta.label}: Аркан ${num} — ${arcana?.title ?? ""}`}
          >
            {/* Icon + number */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/20 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground">{meta.icon}</span>
              <span className="text-sm font-bold text-violet-400 leading-none">{num}</span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground">{meta.label}</span>
                {arcana && (
                  <Badge variant={ELEMENT_BADGE[arcana.element] ?? "outline"} className="text-[10px] py-0">
                    {ELEMENT_LABEL[arcana.element]}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold truncate">{arcana?.title ?? `Аркан ${num}`}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{arcana?.shortMeaning}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
