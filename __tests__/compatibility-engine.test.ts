import { calculateMatrix } from "@/lib/numerology/matrix-engine";
import { calculateCompatibility } from "@/lib/numerology/compatibility-engine";

const DATE_A = "1990-06-15";
const DATE_B = "1985-03-20";

describe("calculateCompatibility", () => {
  let matrixA: ReturnType<typeof calculateMatrix>;
  let matrixB: ReturnType<typeof calculateMatrix>;

  beforeAll(() => {
    matrixA = calculateMatrix(DATE_A, "Мария");
    matrixB = calculateMatrix(DATE_B, "Иван");
  });

  it("returns full compatibility result", () => {
    const result = calculateCompatibility(matrixA, matrixB);
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("grade");
    expect(result).toHaveProperty("subscores");
    expect(result).toHaveProperty("overlaps");
    expect(result).toHaveProperty("tensions");
    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("recommendations");
  });

  it("score is in range 0..100", () => {
    const result = calculateCompatibility(matrixA, matrixB);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("subscores are in range 0..100", () => {
    const result = calculateCompatibility(matrixA, matrixB);
    for (const sub of Object.values(result.subscores)) {
      expect(sub.score).toBeGreaterThanOrEqual(0);
      expect(sub.score).toBeLessThanOrEqual(100);
    }
  });

  it("grade matches score range", () => {
    const result = calculateCompatibility(matrixA, matrixB);
    const validGrades = [
      "Сложный путь",
      "Рост через трудности",
      "Гармоничный союз",
      "Глубокое единство",
      "Идеальный резонанс",
    ];
    expect(validGrades).toContain(result.grade);
  });

  it("same person has highest compatibility with themselves", () => {
    const result = calculateCompatibility(matrixA, matrixA);
    // Same matrix should have high overlap and high score
    expect(result.score).toBeGreaterThan(70);
    expect(result.overlaps.length).toBeGreaterThan(0);
  });

  it("is deterministic", () => {
    const r1 = calculateCompatibility(matrixA, matrixB);
    const r2 = calculateCompatibility(matrixA, matrixB);
    expect(r1.score).toBe(r2.score);
    expect(r1.grade).toBe(r2.grade);
  });

  it("summary is a non-empty string", () => {
    const result = calculateCompatibility(matrixA, matrixB);
    expect(typeof result.summary).toBe("string");
    expect(result.summary.length).toBeGreaterThan(10);
  });

  it("recommendations is a non-empty array", () => {
    const result = calculateCompatibility(matrixA, matrixB);
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("subscores have detail arrays", () => {
    const result = calculateCompatibility(matrixA, matrixB);
    for (const sub of Object.values(result.subscores)) {
      expect(Array.isArray(sub.details)).toBe(true);
      expect(sub.details.length).toBeGreaterThan(0);
      expect(typeof sub.label).toBe("string");
      expect(typeof sub.description).toBe("string");
    }
  });
});
