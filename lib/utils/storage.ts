"use client";

/**
 * localStorage utilities for anonymous history persistence.
 * Works only in the browser (client-side only).
 */

import type { HistoryEntry, MatrixResult, CompatibilityResult } from "@/types";
import { generateToken } from "@/lib/utils";

const HISTORY_KEY = "matrix_destiny_history";
const MAX_ENTRIES = 20;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveMatrixToHistory(result: MatrixResult): HistoryEntry {
  const entry: HistoryEntry = {
    id: generateToken(10),
    type: "matrix",
    label: result.input.name
      ? `${result.input.name} — ${formatDate(result.input.dateOfBirth)}`
      : `Матрица ${formatDate(result.input.dateOfBirth)}`,
    createdAt: new Date().toISOString(),
    data: result,
  };
  persistEntry(entry);
  return entry;
}

export function saveCompatibilityToHistory(result: CompatibilityResult): HistoryEntry {
  const nameA = result.personA.input.name || "Партнёр А";
  const nameB = result.personB.input.name || "Партнёр Б";
  const entry: HistoryEntry = {
    id: generateToken(10),
    type: "compatibility",
    label: `${nameA} & ${nameB} — ${result.score}%`,
    createdAt: new Date().toISOString(),
    data: result,
  };
  persistEntry(entry);
  return entry;
}

export function removeFromHistory(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

// ---- Internal helpers --------------------------------------

function persistEntry(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
