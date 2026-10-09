import { describe, expect, it } from "vitest";
import { interpretABG } from "./abg";

describe("interpretABG", () => {
  it("returns null until pH, PaCO2 and HCO3 are all entered", () => {
    expect(interpretABG({ ph: null, pco2: 40, hco3: 24 })).toBeNull();
    expect(interpretABG({ ph: 7.4, pco2: null, hco3: 24 })).toBeNull();
  });
  it("reads a normal gas as normal", () => {
    const r = interpretABG({ ph: 7.4, pco2: 40, hco3: 24 })!;
    expect(r.status).toBe("normal");
    expect(r.primary).toBe("normal");
  });
  it("finds metabolic acidosis with appropriate respiratory compensation (Winter's formula)", () => {
    const r = interpretABG({ ph: 7.25, pco2: 26, hco3: 12 })!;
    expect(r.primary).toBe("metabolic_acidosis");
    expect(r.compensation?.expected).toEqual({ low: 24, high: 28 });
    expect(r.compensation?.verdict).toBe("appropriate");
  });
  it("flags an added respiratory acidosis when PaCO2 is above Winter's range", () => {
    expect(interpretABG({ ph: 7.25, pco2: 34, hco3: 12 })!.compensation?.verdict).toBe("additional_respiratory_acidosis");
    expect(interpretABG({ ph: 7.25, pco2: 20, hco3: 12 })!.compensation?.verdict).toBe("additional_respiratory_alkalosis");
  });
  it("finds respiratory acidosis and reports acute vs chronic expected HCO3", () => {
    const r = interpretABG({ ph: 7.3, pco2: 60, hco3: 29 })!;
    expect(r.primary).toBe("respiratory_acidosis");
    expect(r.compensation?.expected).toEqual({ low: 26, high: 31 });
  });
  it("finds mixed acidosis when both PaCO2 and HCO3 push toward acid", () => {
    expect(interpretABG({ ph: 7.1, pco2: 55, hco3: 16 })!.primary).toBe("mixed_acidosis");
  });
  it("calculates the anion gap only when Na and Cl are given", () => {
    expect(interpretABG({ ph: 7.25, pco2: 26, hco3: 12 })!.anionGap).toBeNull();
    expect(interpretABG({ ph: 7.25, pco2: 26, hco3: 12, na: 140, cl: 104 })!.anionGap).toEqual({ value: 24, high: true });
  });
  it("classifies P/F ratio and accepts FiO2 as % or fraction", () => {
    expect(interpretABG({ ph: 7.4, pco2: 40, hco3: 24, pao2: 60, fio2: 40 })!.pf).toEqual({ value: 150, category: "moderate" });
    expect(interpretABG({ ph: 7.4, pco2: 40, hco3: 24, pao2: 90, fio2: 0.21 })!.pf?.category).toBe("normal");
  });
  it("adjusts venous values before interpreting a VBG", () => {
    const r = interpretABG({ ph: 7.32, pco2: 50, hco3: 24, mode: "vbg" })!;
    expect(r.ph).toBeCloseTo(7.35, 5);
    expect(r.pco2).toBe(45);
  });
});
