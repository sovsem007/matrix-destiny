/**
 * ============================================================
 * FORMULA CONFIGURATION — Матрица Судьбы
 * ============================================================
 *
 * This file is the SINGLE SOURCE OF TRUTH for all numerological
 * formulas. To swap the calculation methodology:
 *   1. Update REDUCTION_CONFIG to change the arcana range.
 *   2. Replace the functions in MATRIX_FORMULA to change how
 *      base numbers and positions are derived from a date.
 *   3. Replace COMPATIBILITY_FORMULA to change scoring logic.
 *
 * Every formula dependency is isolated here — components and
 * pages read only from MatrixResult / CompatibilityResult types.
 * ============================================================
 */

// ---- SWAP POINT 1: Arcana range & edge-case rules -----------

export const REDUCTION_CONFIG = {
  /** Minimum arcana number */
  min: 1,
  /** Maximum arcana number (22 = The Fool / Шут in this system) */
  max: 22,
  /**
   * What to return when digit-sum reduction yields 0.
   * Commonly set to max (22) or min (1).
   * Original Natalia Ladini system does not allow 0.
   */
  zeroFallback: 22,
} as const;

// ---- SWAP POINT 2: Base-number extraction -------------------

/**
 * Extracts 4 base personal numbers from a date of birth.
 *
 * Default implementation (standard Russian Matrix of Destiny):
 *   A = day
 *   B = month
 *   C = sum of all year digits (e.g. 1990 → 1+9+9+0 = 19)
 *   D = A + B + C  (personal total before reduction)
 *
 * Returns RAW (un-reduced) integers; reduction is applied later.
 *
 * REPLACE THIS FUNCTION to use a different extraction method.
 */
export function extractRawBaseNumbers(
  day: number,
  month: number,
  year: number
): { rawDay: number; rawMonth: number; rawYear: number; rawTotal: number } {
  const rawYear = String(year)
    .split("")
    .reduce((sum, d) => sum + parseInt(d, 10), 0);
  const rawTotal = day + month + rawYear;
  return { rawDay: day, rawMonth: month, rawYear, rawTotal };
}

// ---- SWAP POINT 3: Matrix position formulas -----------------

/**
 * Computes the nine octagram positions from the REDUCED base numbers.
 *
 * Parameters are already reduced to 1..22 before this call.
 * Returns RAW sums; caller must reduce each value.
 *
 * Labelling:
 *   a = reduced day     (A)
 *   b = reduced month   (B)
 *   c = reduced year    (C)
 *   d = reduced total   (D)
 *
 * REPLACE THIS FUNCTION to use a different positional system.
 */
export function computeRawPositions(a: number, b: number, c: number, d: number) {
  return {
    // Cardinal points of the diamond
    sky: d,               // Top  — predestination, purpose
    earth: a + c,         // Bottom — material, physical world
    male: a + b,          // Right — active, social, masculine
    female: b + c,        // Left  — receptive, emotional, feminine

    // Diagonals of the octagram
    northeast: d + (a + b),
    southeast: (a + b) + (a + c),
    southwest: (a + c) + (b + c),
    northwest: (b + c) + d,

    // Center — core personality / life energy
    center: a + b + c + d,
  };
}

// ---- SWAP POINT 4: Derived interpretation positions ---------

/**
 * Derives human-readable interpretation keys from reduced positions.
 *
 * REPLACE THIS FUNCTION to map different positional meanings.
 */
export function computeRawInterpretationPositions(
  positions: ReturnType<typeof computeRawPositions>,
  reduced: {
    center: number;
    sky: number;
    earth: number;
    male: number;
    female: number;
    northeast: number;
    northwest: number;
    southeast: number;
    southwest: number;
  }
) {
  return {
    purpose: reduced.sky,                          // = sky (unchanged)
    relationships: reduced.center + reduced.female, // raw sum for reduction
    finances: reduced.center + reduced.male,        // raw sum for reduction
    talents: reduced.center + reduced.earth,        // raw sum for reduction
    growth: reduced.center + reduced.sky,           // raw sum for reduction
    karma: reduced.southwest + reduced.southeast,   // raw sum for reduction
    strengths: reduced.northeast + reduced.northwest, // raw sum for reduction
  };
}

// ---- SWAP POINT 5: Compatibility scoring weights ------------

export const COMPATIBILITY_WEIGHTS = {
  emotional: 0.30,
  practical: 0.25,
  communication: 0.25,
  values: 0.20,
} as const;

/**
 * Element affinity table: percentage harmony 0..100.
 * Row = element A, Col = element B.
 *
 * REPLACE THIS TABLE to change compatibility logic.
 */
export const ELEMENT_AFFINITY: Record<string, Record<string, number>> = {
  fire:   { fire: 90, air: 80, earth: 60, water: 50, spirit: 65 },
  air:    { fire: 80, air: 88, earth: 55, water: 60, spirit: 65 },
  earth:  { fire: 60, air: 55, earth: 92, water: 80, spirit: 65 },
  water:  { fire: 50, air: 60, earth: 80, water: 90, spirit: 65 },
  spirit: { fire: 65, air: 65, earth: 65, water: 65, spirit: 75 },
};

export const FORMULA_VERSION = "v1.0-matrix-destiny-standard";
