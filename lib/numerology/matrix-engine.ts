/**
 * Matrix Engine — core calculator for the Matrix of Destiny.
 *
 * Entry point: calculateMatrix(dateOfBirth, name?)
 *
 * All formula logic is in formulas.config.ts.
 * This file only orchestrates: parse → extract → reduce → derive.
 */

import type { MatrixResult, MatrixInput, BaseNumbers, MatrixPositions, InterpretationPositions } from "@/types";
import { reduce } from "./reduction";
import {
  extractRawBaseNumbers,
  computeRawPositions,
  computeRawInterpretationPositions,
  FORMULA_VERSION,
} from "./formulas.config";

// ---- Public API --------------------------------------------

/**
 * Calculate the full Matrix of Destiny for a given date of birth.
 *
 * @param dateOfBirth  ISO date string "YYYY-MM-DD"
 * @param name         Optional person's name for display
 * @returns            Fully typed MatrixResult
 *
 * @throws if dateOfBirth is not a valid date string
 */
export function calculateMatrix(dateOfBirth: string, name?: string): MatrixResult {
  const input = parseInput(dateOfBirth, name);
  const baseNumbers = computeBaseNumbers(input.day, input.month, input.year);
  const positions = computePositions(baseNumbers);
  const interpretations = computeInterpretations(positions);

  return {
    input,
    baseNumbers,
    positions,
    interpretations,
    meta: {
      calculatedAt: new Date().toISOString(),
      formulaVersion: FORMULA_VERSION,
    },
  };
}

// ---- Internal helpers --------------------------------------

function parseInput(dateOfBirth: string, name?: string): MatrixInput {
  const date = new Date(dateOfBirth + "T00:00:00Z");
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: "${dateOfBirth}". Expected "YYYY-MM-DD".`);
  }
  return {
    dateOfBirth,
    name: name?.trim() || undefined,
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };
}

function computeBaseNumbers(day: number, month: number, year: number): BaseNumbers {
  const raw = extractRawBaseNumbers(day, month, year);
  return {
    day: reduce(raw.rawDay),
    month: reduce(raw.rawMonth),
    year: reduce(raw.rawYear),
    total: reduce(raw.rawTotal),
  };
}

function computePositions(base: BaseNumbers): MatrixPositions {
  const { day: a, month: b, year: c, total: d } = base;
  const raw = computeRawPositions(a, b, c, d);
  return {
    center: reduce(raw.center),
    sky: reduce(raw.sky),
    earth: reduce(raw.earth),
    male: reduce(raw.male),
    female: reduce(raw.female),
    northeast: reduce(raw.northeast),
    southeast: reduce(raw.southeast),
    southwest: reduce(raw.southwest),
    northwest: reduce(raw.northwest),
  };
}

function computeInterpretations(positions: MatrixPositions): InterpretationPositions {
  // Build raw values (positions are already reduced, but we need
  // to sum some pairs and reduce again for derived positions).
  const rawDerived = computeRawInterpretationPositions(
    // raw positions (not needed for default impl, but kept for extensibility)
    computeRawPositions(0, 0, 0, 0), // placeholder — unused in default impl
    positions
  );

  return {
    purpose: rawDerived.purpose,                    // already reduced (= sky)
    relationships: reduce(rawDerived.relationships),
    finances: reduce(rawDerived.finances),
    talents: reduce(rawDerived.talents),
    growth: reduce(rawDerived.growth),
    karma: reduce(rawDerived.karma),
    strengths: reduce(rawDerived.strengths),
  };
}
