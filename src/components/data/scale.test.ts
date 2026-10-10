import { describe, expect, it } from "vitest";
import { positionPct, shares } from "./scale";

describe("positionPct", () => {
  it("maps a value onto 0–100% of the scale", () => {
    expect(positionPct(5, 0, 10)).toBe(50);
    expect(positionPct(0, 0, 10)).toBe(0);
  });
  it("clamps values outside the scale and reports which side", () => {
    expect(positionPct(-3, 0, 10)).toBe(0);
    expect(positionPct(30, 0, 10)).toBe(100);
  });
});

describe("shares", () => {
  it("turns counts into percentages that add to 100", () => {
    const s = shares([7, 11, 10, 4]);
    expect(s.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 6);
    expect(s[1]).toBeCloseTo(34.375, 3);
  });
  it("returns zeros when every count is zero", () => {
    expect(shares([0, 0])).toEqual([0, 0]);
  });
});
