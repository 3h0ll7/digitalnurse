import { describe, expect, it } from "vitest";
import ecg from "@/data/ecg-i18n.json";
import { filterRhythms, RHYTHM_RATES, severityCounts, type RhythmLike } from "./ecg";

const rhythms = ecg.rhythms as RhythmLike[];

describe("ECG reference", () => {
  it("counts every rhythm once across severities", () => {
    expect(severityCounts(rhythms).reduce((n, s) => n + s.count, 0)).toBe(rhythms.length);
  });

  it("treats LIFE as every life-threatening rhythm", () => {
    const life = filterRhythms(rhythms, { category: "LIFE", severity: null, query: "" });
    expect(life.length).toBeGreaterThan(0);
    expect(life.every((r) => r.severity === "LIFE_THREATENING")).toBe(true);
  });

  it("searches names and interventions", () => {
    expect(filterRhythms(rhythms, { category: "ALL", severity: null, query: "torsades" }).length).toBeGreaterThan(0);
    expect(filterRhythms(rhythms, { category: "ALL", severity: null, query: "adenosine" }).map((r) => r.nameEn)).toContain("Supraventricular Tachycardia (SVT)");
  });

  it("charts rates only for rhythms that exist, with sane bounds", () => {
    const ids = new Set((ecg.rhythms as { id: number }[]).map((r) => r.id));
    for (const r of RHYTHM_RATES) {
      expect(ids.has(r.id), r.label).toBe(true);
      if (r.min !== null && r.max !== null) expect(r.min).toBeLessThan(r.max);
    }
  });

  it("uses AHA 2020 doses for atropine and adenosine", () => {
    const text = JSON.stringify(ecg);
    expect(text).not.toMatch(/Atropine 0\.5/i);
    expect(text).not.toMatch(/12 ?mg,? then 12 ?mg/i);
    expect(text).toContain("Atropine 1 mg IV every 3–5 min (max 3 mg)");
  });

  it("has a category label for every rhythm and no empty categories", () => {
    for (const lang of ["en", "ar"] as const) {
      const cats = Object.keys(ecg[lang].categories);
      for (const r of ecg.rhythms) expect(cats, r.nameEn).toContain(r.category);
      for (const c of cats.filter((c) => c !== "ALL")) expect(filterRhythms(rhythms, { category: c, severity: null, query: "" }).length, c).toBeGreaterThan(0);
    }
  });
});
