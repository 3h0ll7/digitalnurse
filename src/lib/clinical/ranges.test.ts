import { describe, expect, it } from "vitest";
import ecg from "@/data/ecg-i18n.json";
import { parseRange } from "./ranges";

describe("parseRange", () => {
  it("parses a closed range with a unit", () => {
    expect(parseRange("60–100 bpm")).toEqual({ min: 60, max: 100, unit: "bpm" });
    expect(parseRange("0.01-3 mcg/kg/min")).toEqual({ min: 0.01, max: 3, unit: "mcg/kg/min" });
  });
  it("parses open ranges", () => {
    expect(parseRange("< 60 bpm")).toEqual({ min: null, max: 60, unit: "bpm" });
    expect(parseRange(">100 bpm")).toEqual({ min: 100, max: null, unit: "bpm" });
  });
  it("uses the first range when several are listed", () => {
    expect(parseRange("Idioventricular 20–40 | AIVR 40–100")).toMatchObject({ min: 20, max: 40 });
  });
  it("returns null for text without numbers", () => {
    expect(parseRange("Variable")).toBeNull();
    expect(parseRange("N/A")).toBeNull();
    expect(parseRange("Set by device")).toBeNull();
  });
  it("parses about half of the ECG rhythm rates and never returns min > max", () => {
    const parsed = ecg.rhythms.map((r) => parseRange(r.rate)).filter(Boolean);
    expect(parsed.length).toBeGreaterThanOrEqual(12);
    for (const r of parsed) if (r && r.min !== null && r.max !== null) expect(r.min).toBeLessThanOrEqual(r.max);
  });
});
