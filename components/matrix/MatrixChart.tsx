"use client";

import { motion } from "framer-motion";
import type { MatrixPositions, BaseNumbers } from "@/types";
import { ARCANA } from "@/lib/interpretations/arcana";

interface MatrixChartProps {
  positions: MatrixPositions;
  baseNumbers: BaseNumbers;
  /** Highlight a specific position key on hover */
  highlightedPosition?: string | null;
  onPositionHover?: (key: string | null) => void;
  size?: number;
}

// SVG coordinate map for the 9 octagram positions
// Canvas is 340x340, center at (170,170)
const COORDS: Record<string, { x: number; y: number }> = {
  sky:       { x: 170, y: 30  },   // Top
  northeast: { x: 280, y: 80  },   // NE
  male:      { x: 320, y: 170 },   // Right
  southeast: { x: 280, y: 260 },   // SE
  earth:     { x: 170, y: 310 },   // Bottom
  southwest: { x: 60,  y: 260 },   // SW
  female:    { x: 20,  y: 170 },   // Left
  northwest: { x: 60,  y: 80  },   // NW
  center:    { x: 170, y: 170 },   // Center
};

// Connection lines definition
const LINES: Array<[string, string]> = [
  // Outer octagram
  ["sky", "northeast"],
  ["northeast", "male"],
  ["male", "southeast"],
  ["southeast", "earth"],
  ["earth", "southwest"],
  ["southwest", "female"],
  ["female", "northwest"],
  ["northwest", "sky"],
  // Inner diamond (cardinal points)
  ["sky", "male"],
  ["male", "earth"],
  ["earth", "female"],
  ["female", "sky"],
  // Center spokes to cardinal
  ["center", "sky"],
  ["center", "male"],
  ["center", "earth"],
  ["center", "female"],
  // Center spokes to diagonals
  ["center", "northeast"],
  ["center", "southeast"],
  ["center", "southwest"],
  ["center", "northwest"],
];

const ELEMENT_COLORS: Record<string, { fill: string; stroke: string; glow: string }> = {
  fire:   { fill: "#f97316", stroke: "#ea580c", glow: "#f97316" },
  water:  { fill: "#3b82f6", stroke: "#2563eb", glow: "#3b82f6" },
  earth:  { fill: "#10b981", stroke: "#059669", glow: "#10b981" },
  air:    { fill: "#06b6d4", stroke: "#0891b2", glow: "#06b6d4" },
  spirit: { fill: "#8b5cf6", stroke: "#7c3aed", glow: "#8b5cf6" },
};

const NODE_RADIUS: Record<string, number> = {
  center: 28,
  sky: 22,
  earth: 22,
  male: 22,
  female: 22,
  northeast: 18,
  southeast: 18,
  southwest: 18,
  northwest: 18,
};

export function MatrixChart({
  positions,
  highlightedPosition,
  onPositionHover,
  size = 340,
}: MatrixChartProps) {
  const scale = size / 340;

  function getArcanaColor(posKey: string) {
    const num = positions[posKey as keyof MatrixPositions];
    const element = ARCANA[num]?.element ?? "spirit";
    return ELEMENT_COLORS[element] ?? ELEMENT_COLORS.spirit;
  }

  return (
    <div className="relative flex items-center justify-center select-none" aria-label="Матрица судьбы — визуальная схема">
      <svg
        width={size}
        height={size}
        viewBox="0 0 340 340"
        className="overflow-visible"
        role="img"
        aria-label="Октаграмма матрицы судьбы"
      >
        <defs>
          {/* Line gradient */}
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow filters per element */}
          {Object.entries(ELEMENT_COLORS).map(([el, c]) => (
            <filter key={el} id={`nodeGlow-${el}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor={c.glow} floodOpacity="0.5" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Background subtle ring */}
        <circle cx="170" cy="170" r="155" fill="none" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
        <circle cx="170" cy="170" r="120" fill="none" stroke="url(#lineGrad)" strokeWidth="0.5" opacity="0.2" />

        {/* Connection lines */}
        {LINES.map(([from, to]) => {
          const a = COORDS[from];
          const b = COORDS[to];
          const isHighlighted = highlightedPosition === from || highlightedPosition === to;
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={isHighlighted ? "#a78bfa" : "url(#lineGrad)"}
              strokeWidth={isHighlighted ? 1.5 : 1}
              opacity={isHighlighted ? 0.8 : 0.4}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isHighlighted ? 0.8 : 0.4 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
          );
        })}

        {/* Nodes */}
        {Object.entries(COORDS).map(([posKey, coord]) => {
          const num = positions[posKey as keyof MatrixPositions];
          const colors = getArcanaColor(posKey);
          const element = ARCANA[num]?.element ?? "spirit";
          const isHighlighted = highlightedPosition === posKey;
          const isCenter = posKey === "center";
          const r = NODE_RADIUS[posKey] ?? 18;

          return (
            <g
              key={posKey}
              transform={`translate(${coord.x},${coord.y})`}
              className="cursor-pointer"
              onMouseEnter={() => onPositionHover?.(posKey)}
              onMouseLeave={() => onPositionHover?.(null)}
              role="button"
              aria-label={`${posKey}: Аркан ${num} — ${ARCANA[num]?.title ?? ""}`}
              tabIndex={0}
              onFocus={() => onPositionHover?.(posKey)}
              onBlur={() => onPositionHover?.(null)}
            >
              {/* Outer glow ring when highlighted */}
              {isHighlighted && (
                <motion.circle
                  r={r + 10}
                  fill={colors.glow}
                  opacity={0.15}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Node background circle */}
              <motion.circle
                r={r}
                fill={isCenter ? "url(#centerGrad)" : `${colors.fill}20`}
                stroke={isHighlighted ? colors.stroke : `${colors.stroke}80`}
                strokeWidth={isHighlighted || isCenter ? 2 : 1.5}
                filter={isHighlighted ? `url(#nodeGlow-${element})` : undefined}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />

              {/* Center has special gradient */}
              {isCenter && (
                <defs>
                  <radialGradient id="centerGrad">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.3" />
                  </radialGradient>
                </defs>
              )}

              {/* Arcana number */}
              <motion.text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isCenter ? 18 : 14}
                fontWeight="bold"
                fill={isHighlighted || isCenter ? "#ffffff" : colors.fill}
                filter={isCenter ? "url(#glow)" : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                aria-hidden="true"
              >
                {num}
              </motion.text>

              {/* Arcana title (shown for highlighted or center) */}
              {(isHighlighted || isCenter) && (
                <motion.text
                  textAnchor="middle"
                  y={r + 14}
                  fontSize={9}
                  fill={colors.fill}
                  opacity={0.9}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  {ARCANA[num]?.title ?? ""}
                </motion.text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
