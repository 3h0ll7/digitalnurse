import { describe, expect, it } from "vitest";
import raw from "@/data/lab-interpretations.json";
import { SI_FACTORS, classifyLab, fromSI, labBands, toSI, type LabInterpretation } from "./labs";

const labs = raw as unknown as LabInterpretation[];
const sodium = labs.find((l) => l.id === "sodium")!;

describe("classifyLab", () => {
  it("returns null for an empty value instead of 'critical low'", () => {
    expect(classifyLab(null, sodium)).toBeNull();
  });
  it("classifies sodium across all five bands", () => {
    expect(classifyLab(119, sodium)).toBe("critical_low");
    expect(classifyLab(130, sodium)).toBe("low");
    expect(classifyLab(135, sodium)).toBe("normal");
    expect(classifyLab(145, sodium)).toBe("normal");
    expect(classifyLab(150, sodium)).toBe("high");
    expect(classifyLab(161, sodium)).toBe("critical_high");
  });
});

describe("labBands", () => {
  it("builds ordered gauge bands with padding beyond the critical limits", () => {
    const { min, max, bands } = labBands(sodium);
    expect(min).toBeLessThan(120);
    expect(max).toBeGreaterThan(160);
    expect(bands.map((b) => b.tone)).toEqual(["critical", "warn", "normal", "warn", "critical"]);
    for (let i = 1; i < bands.length; i++) expect(bands[i].from).toBe(bands[i - 1].to);
  });
  it("skips zero-width bands when the low normal is the floor (e.g. troponin)", () => {
    const trop = labs.find((l) => l.id === "troponin_i")!;
    const { bands } = labBands(trop);
    expect(bands.every((b) => b.to > b.from)).toBe(true);
  });
});

describe("SI conversion", () => {
  it("has a factor for every lab", () => {
    for (const lab of labs) expect(SI_FACTORS[lab.id], lab.id).toBeTypeOf("number");
  });
  it("uses standard factors", () => {
    expect(toSI("glucose", 100)).toBeCloseTo(5.55, 2);
    expect(toSI("creatinine", 1)).toBeCloseTo(88.4, 1);
    expect(toSI("hemoglobin", 12)).toBe(120);
    expect(toSI("sodium", 140)).toBe(140);
  });
  it("round-trips", () => {
    for (const lab of labs) expect(fromSI(lab.id, toSI(lab.id, 7))).toBeCloseTo(7, 6);
  });
});

describe("lab data", () => {
  it("keeps only adult ranges (population ranges were synthetic)", () => {
    for (const lab of labs) expect(Object.keys(lab.ranges)).toEqual(["adult"]);
  });
});
