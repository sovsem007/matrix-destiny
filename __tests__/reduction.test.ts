import { sumDigits, reduce, reduceToDigit, lifePathNumber, isValidArcana } from "@/lib/numerology/reduction";

describe("sumDigits", () => {
  it("sums digits correctly", () => {
    expect(sumDigits(15)).toBe(6);
    expect(sumDigits(1990)).toBe(19);
    expect(sumDigits(0)).toBe(0);
    expect(sumDigits(22)).toBe(4);
  });
});

describe("reduce (1..22 range)", () => {
  it("returns numbers already in range unchanged", () => {
    expect(reduce(1)).toBe(1);
    expect(reduce(22)).toBe(22);
    expect(reduce(15)).toBe(15);
  });

  it("reduces numbers > 22 by digit sum", () => {
    expect(reduce(23)).toBe(5);   // 2+3=5
    expect(reduce(40)).toBe(4);   // 4+0=4
    expect(reduce(99)).toBe(18);  // 9+9=18
  });

  it("applies zeroFallback for 0", () => {
    expect(reduce(0)).toBe(22);
  });

  it("handles multi-step reduction", () => {
    // 99 → 18 (in range)
    expect(reduce(99)).toBe(18);
    // 199 → 19 (1+9+9=19, in range)
    expect(reduce(199)).toBe(19);
  });

  it("result is always in range [1, 22]", () => {
    for (let n = 0; n <= 200; n++) {
      const r = reduce(n);
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(22);
    }
  });
});

describe("reduceToDigit (1..9 range)", () => {
  it("reduces to single digit", () => {
    expect(reduceToDigit(10)).toBe(1);
    expect(reduceToDigit(19)).toBe(1);
    expect(reduceToDigit(9)).toBe(9);
    expect(reduceToDigit(0)).toBe(9);
  });
});

describe("lifePathNumber", () => {
  it("calculates life path number from ISO date", () => {
    // 1990-06-15 → 1+9+9+0+0+6+1+5 = 31 → 3+1 = 4
    expect(lifePathNumber("1990-06-15")).toBe(4);
  });
});

describe("isValidArcana", () => {
  it("validates arcana range", () => {
    expect(isValidArcana(1)).toBe(true);
    expect(isValidArcana(22)).toBe(true);
    expect(isValidArcana(0)).toBe(false);
    expect(isValidArcana(23)).toBe(false);
    expect(isValidArcana(1.5)).toBe(false);
  });
});
