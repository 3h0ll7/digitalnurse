import catalog from "@/data/drugs-catalog.json";
import { parseRange } from "./ranges";

type N = number | null;
export type Result<T> = { ok: true; value: T } | { ok: false; reason: "empty" } | { ok: false; reason: "range"; field: string };

const round = (n: number, digits = 1) => Math.round(n * 10 ** digits) / 10 ** digits;
const empty = { ok: false, reason: "empty" } as const;
const range = (field: string) => ({ ok: false, reason: "range", field }) as const;
const ok = <T,>(value: T): Result<T> => ({ ok: true, value });
const missing = (...values: N[]) => values.some((v) => v === null || !Number.isFinite(v));

/** Plausible input limits; outside them the result is withheld instead of showing nonsense. */
const LIMITS = { weight: [0.5, 350], height: [40, 250], age: [18, 120], creatinine: [0.1, 20], tbsa: [1, 100] } as const;
const outOf = (key: keyof typeof LIMITS, v: number) => v < LIMITS[key][0] || v > LIMITS[key][1];

export const dosageVolume = (ordered: N, available: N, volume: N): Result<number> => {
  if (missing(ordered, available, volume)) return empty;
  if (available! <= 0) return range("available");
  return ok(round((ordered! / available!) * volume!, 2));
};

export type BmiClass = "under" | "normal" | "over" | "obese1" | "obese2" | "obese3";

/** WHO adult BMI classes. */
export const bmi = (kg: N, cm: N): Result<{ bmi: number; cls: BmiClass }> => {
  if (missing(kg, cm)) return empty;
  if (outOf("weight", kg!)) return range("weight");
  if (outOf("height", cm!)) return range("height");
  const value = round(kg! / (cm! / 100) ** 2);
  const cls: BmiClass = value < 18.5 ? "under" : value < 25 ? "normal" : value < 30 ? "over" : value < 35 ? "obese1" : value < 40 ? "obese2" : "obese3";
  return ok({ bmi: value, cls });
};

/** Cockcroft–Gault creatinine clearance (mL/min), creatinine in mg/dL. */
export const cockcroftGault = (age: N, kg: N, scr: N, sex: "male" | "female"): Result<number> => {
  if (missing(age, kg, scr)) return empty;
  if (outOf("age", age!)) return range("age");
  if (outOf("weight", kg!)) return range("weight");
  if (outOf("creatinine", scr!)) return range("creatinine");
  return ok(round((((140 - age!) * kg!) / (72 * scr!)) * (sex === "female" ? 0.85 : 1)));
};

/* ---------------- Vasoactive infusions ---------------- */

export type VasoDrug = "norepinephrine" | "epinephrine" | "dopamine" | "dobutamine" | "phenylephrine" | "vasopressin";

const catalogRange = (id: string) => {
  const drug = catalog.drugs.find((d) => d.id === id);
  const r = drug?.dosing.titrationRange ? parseRange(drug.dosing.titrationRange) : null;
  return { min: r?.min ?? 0, max: r?.max ?? 0 };
};

/**
 * Reference ranges come from the drug catalogue so both pages agree. Concentrations are common
 * premixes: amount (mg, or units for vasopressin) in volume (mL).
 */
export const VASOACTIVE: Record<VasoDrug, { unit: string; weightBased: boolean; range: { min: number; max: number }; mixes: [number, number][] }> = {
  norepinephrine: { unit: "mcg/kg/min", weightBased: true, range: catalogRange("norepinephrine"), mixes: [[4, 250], [8, 250]] },
  epinephrine: { unit: "mcg/kg/min", weightBased: true, range: catalogRange("epinephrine-press"), mixes: [[1, 250], [4, 250]] },
  dopamine: { unit: "mcg/kg/min", weightBased: true, range: catalogRange("dopamine"), mixes: [[400, 250], [800, 250]] },
  dobutamine: { unit: "mcg/kg/min", weightBased: true, range: catalogRange("dobutamine"), mixes: [[250, 250], [500, 250]] },
  phenylephrine: { unit: "mcg/kg/min", weightBased: true, range: catalogRange("phenylephrine"), mixes: [[20, 250], [40, 250]] },
  vasopressin: { unit: "units/min", weightBased: false, range: catalogRange("vasopressin"), mixes: [[20, 100], [40, 100]] },
};

export type DoseZone = "below_range" | "in_range" | "above_range";

interface VasoInput {
  drug: VasoDrug;
  amount: N;
  volume: N;
  weight: N;
  /** Pump rate (mL/h) → dose, or */
  rate?: N;
  /** target dose → pump rate. */
  dose?: N;
}

export const vasoactive = ({ drug, amount, volume, weight, rate = null, dose = null }: VasoInput): Result<{ dose: number; rate: number; concentration: number; zone: DoseZone }> => {
  const info = VASOACTIVE[drug];
  if (missing(amount, volume) || (info.weightBased && missing(weight)) || (rate === null && dose === null)) return empty;
  if (amount! <= 0 || volume! <= 0) return range("concentration");
  if (info.weightBased && outOf("weight", weight!)) return range("weight");
  // mcg/mL for mg-based drugs, units/mL for vasopressin.
  const concentration = info.weightBased ? (amount! * 1000) / volume! : amount! / volume!;
  const perMinFactor = info.weightBased ? weight! * 60 : 60;
  const computedDose = rate !== null ? (rate * concentration) / perMinFactor : dose!;
  const computedRate = rate !== null ? rate : (dose! * perMinFactor) / concentration;
  const zone: DoseZone = computedDose < info.range.min ? "below_range" : computedDose > info.range.max ? "above_range" : "in_range";
  return ok({ dose: round(computedDose, 4), rate: round(computedRate, 2), concentration: round(concentration, 2), zone });
};

/* ---------------- Heparin (weight-based, Raschke 1993; ACS caps per ACC/AHA) ---------------- */

export type HeparinProtocol = "vte" | "acs";
const HEPARIN = {
  vte: { bolusPerKg: 80, ratePerKg: 18, maxBolus: 10000, maxRate: 2500 },
  acs: { bolusPerKg: 60, ratePerKg: 12, maxBolus: 4000, maxRate: 1000 },
} as const;

export const heparinInitial = (protocol: HeparinProtocol, kg: N): Result<{ bolus: number; rate: number; capped: boolean }> => {
  if (missing(kg)) return empty;
  if (outOf("weight", kg!)) return range("weight");
  const p = HEPARIN[protocol];
  const bolus = Math.min(kg! * p.bolusPerKg, p.maxBolus);
  const rate = Math.min(kg! * p.ratePerKg, p.maxRate);
  return ok({ bolus: round(bolus, 0), rate: round(rate, 0), capped: bolus < kg! * p.bolusPerKg || rate < kg! * p.ratePerKg });
};

export type HeparinAction = "rebolus_increase" | "no_change" | "decrease" | "hold_decrease";

/** Raschke nomogram steps by aPTT (seconds for that study's reagent — use your local nomogram). */
export const heparinAdjust = (aptt: N, kg: N, currentPerKg: N): Result<{ action: HeparinAction; rebolus: number; newRatePerKg: number; newRate: number }> => {
  if (missing(aptt, kg, currentPerKg)) return empty;
  if (outOf("weight", kg!)) return range("weight");
  const [action, rebolusPerKg, delta]: [HeparinAction, number, number] =
    aptt! < 35 ? ["rebolus_increase", 80, 4] : aptt! <= 45 ? ["rebolus_increase", 40, 2] : aptt! <= 70 ? ["no_change", 0, 0] : aptt! <= 90 ? ["decrease", 0, -2] : ["hold_decrease", 0, -3];
  const newRatePerKg = Math.max(0, currentPerKg! + delta);
  return ok({ action, rebolus: round(rebolusPerKg * kg!, 0), newRatePerKg, newRate: round(newRatePerKg * kg!, 0) });
};

/* ---------------- Insulin (DKA) ---------------- */

/** Two regimens from the ADA consensus: bolus 0.1 u/kg + 0.1 u/kg/h, or 0.14 u/kg/h without bolus. */
export const insulinDrip = (kg: N, potassium: N): Result<{ optionA: { bolus: number; rate: number }; optionB: { rate: number }; holdForPotassium: boolean }> => {
  if (missing(kg)) return empty;
  if (outOf("weight", kg!)) return range("weight");
  return ok({
    optionA: { bolus: round(kg! * 0.1), rate: round(kg! * 0.1) },
    optionB: { rate: round(kg! * 0.14) },
    holdForPotassium: potassium !== null && Number.isFinite(potassium) && potassium < 3.3,
  });
};

export type Sensitivity = "low" | "medium" | "high";
const SCALES: Record<Sensitivity, number[]> = { low: [1, 2, 3, 4, 5], medium: [2, 4, 6, 8, 10], high: [3, 6, 9, 12, 15] };

/** Example correction scale: units by glucose band (mg/dL); ≥ 400 → notify. */
export const slidingScale = (s: Sensitivity) =>
  SCALES[s].map((units, i) => {
    const from = 150 + i * 50;
    return { from, to: from + 49, label: `${from}–${from + 49}`, units };
  });

/* ---------------- Body size ---------------- */

/** Devine ideal body weight; adjusted weight = IBW + 0.4 × (actual − IBW) when actual > IBW. */
export const ibw = (sex: "male" | "female", cm: N, actual: N): Result<{ ibw: number; abw: number | null; shortStature: boolean; percentOver: number | null }> => {
  if (missing(cm)) return empty;
  if (outOf("height", cm!)) return range("height");
  if (actual !== null && Number.isFinite(actual) && outOf("weight", actual)) return range("weight");
  const ideal = (sex === "male" ? 50 : 45.5) + 2.3 * (cm! / 2.54 - 60);
  const hasActual = actual !== null && Number.isFinite(actual);
  return ok({
    ibw: round(ideal),
    abw: hasActual && actual! > ideal ? round(ideal + 0.4 * (actual! - ideal)) : null,
    shortStature: cm! < 152.4,
    percentOver: hasActual ? round(((actual! - ideal) / ideal) * 100) : null,
  });
};

export const bsa = (kg: N, cm: N, formula: "mosteller" | "dubois"): Result<number> => {
  if (missing(kg, cm)) return empty;
  if (outOf("weight", kg!)) return range("weight");
  if (outOf("height", cm!)) return range("height");
  return ok(round(formula === "dubois" ? 0.007184 * cm! ** 0.725 * kg! ** 0.425 : Math.sqrt((cm! * kg!) / 3600), 2));
};

/** Burn resuscitation volumes in 24 h from the time of injury: Parkland 4 mL and ATLS (adult) 2 mL × kg × %TBSA. */
export const burnFluids = (kg: N, tbsa: N) => {
  if (missing(kg, tbsa)) return empty;
  if (outOf("weight", kg!)) return range("weight");
  if (outOf("tbsa", tbsa!)) return range("tbsa");
  const plan = (mlPerKg: number) => {
    const total = mlPerKg * kg! * tbsa!;
    return { total: round(total, 0), first8hRate: round(total / 2 / 8), next16hRate: round(total / 2 / 16) };
  };
  return ok({ parkland: plan(4), atls: plan(2) });
};

/* ---------------- Pregnancy dates ---------------- */

const DAY = 86_400_000;
const parseDay = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) : NaN);
const toIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export type TermStatus = "preterm" | "early_term" | "full_term" | "late_term" | "post_term";

interface PregnancyInput {
  lmp?: string;
  cycle?: N;
  usDate?: string;
  usWeeks?: N;
  usDays?: N;
  /** Today's date as YYYY-MM-DD in the user's local calendar. */
  today: string;
}

export const pregnancyDates = ({ lmp, cycle = 28, usDate, usWeeks = null, usDays = 0, today }: PregnancyInput) => {
  const now = parseDay(today);
  let edd: number;
  if (lmp) {
    const start = parseDay(lmp);
    if (Number.isNaN(start)) return empty;
    const c = cycle ?? 28;
    if (c < 20 || c > 45) return range("cycle");
    edd = start + (280 + (c - 28)) * DAY;
  } else if (usDate) {
    const scan = parseDay(usDate);
    if (Number.isNaN(scan) || usWeeks === null) return empty;
    const gaAtScan = usWeeks * 7 + (usDays ?? 0);
    if (gaAtScan < 42 || gaAtScan > 280) return range("gestational age");
    edd = scan + (280 - gaAtScan) * DAY;
  } else {
    return empty;
  }
  const ga = 280 - Math.round((edd - now) / DAY);
  if (ga < 0 || ga > 44 * 7) return range("date");
  const gaWeeks = Math.floor(ga / 7);
  const termStatus: TermStatus = gaWeeks < 37 ? "preterm" : gaWeeks < 39 ? "early_term" : gaWeeks < 41 ? "full_term" : gaWeeks < 42 ? "late_term" : "post_term";
  return ok({
    edd: toIso(edd),
    gaWeeks,
    gaDays: ga % 7,
    gaTotalDays: ga,
    daysLeft: Math.max(0, 280 - ga),
    trimester: gaWeeks < 14 ? 1 : gaWeeks < 28 ? 2 : 3,
    termStatus,
  });
};

/** Local calendar date as YYYY-MM-DD. */
export const localToday = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
