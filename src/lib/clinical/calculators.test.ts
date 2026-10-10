import { describe, expect, it } from "vitest";
import {
  bmi, bsa, burnFluids, cockcroftGault, dosageVolume, heparinInitial, heparinAdjust, ibw, insulinDrip,
  pregnancyDates, slidingScale, vasoactive, VASOACTIVE,
} from "./calculators";

const value = <T,>(r: { ok: true; value: T } | { ok: false }) => (r.ok ? r.value : null);

describe("input handling", () => {
  it("reports empty inputs instead of computing with 0", () => {
    expect(bmi(null, 170)).toEqual({ ok: false, reason: "empty" });
    expect(ibw("male", null, null)).toEqual({ ok: false, reason: "empty" });
  });
  it("reports out-of-range inputs with the field name", () => {
    expect(bmi(70, 20)).toEqual({ ok: false, reason: "range", field: "height" });
    expect(cockcroftGault(10, 70, 1, "male")).toEqual({ ok: false, reason: "range", field: "age" });
  });
});

describe("dosageVolume", () => {
  it("is ordered / available × volume", () => expect(value(dosageVolume(500, 250, 5))).toBe(10));
});

describe("bmi (WHO classes)", () => {
  it("classifies obesity grades", () => {
    expect(value(bmi(70, 175))).toEqual({ bmi: 22.9, cls: "normal" });
    expect(value(bmi(110, 175))!.cls).toBe("obese2");
    expect(value(bmi(130, 170))!.cls).toBe("obese3");
    expect(value(bmi(50, 175))!.cls).toBe("under");
  });
});

describe("cockcroftGault", () => {
  it("applies 0.85 for women", () => {
    expect(value(cockcroftGault(60, 72, 1, "male"))).toBe(80);
    expect(value(cockcroftGault(60, 72, 1, "female"))).toBe(68);
  });
});

describe("vasoactive", () => {
  it("needs a weight for weight-based drugs instead of assuming 1 kg", () => {
    expect(vasoactive({ drug: "norepinephrine", amount: 4, volume: 250, weight: null, rate: 10 })).toEqual({ ok: false, reason: "empty" });
  });
  it("turns a pump rate into a dose", () => {
    // 4 mg / 250 mL = 16 mcg/mL; 10 mL/h × 16 / (80 kg × 60) = 0.033 mcg/kg/min
    const r = value(vasoactive({ drug: "norepinephrine", amount: 4, volume: 250, weight: 80, rate: 10 }))!;
    expect(r.dose).toBeCloseTo(0.0333, 3);
    expect(r.zone).toBe("in_range");
  });
  it("turns a target dose into a pump rate", () => {
    const r = value(vasoactive({ drug: "norepinephrine", amount: 4, volume: 250, weight: 80, dose: 0.1 }))!;
    expect(r.rate).toBeCloseTo(30, 5);
  });
  it("handles vasopressin in units/min without weight", () => {
    const r = value(vasoactive({ drug: "vasopressin", amount: 20, volume: 100, weight: null, rate: 12 }))!;
    expect(r.dose).toBeCloseTo(0.04, 5);
  });
  it("flags doses outside the reference range", () => {
    expect(value(vasoactive({ drug: "norepinephrine", amount: 4, volume: 250, weight: 50, dose: 4 }))!.zone).toBe("above_range");
  });
  it("uses the same ranges as the drug catalogue", () => {
    expect(VASOACTIVE.norepinephrine.range).toEqual({ min: 0.01, max: 3 });
    expect(VASOACTIVE.phenylephrine.range).toEqual({ min: 0.2, max: 5 });
  });
});

describe("heparin", () => {
  it("uses 80 u/kg + 18 u/kg/h for VTE", () => {
    expect(value(heparinInitial("vte", 70))).toEqual({ bolus: 5600, rate: 1260, capped: false });
  });
  it("caps the ACS regimen at 4000 units bolus and 1000 units/h", () => {
    expect(value(heparinInitial("acs", 100))).toEqual({ bolus: 4000, rate: 1000, capped: true });
  });
  it("follows the weight-based aPTT nomogram from the current rate", () => {
    expect(value(heparinAdjust(30, 70, 18))).toEqual({ action: "rebolus_increase", rebolus: 5600, newRatePerKg: 22, newRate: 1540 });
    expect(value(heparinAdjust(40, 70, 18))!.rebolus).toBe(2800);
    expect(value(heparinAdjust(60, 70, 18))!.action).toBe("no_change");
    expect(value(heparinAdjust(80, 70, 18))!.newRatePerKg).toBe(16);
    expect(value(heparinAdjust(100, 70, 18))).toEqual({ action: "hold_decrease", rebolus: 0, newRatePerKg: 15, newRate: 1050 });
  });
});

describe("insulinDrip", () => {
  it("offers bolus + 0.1 u/kg/h or 0.14 u/kg/h without bolus, regardless of glucose", () => {
    expect(value(insulinDrip(80, 4.2))).toEqual({ optionA: { bolus: 8, rate: 8 }, optionB: { rate: 11.2 }, holdForPotassium: false });
  });
  it("holds insulin when potassium is below 3.3", () => {
    expect(value(insulinDrip(80, 3.1))!.holdForPotassium).toBe(true);
  });
});

describe("slidingScale", () => {
  it("labels bands without overlaps", () => {
    const bands = slidingScale("medium");
    expect(bands.map((b) => b.label)).toEqual(["150–199", "200–249", "250–299", "300–349", "350–399"]);
  });
});

describe("ibw", () => {
  it("uses Devine and adjusts weight only above IBW", () => {
    const r = value(ibw("male", 175, 100))!;
    expect(r.ibw).toBeCloseTo(70.5, 0);
    expect(r.abw).toBeCloseTo(82.3, 0);
    expect(value(ibw("female", 160, 50))!.abw).toBeNull();
  });
  it("warns below 152.4 cm where the formula is unreliable", () => {
    expect(value(ibw("female", 150, 50))!.shortStature).toBe(true);
  });
});

describe("bsa and burns", () => {
  it("computes Mosteller BSA", () => expect(value(bsa(70, 170, "mosteller"))).toBeCloseTo(1.82, 2));
  it("gives Parkland (4 mL) and ATLS (2 mL) volumes split 8 h / 16 h", () => {
    const r = value(burnFluids(70, 30))!;
    expect(r.parkland).toEqual({ total: 8400, first8hRate: 525, next16hRate: 262.5 });
    expect(r.atls).toEqual({ total: 4200, first8hRate: 262.5, next16hRate: 131.3 });
  });
});

describe("pregnancyDates", () => {
  it("adds 280 days to the LMP (Naegele) without timezone drift", () => {
    const r = value(pregnancyDates({ lmp: "2026-01-01", today: "2026-03-12" }))!;
    expect(r.edd).toBe("2026-10-08");
    expect(r.gaWeeks).toBe(10);
    expect(r.gaDays).toBe(0);
    expect(r.trimester).toBe(1);
  });
  it("adjusts for cycle length and dates by ultrasound", () => {
    expect(value(pregnancyDates({ lmp: "2026-01-01", cycle: 35, today: "2026-03-12" }))!.edd).toBe("2026-10-15");
    expect(value(pregnancyDates({ usDate: "2026-03-12", usWeeks: 12, usDays: 0, today: "2026-03-12" }))!.edd).toBe("2026-09-24");
  });
  it("labels 37 weeks early term, not full term", () => {
    const r = value(pregnancyDates({ lmp: "2026-01-01", today: "2026-09-17" }))!;
    expect(r.gaWeeks).toBe(37);
    expect(r.termStatus).toBe("early_term");
  });
});
