import { describe, expect, it } from "vitest";
import { assessmentScales } from "@/data/assessmentScales";
import { SOURCES } from "@/data/sources";
import { bandFor, camIcu, choose, must, news2, news2SpO2, scoreItems, type ScaleDef } from "./scores";

const scale = (id: string) => assessmentScales.find((s) => s.id === id) as ScaleDef;
const pick = (s: ScaleDef, labels: string[]) =>
  labels.reduce((sel, label) => {
    const item = s.items.findIndex((it) => it.options.some((o) => o.label === label));
    const option = s.items[item].options.findIndex((o) => o.label === label);
    return choose(s.items, sel, item, option);
  }, {});

describe("assessment data", () => {
  it.each(assessmentScales.map((s) => [s.id, s] as const))("%s: bands cover the range without gaps and sources exist", (_, s) => {
    for (const id of s.sources) expect(SOURCES[id], id).toBeDefined();
    if (s.kind !== "items" || !s.bands.length) return;
    const sorted = [...s.bands].sort((a, b) => a.min - b.min);
    const excluded = s.items.filter((i) => i.excludeFromBand).reduce((n, i) => n + Math.max(...i.options.map((o) => o.points)), 0);
    const min = s.items.filter((i) => !i.multi && !i.excludeFromBand).reduce((n, i) => n + Math.min(...i.options.map((o) => o.points)), 0);
    const max = s.items.filter((i) => !i.excludeFromBand).reduce((n, i) => n + (i.multi ? i.options.reduce((a, o) => a + o.points, 0) : Math.max(...i.options.map((o) => o.points))), 0);
    expect(sorted[0].min).toBeLessThanOrEqual(min);
    expect(sorted[sorted.length - 1].max).toBeGreaterThanOrEqual(max);
    expect(s.range[1]).toBe(max + excluded);
    for (let i = 1; i < sorted.length; i++) expect(sorted[i].min).toBeGreaterThan(sorted[i - 1].max);
  });
});

describe("scoreItems", () => {
  it("withholds the result until every single-choice item is answered", () => {
    const gcs = scale("gcs");
    const partial = scoreItems(gcs.items, pick(gcs, ["Spontaneous", "Oriented"]));
    expect(partial.complete).toBe(false);
    const full = scoreItems(gcs.items, pick(gcs, ["To pressure", "Words", "Abnormal flexion"]));
    expect(full).toMatchObject({ complete: true, total: 8 });
    expect(bandFor(gcs.bands, full.total)?.label).toBe("Severe");
  });

  it("CHA₂DS₂-VASc: the sex point counts in the total but not the recommendation", () => {
    const c = scale("cha2ds2-vasc");
    const r = scoreItems(c.items, pick(c, ["65–74", "Female"]));
    expect(r).toMatchObject({ total: 2, bandScore: 1 });
    expect(bandFor(c.bands, r.bandScore)?.label).toBe("Intermediate");
    const male = scoreItems(c.items, pick(c, ["65–74", "Male", "Hypertension"]));
    expect(bandFor(c.bands, male.bandScore)?.label).toBe("High risk");
  });

  it("checklists toggle and Wells half points land in the right band", () => {
    const w = scale("wells-pe");
    let sel = pick(w, ["Heart rate > 100 bpm", "Previous DVT or PE", "Haemoptysis"]);
    expect(scoreItems(w.items, sel).total).toBe(4);
    expect(bandFor(w.bands, 4)?.label).toBe("PE unlikely");
    sel = choose(w.items, sel, 0, 6);
    expect(bandFor(w.bands, scoreItems(w.items, sel).total)?.label).toBe("PE likely");
    sel = choose(w.items, sel, 0, 6);
    expect(scoreItems(w.items, sel).total).toBe(4);
  });

  it("PHQ-9 item 9 raises a safety flag", () => {
    const p = scale("phq9");
    const sel = Object.fromEntries(p.items.map((_, i) => [i, [i === 8 ? 1 : 0]]));
    const r = scoreItems(p.items, sel);
    expect(r.total).toBe(1);
    expect(r.flags[0]).toMatch(/suicide risk/);
  });

  it("Waterlow scores sex and age as separate items", () => {
    const w = scale("waterlow");
    const sex = w.items.findIndex((i) => i.factor === "Sex");
    const age = w.items.findIndex((i) => i.factor === "Age");
    const r = scoreItems(w.items, { [sex]: [1], [age]: [3] });
    expect(r.total).toBe(2 + 4);
    expect(r.complete).toBe(false);
  });
});

describe("NEWS2", () => {
  const base = { rr: 16, spo2: 97, sbp: 125, hr: 75, temp: 37, scale2: false, onOxygen: false, cvpu: false };

  it("scores a normal set of observations 0", () => {
    const r = news2(base);
    expect(r.ok && r.value.total).toBe(0);
  });

  it("adds the oxygen point and flags a single 3", () => {
    const r = news2({ ...base, rr: 26, onOxygen: true });
    expect(r.ok && r.value).toMatchObject({ total: 5, singleThree: true, risk: "medium" });
  });

  it("Scale 2 only penalises high SpO₂ when on oxygen", () => {
    expect(news2SpO2(95, true, false)).toBe(0);
    expect(news2SpO2(93, true, true)).toBe(1);
    expect(news2SpO2(95, true, true)).toBe(2);
    expect(news2SpO2(97, true, true)).toBe(3);
    expect(news2SpO2(88, true, true)).toBe(0);
    expect(news2SpO2(84, true, false)).toBe(2);
  });

  it("uses the RCP boundaries", () => {
    const at = (patch: Partial<typeof base>) => {
      const r = news2({ ...base, ...patch });
      return r.ok ? r.value.total : NaN;
    };
    expect(at({ temp: 38.1 })).toBe(1);
    expect(at({ temp: 39.1 })).toBe(2);
    expect(at({ hr: 131 })).toBe(3);
    expect(at({ sbp: 220 })).toBe(3);
    expect(at({ rr: 21 })).toBe(2);
  });

  it("withholds the score when a value is missing or impossible", () => {
    expect(news2({ ...base, hr: null }).ok).toBe(false);
    expect(news2({ ...base, spo2: 140 })).toMatchObject({ ok: false, reason: "range" });
  });
});

describe("MUST", () => {
  it("scores BMI, weight loss and acute illness", () => {
    const r = must({ weight: 54, height: 170, previousWeight: 61, acute: false });
    // BMI 18.7 → 1; loss 11.5 % → 2
    expect(r.ok && r.value).toMatchObject({ bmiScore: 1, lossScore: 2, total: 3, risk: "high" });
  });
  it("treats a missing previous weight as no known loss", () => {
    const r = must({ weight: 70, height: 170, previousWeight: null, acute: true });
    expect(r.ok && r.value).toMatchObject({ lossScore: 0, acuteScore: 2, total: 2 });
  });
  it("needs weight and height", () => {
    expect(must({ weight: null, height: 170, previousWeight: null, acute: false }).ok).toBe(false);
  });
});

describe("CAM-ICU", () => {
  const empty = { rass: null, acuteChange: null, attentionErrors: null, thinkingErrors: null };
  it("does not call a result before the steps are done", () => {
    expect(camIcu(empty)).toEqual({ status: "incomplete", next: "rass" });
    expect(camIcu({ ...empty, rass: 0 })).toEqual({ status: "incomplete", next: "feature1" });
  });
  it("cannot assess deep sedation", () => {
    expect(camIcu({ ...empty, rass: -4 }).status).toBe("unable");
  });
  it("stops negative at feature 1 or 2", () => {
    expect(camIcu({ ...empty, rass: 0, acuteChange: false })).toEqual({ status: "negative", stoppedAt: 1 });
    expect(camIcu({ ...empty, rass: 0, acuteChange: true, attentionErrors: 2 })).toEqual({ status: "negative", stoppedAt: 2 });
  });
  it("is positive through feature 3 when RASS is not 0", () => {
    expect(camIcu({ ...empty, rass: -2, acuteChange: true, attentionErrors: 3 })).toEqual({ status: "positive", via: "feature3" });
  });
  it("uses feature 4 when RASS is 0", () => {
    const s = { ...empty, rass: 0, acuteChange: true, attentionErrors: 5 };
    expect(camIcu(s)).toEqual({ status: "incomplete", next: "feature4" });
    expect(camIcu({ ...s, thinkingErrors: 2 })).toEqual({ status: "positive", via: "feature4" });
    expect(camIcu({ ...s, thinkingErrors: 1 })).toEqual({ status: "negative", stoppedAt: 4 });
  });
});
