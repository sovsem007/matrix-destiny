import { calculateMatrix } from "@/lib/numerology/matrix-engine";
import { isValidArcana } from "@/lib/numerology/reduction";

const TEST_DATE = "1990-06-15";

describe("calculateMatrix", () => {
  it("returns a fully typed result object", () => {
    const result = calculateMatrix(TEST_DATE);
    expect(result).toHaveProperty("input");
    expect(result).toHaveProperty("baseNumbers");
    expect(result).toHaveProperty("positions");
    expect(result).toHaveProperty("interpretations");
    expect(result).toHaveProperty("meta");
  });

  it("parses input correctly", () => {
    const result = calculateMatrix(TEST_DATE, "Тест");
    expect(result.input.day).toBe(15);
    expect(result.input.month).toBe(6);
    expect(result.input.year).toBe(1990);
    expect(result.input.name).toBe("Тест");
  });

  it("base numbers are all valid arcana (1..22)", () => {
    const result = calculateMatrix(TEST_DATE);
    const { day, month, year, total } = result.baseNumbers;
    expect(isValidArcana(day)).toBe(true);
    expect(isValidArcana(month)).toBe(true);
    expect(isValidArcana(year)).toBe(true);
    expect(isValidArcana(total)).toBe(true);
  });

  it("all positions are valid arcana (1..22)", () => {
    const result = calculateMatrix(TEST_DATE);
    for (const value of Object.values(result.positions)) {
      expect(isValidArcana(value)).toBe(true);
    }
  });

  it("all interpretations are valid arcana (1..22)", () => {
    const result = calculateMatrix(TEST_DATE);
    for (const value of Object.values(result.interpretations)) {
      expect(isValidArcana(value)).toBe(true);
    }
  });

  it("is deterministic — same input gives same output", () => {
    const r1 = calculateMatrix(TEST_DATE);
    const r2 = calculateMatrix(TEST_DATE);
    expect(r1.positions).toEqual(r2.positions);
    expect(r1.baseNumbers).toEqual(r2.baseNumbers);
  });

  it("handles name as optional", () => {
    const withName = calculateMatrix(TEST_DATE, "Мария");
    const withoutName = calculateMatrix(TEST_DATE);
    expect(withName.positions).toEqual(withoutName.positions);
    expect(withName.input.name).toBe("Мария");
    expect(withoutName.input.name).toBeUndefined();
  });

  it("throws on invalid date", () => {
    expect(() => calculateMatrix("not-a-date")).toThrow();
    expect(() => calculateMatrix("2999-01-01")).not.toThrow(); // future dates allowed by engine
  });

  it("records formula version in meta", () => {
    const result = calculateMatrix(TEST_DATE);
    expect(result.meta.formulaVersion).toBeTruthy();
    expect(typeof result.meta.calculatedAt).toBe("string");
  });
});
