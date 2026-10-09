import type { Band } from "@/components/data/BandBar";

export type LabCondition = "critical_low" | "low" | "normal" | "high" | "critical_high";

export interface LabInterpretation {
  id: string;
  name_en: string;
  name_ar: string;
  category: string;
  /** Adult reference range only; other populations vary by laboratory. */
  ranges: { adult: { low: number; high: number; unit: string; unit_si: string } };
  critical: { low: number; high: number };
  interpretations: Array<{
    condition: LabCondition;
    threshold: string;
    status_en: string;
    status_ar: string;
    meaning_en: string;
    meaning_ar: string;
    causes_en: string[];
    causes_ar: string[];
    drug_interference_en: string[];
    drug_interference_ar: string[];
    nursing_actions_en: string[];
    nursing_actions_ar: string[];
    related_labs: string[];
  }>;
}

/** Value in conventional units → condition band. Empty input gives null. */
export const classifyLab = (value: number | null, lab: LabInterpretation): LabCondition | null => {
  if (value === null || !Number.isFinite(value)) return null;
  const { low, high } = lab.ranges.adult;
  if (value < lab.critical.low) return "critical_low";
  if (value < low) return "low";
  if (value <= high) return "normal";
  if (value <= lab.critical.high) return "high";
  return "critical_high";
};

/** Gauge scale and coloured bands for a lab, in conventional units (multiply by `factor` for SI). */
export const labBands = (lab: LabInterpretation, factor = 1) => {
  const { low, high } = lab.ranges.adult;
  const { low: cLow, high: cHigh } = lab.critical;
  const span = cHigh - cLow || high - low || 1;
  const min = Math.max(0, cLow - span * 0.1);
  const max = cHigh + span * 0.1;
  const raw: Band[] = [
    { from: min, to: cLow, tone: "critical", label: "critical_low" },
    { from: cLow, to: low, tone: "warn", label: "low" },
    { from: low, to: high, tone: "normal", label: "normal" },
    { from: high, to: cHigh, tone: "warn", label: "high" },
    { from: cHigh, to: max, tone: "critical", label: "critical_high" },
  ];
  const scale = (n: number) => n * factor;
  return {
    min: scale(min),
    max: scale(max),
    bands: raw.filter((b) => b.to > b.from).map((b) => ({ ...b, from: scale(b.from), to: scale(b.to) })),
  };
};

/**
 * Conventional → SI multipliers (standard conversion factors). 1 means the unit is the same
 * quantity under another name (e.g. mEq/L → mmol/L for monovalent ions, pg/mL → ng/L).
 */
export const SI_FACTORS: Record<string, number> = {
  sodium: 1, potassium: 1, chloride: 1, bicarbonate: 1, anion_gap: 1,
  calcium_total: 0.2495, calcium_ionized: 1, magnesium: 0.4114, phosphate: 0.3229,
  bun: 0.357, creatinine: 88.4, egfr: 1, uric_acid: 59.48,
  alt: 1, ast: 1, alp: 1, bilirubin_total: 17.1, bilirubin_direct: 17.1, albumin: 10, total_protein: 10,
  troponin_i: 1, troponin_t: 1, ckmb: 1, bnp: 1, ntprobnp: 1,
  hemoglobin: 10, hematocrit: 1, rbc: 1, wbc: 1, platelets: 1, mcv: 1, mch: 1, rdw: 1,
  neutrophils: 1, lymphocytes: 1, monocytes: 1, eosinophils: 1, basophils: 1,
  pt: 1, aptt: 1, inr: 1, ddimer: 1, fibrinogen: 0.01,
  glucose: 0.0555, hba1c: 1, lactate: 1, ammonia: 0.587, ketones: 1,
  tsh: 1, ft3: 1.536, ft4: 12.87, tt4: 12.87,
  crp: 1, procalcitonin: 1, esr: 1,
};

export const toSI = (id: string, value: number) => value * (SI_FACTORS[id] ?? 1);
export const fromSI = (id: string, value: number) => value / (SI_FACTORS[id] ?? 1);

/** Rounds a converted value to a sensible number of significant digits for display. */
export const roundForDisplay = (n: number) => {
  if (n === 0) return 0;
  const digits = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : Math.abs(n) >= 1 ? 2 : 3;
  return Number(n.toFixed(digits));
};
