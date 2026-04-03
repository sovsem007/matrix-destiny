/**
 * Compatibility Engine — computes relationship score between two matrices.
 *
 * Entry point: calculateCompatibility(personA, personB)
 *
 * Scoring is explainable: each subscore carries a description
 * and detail strings so the UI can show exactly why the score is
 * what it is.
 *
 * SWAP POINTS are documented in formulas.config.ts.
 */

import type {
  MatrixResult,
  CompatibilityResult,
  CompatibilitySubScore,
  ArcanaNumber,
} from "@/types";
import { ARCANA } from "@/lib/interpretations/arcana";
import {
  COMPATIBILITY_WEIGHTS,
  ELEMENT_AFFINITY,
  FORMULA_VERSION,
} from "./formulas.config";

// ---- Public API --------------------------------------------

export function calculateCompatibility(
  personA: MatrixResult,
  personB: MatrixResult
): CompatibilityResult {
  const emotional = scoreEmotional(personA, personB);
  const practical = scorePractical(personA, personB);
  const communication = scoreCommunication(personA, personB);
  const values = scoreValues(personA, personB);

  const score = Math.round(
    emotional.score * COMPATIBILITY_WEIGHTS.emotional +
    practical.score * COMPATIBILITY_WEIGHTS.practical +
    communication.score * COMPATIBILITY_WEIGHTS.communication +
    values.score * COMPATIBILITY_WEIGHTS.values
  );

  const overlaps = findOverlaps(personA, personB);
  const tensions = findTensions(personA, personB);
  const summary = buildSummary(score, personA, personB, overlaps);
  const recommendations = buildRecommendations(score, emotional, practical, communication, values);

  return {
    personA,
    personB,
    score,
    grade: gradeLabel(score),
    subscores: { emotional, practical, communication, values },
    overlaps,
    tensions,
    summary,
    recommendations,
    meta: {
      calculatedAt: new Date().toISOString(),
      formulaVersion: FORMULA_VERSION,
    },
  };
}

// ---- Subscore calculators ----------------------------------

/** Emotional compatibility: female energy + relationship positions */
function scoreEmotional(a: MatrixResult, b: MatrixResult): CompatibilitySubScore {
  const femaleScore = affinityScore(a.positions.female, b.positions.female);
  const relScore = affinityScore(a.interpretations.relationships, b.interpretations.relationships);
  const score = Math.round((femaleScore * 0.5 + relScore * 0.5));

  return {
    label: "Эмоциональная совместимость",
    score,
    description: scoreToPhrase(score, "эмоциональной близости"),
    details: [
      `Женская/эмоциональная энергия: ${arcanaTitle(a.positions.female)} ↔ ${arcanaTitle(b.positions.female)} — ${femaleScore}%`,
      `Энергия отношений: ${arcanaTitle(a.interpretations.relationships)} ↔ ${arcanaTitle(b.interpretations.relationships)} — ${relScore}%`,
    ],
  };
}

/** Practical compatibility: earth + male energy */
function scorePractical(a: MatrixResult, b: MatrixResult): CompatibilitySubScore {
  const earthScore = affinityScore(a.positions.earth, b.positions.earth);
  const maleScore = affinityScore(a.positions.male, b.positions.male);
  const score = Math.round((earthScore * 0.5 + maleScore * 0.5));

  return {
    label: "Бытовая совместимость",
    score,
    description: scoreToPhrase(score, "практическом взаимодействии"),
    details: [
      `Материальная энергия: ${arcanaTitle(a.positions.earth)} ↔ ${arcanaTitle(b.positions.earth)} — ${earthScore}%`,
      `Активная/деловая энергия: ${arcanaTitle(a.positions.male)} ↔ ${arcanaTitle(b.positions.male)} — ${maleScore}%`,
    ],
  };
}

/** Communication compatibility: center energy */
function scoreCommunication(a: MatrixResult, b: MatrixResult): CompatibilitySubScore {
  const centerScore = affinityScore(a.positions.center, b.positions.center);
  const growthScore = affinityScore(a.interpretations.growth, b.interpretations.growth);
  const score = Math.round((centerScore * 0.6 + growthScore * 0.4));

  return {
    label: "Коммуникация",
    score,
    description: scoreToPhrase(score, "общении и понимании"),
    details: [
      `Центральная энергия: ${arcanaTitle(a.positions.center)} ↔ ${arcanaTitle(b.positions.center)} — ${centerScore}%`,
      `Зона роста: ${arcanaTitle(a.interpretations.growth)} ↔ ${arcanaTitle(b.interpretations.growth)} — ${growthScore}%`,
    ],
  };
}

/** Values compatibility: sky/purpose energy */
function scoreValues(a: MatrixResult, b: MatrixResult): CompatibilitySubScore {
  const skyScore = affinityScore(a.positions.sky, b.positions.sky);
  const karmaScore = affinityScore(a.interpretations.karma, b.interpretations.karma);
  const score = Math.round((skyScore * 0.6 + karmaScore * 0.4));

  return {
    label: "Ценности",
    score,
    description: scoreToPhrase(score, "ценностях и смыслах"),
    details: [
      `Предназначение: ${arcanaTitle(a.positions.sky)} ↔ ${arcanaTitle(b.positions.sky)} — ${skyScore}%`,
      `Кармическая энергия: ${arcanaTitle(a.interpretations.karma)} ↔ ${arcanaTitle(b.interpretations.karma)} — ${karmaScore}%`,
    ],
  };
}

// ---- Helpers -----------------------------------------------

/** Compute element-affinity score (0..100) for two arcana numbers */
function affinityScore(a: ArcanaNumber, b: ArcanaNumber): number {
  if (a === b) return 95; // identical energy — very high resonance

  const elemA = ARCANA[a]?.element ?? "spirit";
  const elemB = ARCANA[b]?.element ?? "spirit";

  const base = ELEMENT_AFFINITY[elemA]?.[elemB] ?? 65;

  // Proximity bonus: numbers close to each other harmonize better
  const diff = Math.abs(a - b);
  const proximityBonus = diff <= 2 ? 5 : diff <= 5 ? 2 : 0;

  return Math.min(100, base + proximityBonus);
}

/** All arcana numbers that appear in both matrices */
function findOverlaps(a: MatrixResult, b: MatrixResult): ArcanaNumber[] {
  const setA = new Set<number>([
    ...Object.values(a.positions),
    ...Object.values(a.interpretations),
  ]);
  const setB = new Set<number>([
    ...Object.values(b.positions),
    ...Object.values(b.interpretations),
  ]);
  return [...setA].filter((n) => setB.has(n)) as ArcanaNumber[];
}

/** Position pairs where elements clash (fire↔water or earth↔air) */
function findTensions(
  a: MatrixResult,
  b: MatrixResult
): CompatibilityResult["tensions"] {
  const clashPairs: [string, string][] = [
    ["fire", "water"],
    ["earth", "air"],
  ];
  const tensions: CompatibilityResult["tensions"] = [];

  const positionKeys: Array<keyof typeof a.positions> = [
    "center", "sky", "earth", "male", "female",
  ];

  for (const key of positionKeys) {
    const numA = a.positions[key];
    const numB = b.positions[key];
    const elemA = ARCANA[numA]?.element ?? "spirit";
    const elemB = ARCANA[numB]?.element ?? "spirit";

    const isClash = clashPairs.some(
      ([e1, e2]) =>
        (elemA === e1 && elemB === e2) || (elemA === e2 && elemB === e1)
    );

    if (isClash) {
      tensions.push({
        positions: [key, key],
        arcana: [numA, numB],
        note: `${arcanaTitle(numA)} (${elemA}) и ${arcanaTitle(numB)} (${elemB}) создают напряжение в позиции «${positionLabel(key)}» — это точка роста для пары.`,
      });
    }
  }

  return tensions;
}

function buildSummary(
  score: number,
  a: MatrixResult,
  b: MatrixResult,
  overlaps: ArcanaNumber[]
): string {
  const nameA = a.input.name || "Партнёр А";
  const nameB = b.input.name || "Партнёр Б";
  const grade = gradeLabel(score);
  const sharedStr = overlaps.length > 0
    ? `Вас объединяет общая энергия: ${overlaps.slice(0, 3).map(arcanaTitle).join(", ")}.`
    : "Ваши энергии уникально дополняют друг друга.";

  return `${nameA} и ${nameB} — «${grade}» (${score}/100). ${sharedStr} ${gradeDescription(score)}`;
}

function buildRecommendations(
  score: number,
  emotional: CompatibilitySubScore,
  practical: CompatibilitySubScore,
  communication: CompatibilitySubScore,
  values: CompatibilitySubScore
): string[] {
  const recs: string[] = [];
  const lowest = [emotional, practical, communication, values].sort((a, b) => a.score - b.score);

  if (lowest[0].score < 60) {
    recs.push(`Уделите особое внимание ${lowest[0].label.toLowerCase()} — это ваша зона роста как пары.`);
  }
  if (score >= 75) {
    recs.push("Опирайтесь на сильные стороны вашего союза и практикуйте совместные ритуалы, укрепляющие связь.");
  }
  if (score < 50) {
    recs.push("Различия в ваших энергиях — это не приговор, а вызов и возможность для взаимного роста. Работайте с осознанностью.");
  }
  recs.push("Практикуйте открытые разговоры о ваших ценностях и предназначениях — это укрепит союз.");
  recs.push("Изучите энергии ваших матриц и ищите, как они дополняют друг друга, а не только совпадают.");

  return recs;
}

function gradeLabel(score: number): CompatibilityResult["grade"] {
  if (score >= 88) return "Идеальный резонанс";
  if (score >= 75) return "Глубокое единство";
  if (score >= 60) return "Гармоничный союз";
  if (score >= 45) return "Рост через трудности";
  return "Сложный путь";
}

function gradeDescription(score: number): string {
  if (score >= 88) return "Ваши энергии резонируют на высоком уровне — редкое и драгоценное единство.";
  if (score >= 75) return "Глубокое взаимопонимание и взаимная поддержка. Союз с большим потенциалом.";
  if (score >= 60) return "Хорошая основа для гармоничных отношений. Есть зоны роста, но больше притяжения, чем отталкивания.";
  if (score >= 45) return "Яркие различия создают напряжение, но также драйв для развития. Требует осознанной работы.";
  return "Сложный, но трансформирующий путь. Эти отношения могут стать вашим главным уроком.";
}

function scoreToPhrase(score: number, context: string): string {
  if (score >= 85) return `Высокая гармония в ${context}.`;
  if (score >= 70) return `Хорошее взаимодействие в ${context}.`;
  if (score >= 55) return `Умеренная совместимость в ${context}.`;
  if (score >= 40) return `Есть трудности в ${context}, но они преодолимы.`;
  return `Значительные различия в ${context} — зона роста для пары.`;
}

function arcanaTitle(n: ArcanaNumber): string {
  return ARCANA[n]?.title ?? `Аркан ${n}`;
}

function positionLabel(key: string): string {
  const labels: Record<string, string> = {
    center: "центр",
    sky: "небо/предназначение",
    earth: "земля/материя",
    male: "мужская энергия",
    female: "женская энергия",
    northeast: "северо-восток",
    southeast: "юго-восток",
    southwest: "юго-запад",
    northwest: "северо-запад",
  };
  return labels[key] ?? key;
}
