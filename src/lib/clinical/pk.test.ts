import { describe, expect, it } from "vitest";
import pharma from "@/data/pharma-i18n.json";
import { accumulationFactor, concentrationCurve, formatMinutes, fractionRemaining, pick, timeToSteadyState } from "./pk";

describe("pharmacokinetics model", () => {
  it("halves each half-life", () => {
    expect([1, 2, 3, 4, 5].map((n) => 100 - fractionRemaining(n) * 100)).toEqual([50, 75, 87.5, 93.75, 96.875]);
  });

  it("reaches about 97 % of steady state in 5 half-lives", () => {
    expect(timeToSteadyState(6)).toBeCloseTo(30.4, 1);
    expect(timeToSteadyState(1, 0.5)).toBeCloseTo(1, 5);
  });

  it("accumulates to 2× when dosing every half-life", () => {
    expect(accumulationFactor(8, 8)).toBeCloseTo(2, 6);
    expect(accumulationFactor(4, 12)).toBeCloseTo(8 / 7, 6);
  });

  it("superposes repeated doses toward the steady-state peak", () => {
    const curve = concentrationCurve({ halfLife: 8, tau: 8, doses: 12, until: 96, step: 1 });
    const peaks = curve.filter((p) => p.t % 8 === 0).map((p) => p.c);
    expect(peaks[0]).toBeCloseTo(1, 6);
    expect(Math.max(...peaks)).toBeLessThan(2);
    expect(Math.max(...peaks)).toBeGreaterThan(1.99);
    expect(curve.every((p) => p.c >= 0 && Number.isFinite(p.c))).toBe(true);
  });

  it("formats durations", () => {
    expect(formatMinutes(2.5)).toBe("2.5 min");
    expect(formatMinutes(300)).toBe("5 h");
    expect(formatMinutes(68400)).toBe("48 d");
  });

  it("compares numbers, not text length, and reports ties as none", () => {
    expect(pick({ item: "A", value: 69120 }, { item: "B", value: 300 }, "lower")).toBe("B");
    expect(pick({ item: "A", value: 2 }, { item: "B", value: 7.5 }, "higher")).toBe("B");
    expect(pick({ item: "A", value: null }, { item: "B", value: 1 }, "higher")).toBeNull();
    expect(pick({ item: "A", value: 0 }, { item: "B", value: 0 }, "lower")).toBeNull();
  });

  it("gives every drug numeric fields", () => {
    for (const d of pharma.drugs) {
      expect(d.halfLifeMin, d.name).toBeGreaterThan(0);
      for (const v of [d.onsetMin, d.durationMin]) expect(v === null || typeof v === "number", d.name).toBe(true);
    }
  });
});
