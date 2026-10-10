import { describe, expect, it } from "vitest";
import { dripRate, fluidDeficit, freeWaterDeficit, hollidaySegar, potassiumBand, sodiumChange } from "./fluids";

describe("hollidaySegar (4-2-1 rule)", () => {
  it("returns null without a weight", () => expect(hollidaySegar(null)).toBeNull());
  it("applies 4/2/1 mL/kg/h per weight band", () => {
    expect(hollidaySegar(8)).toBe(32);
    expect(hollidaySegar(15)).toBe(50);
    expect(hollidaySegar(70)).toBe(110);
  });
  it("rejects impossible weights", () => expect(hollidaySegar(0)).toBeNull());
});

describe("fluidDeficit", () => {
  it("is weight × % dehydration in mL with an 8 h / 16 h split", () => {
    expect(fluidDeficit(20, 5)).toEqual({ total: 1000, first8h: 500, next16h: 500 });
  });
  it("needs both inputs", () => expect(fluidDeficit(20, null)).toBeNull());
});

describe("freeWaterDeficit", () => {
  it("uses total body water 0.6 (male) / 0.5 (female) × (Na/target − 1)", () => {
    expect(freeWaterDeficit(70, "male", 160, 140)).toBeCloseTo(6, 5);
    expect(freeWaterDeficit(70, "female", 154, 140)).toBeCloseTo(3.5, 5);
  });
  it("returns 0 when sodium is already at or below target", () => {
    expect(freeWaterDeficit(70, "male", 138, 140)).toBe(0);
  });
  it("returns null with missing inputs", () => expect(freeWaterDeficit(null, "male", 160, 140)).toBeNull());
});

describe("sodiumChange", () => {
  it("reports change per hour, projected per 24 h and whether it breaks the limit", () => {
    expect(sodiumChange(118, 124, 6)).toEqual({ perHour: 1, per24h: 24, overLimit: true });
    expect(sodiumChange(118, 120, 8)).toEqual({ perHour: 0.25, per24h: 6, overLimit: false });
  });
  it("uses the stricter 8 mmol/L limit for high-risk patients", () => {
    expect(sodiumChange(118, 121, 8, true)!.overLimit).toBe(true);
  });
  it("needs a positive time", () => expect(sodiumChange(118, 120, 0)).toBeNull());
});

describe("dripRate", () => {
  it("returns mL/h and drops/min", () => expect(dripRate(1000, 8, 20)).toEqual({ mlPerHour: 125, dropsPerMin: 41.7 }));
  it("needs volume and time", () => expect(dripRate(null, 8, 20)).toBeNull());
});

describe("potassiumBand (UK Kidney Association severity)", () => {
  it("classifies potassium", () => {
    expect(potassiumBand(2.3)).toBe("severe_low");
    expect(potassiumBand(3.2)).toBe("low");
    expect(potassiumBand(4.2)).toBe("normal");
    expect(potassiumBand(5.7)).toBe("mild_high");
    expect(potassiumBand(6.2)).toBe("moderate_high");
    expect(potassiumBand(6.5)).toBe("severe_high");
    expect(potassiumBand(null)).toBeNull();
  });
});
