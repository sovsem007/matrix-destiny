/**
 * Number reduction utilities for the Matrix of Destiny system.
 *
 * All public functions are pure and have no side effects.
 * They operate within the range defined in REDUCTION_CONFIG.
 */

import { REDUCTION_CONFIG } from "./formulas.config";

const { min, max, zeroFallback } = REDUCTION_CONFIG;

/** Sum all decimal digits of a non-negative integer */
export function sumDigits(n: number): number {
  return Math.abs(n)
    .toString()
    .split("")
    .reduce((sum, ch) => sum + parseInt(ch, 10), 0);
}

/**
 * Reduce a number into the arcana range [min..max] by repeatedly
 * summing its digits until the result fits.
 *
 * Examples (default range 1..22):
 *   reduce(15)  → 15   (already in range)
 *   reduce(23)  → 5    (2+3)
 *   reduce(99)  → 18   (9+9=18, in range)
 *   reduce(0)   → 22   (zeroFallback)
 *   reduce(123) → 6    (1+2+3=6)
 *
 * Guard: throws if max iterations exceeded (prevents infinite loop
 * on broken inputs).
 */
export function reduce(n: number): number {
  // Handle negative input
  let value = Math.abs(Math.round(n));

  // Guard against 0 before main loop
  if (value === 0) return zeroFallback;

  let iterations = 0;
  while (value > max || value < min) {
    if (iterations++ > 20) {
      // Fallback: shouldn't happen with valid dates
      return min;
    }
    value = sumDigits(value);
    if (value === 0) return zeroFallback;
  }

  return value;
}

/**
 * Reduce a number to a single digit 1..9.
 * Used for Pythagorean / life-path calculations (not the main engine).
 */
export function reduceToDigit(n: number): number {
  let value = Math.abs(Math.round(n));
  if (value === 0) return 9; // 0 not allowed
  while (value > 9) {
    value = sumDigits(value);
    if (value === 0) return 9;
  }
  return value;
}

/**
 * Compute the "life path" number: sum all digits of the full date
 * then reduce to a single digit.
 *
 * dateOfBirth: "YYYY-MM-DD"
 */
export function lifePathNumber(dateOfBirth: string): number {
  const digits = dateOfBirth.replace(/-/g, "").split("").map(Number);
  const total = digits.reduce((s, d) => s + d, 0);
  return reduceToDigit(total);
}

/**
 * Normalize a raw number (potentially large) to the arcana range.
 * Alias of reduce() for clarity at call sites.
 */
export const normalize = reduce;

/** Returns true if n is a valid arcana number */
export function isValidArcana(n: number): boolean {
  return Number.isInteger(n) && n >= min && n <= max;
}
