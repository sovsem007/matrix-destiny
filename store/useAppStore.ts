"use client";

/**
 * Zustand store for lightweight client state.
 * Holds last calculated results and loading/error states.
 * History persistence is handled separately via lib/utils/storage.ts.
 */

import { create } from "zustand";
import type { MatrixResult, CompatibilityResult, HistoryEntry } from "@/types";
import { getHistory, saveMatrixToHistory, saveCompatibilityToHistory, removeFromHistory } from "@/lib/utils/storage";

interface AppState {
  // Last calculated results
  lastMatrix: MatrixResult | null;
  lastCompatibility: CompatibilityResult | null;

  // Loading & error states
  isCalculating: boolean;
  error: string | null;

  // History (loaded from localStorage)
  history: HistoryEntry[];
  historyLoaded: boolean;

  // Actions
  setLastMatrix: (result: MatrixResult) => void;
  setLastCompatibility: (result: CompatibilityResult) => void;
  setCalculating: (v: boolean) => void;
  setError: (msg: string | null) => void;
  loadHistory: () => void;
  saveMatrix: (result: MatrixResult) => void;
  saveCompatibility: (result: CompatibilityResult) => void;
  removeHistoryEntry: (id: string) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  lastMatrix: null,
  lastCompatibility: null,
  isCalculating: false,
  error: null,
  history: [],
  historyLoaded: false,

  setLastMatrix: (result) => set({ lastMatrix: result }),
  setLastCompatibility: (result) => set({ lastCompatibility: result }),
  setCalculating: (v) => set({ isCalculating: v }),
  setError: (msg) => set({ error: msg }),
  clearError: () => set({ error: null }),

  loadHistory: () => {
    const history = getHistory();
    set({ history, historyLoaded: true });
  },

  saveMatrix: (result) => {
    const entry = saveMatrixToHistory(result);
    set({ history: [entry, ...get().history].slice(0, 20) });
  },

  saveCompatibility: (result) => {
    const entry = saveCompatibilityToHistory(result);
    set({ history: [entry, ...get().history].slice(0, 20) });
  },

  removeHistoryEntry: (id) => {
    removeFromHistory(id);
    set({ history: get().history.filter((e) => e.id !== id) });
  },
}));
