// ============================================================
// Core domain types for Matrix of Destiny & Compatibility
// ============================================================

/** ISO date string "YYYY-MM-DD" */
export type ISODateString = string;

/** Arcana number 1..22 */
export type ArcanaNumber = number;

export type ArcanaElement = "fire" | "water" | "earth" | "air" | "spirit";

// ---- Arcana ------------------------------------------------

export interface ArcanaEntry {
  title: string;
  subtitle: string;
  shortMeaning: string;
  element: ArcanaElement;
  keywords: string[];
  strengths: string[];
  challenges: string[];
  relationshipMeaning: string;
  financeMeaning: string;
  advice: string;
  numericalNote: string;
}

// ---- Matrix ------------------------------------------------

/** Raw input parsed from date */
export interface MatrixInput {
  dateOfBirth: ISODateString;
  name?: string;
  /** Parsed day 1..31 */
  day: number;
  /** Parsed month 1..12 */
  month: number;
  /** Full year e.g. 1990 */
  year: number;
}

/** The 4 base personal numbers derived from DOB */
export interface BaseNumbers {
  /** Day digit (reduced to 1..22) */
  day: ArcanaNumber;
  /** Month digit (reduced to 1..22) */
  month: ArcanaNumber;
  /** Year digit sum (reduced to 1..22) */
  year: ArcanaNumber;
  /** Total = day+month+year reduced to 1..22 */
  total: ArcanaNumber;
}

/** Nine-point octagram positions */
export interface MatrixPositions {
  /** Center / core energy */
  center: ArcanaNumber;
  /** Top / Sky — destiny & purpose */
  sky: ArcanaNumber;
  /** Bottom / Earth — material & physical */
  earth: ArcanaNumber;
  /** Right / Male — active & social */
  male: ArcanaNumber;
  /** Left / Female — receptive & emotional */
  female: ArcanaNumber;
  /** NE diagonal */
  northeast: ArcanaNumber;
  /** SE diagonal */
  southeast: ArcanaNumber;
  /** SW diagonal */
  southwest: ArcanaNumber;
  /** NW diagonal */
  northwest: ArcanaNumber;
}

/** Derived interpretation positions */
export interface InterpretationPositions {
  /** Spiritual destiny (= sky) */
  purpose: ArcanaNumber;
  /** Relationship energy */
  relationships: ArcanaNumber;
  /** Financial energy */
  finances: ArcanaNumber;
  /** Talents & skills */
  talents: ArcanaNumber;
  /** Growth & evolution zone */
  growth: ArcanaNumber;
  /** Karmic energy */
  karma: ArcanaNumber;
  /** Strengths */
  strengths: ArcanaNumber;
}

/** Full matrix result */
export interface MatrixResult {
  input: MatrixInput;
  baseNumbers: BaseNumbers;
  positions: MatrixPositions;
  interpretations: InterpretationPositions;
  meta: {
    calculatedAt: string;
    formulaVersion: string;
  };
}

// ---- Compatibility -----------------------------------------

export interface CompatibilitySubScore {
  label: string;
  score: number; // 0..100
  description: string;
  details: string[];
}

export interface CompatibilityResult {
  personA: MatrixResult;
  personB: MatrixResult;
  score: number; // 0..100
  grade: "Сложный путь" | "Рост через трудности" | "Гармоничный союз" | "Глубокое единство" | "Идеальный резонанс";
  subscores: {
    emotional: CompatibilitySubScore;
    practical: CompatibilitySubScore;
    communication: CompatibilitySubScore;
    values: CompatibilitySubScore;
  };
  overlaps: ArcanaNumber[]; // shared arcana
  tensions: { positions: [string, string]; arcana: [ArcanaNumber, ArcanaNumber]; note: string }[];
  summary: string;
  recommendations: string[];
  meta: {
    calculatedAt: string;
    formulaVersion: string;
  };
}

// ---- History (localStorage) --------------------------------

export interface HistoryEntry {
  id: string;
  type: "matrix" | "compatibility";
  label: string;
  createdAt: string;
  data: MatrixResult | CompatibilityResult;
}

// ---- Forms -------------------------------------------------

export interface MatrixFormValues {
  name: string;
  dateOfBirth: string;
}

export interface CompatibilityFormValues {
  name1: string;
  dateOfBirth1: string;
  name2: string;
  dateOfBirth2: string;
}

// ---- API payloads ------------------------------------------

export interface ApiMatrixRequest {
  name?: string;
  dateOfBirth: ISODateString;
}

export interface ApiCompatibilityRequest {
  name1?: string;
  dateOfBirth1: ISODateString;
  name2?: string;
  dateOfBirth2: ISODateString;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
