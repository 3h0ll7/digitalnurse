export type AcidBaseStatus = "acidemia" | "alkalemia" | "normal";
export type PrimaryDisorder =
  | "normal"
  | "metabolic_acidosis"
  | "metabolic_alkalosis"
  | "respiratory_acidosis"
  | "respiratory_alkalosis"
  | "mixed_acidosis"
  | "mixed_alkalosis"
  | "compensated_or_mixed";
export type CompensationVerdict =
  | "appropriate"
  | "additional_respiratory_acidosis"
  | "additional_respiratory_alkalosis"
  | "acute"
  | "chronic"
  | "between_acute_and_chronic"
  | "beyond_expected";
export type PfCategory = "severe" | "moderate" | "mild" | "normal";

export interface AbgInput {
  ph: number | null;
  pco2: number | null;
  hco3: number | null;
  pao2?: number | null;
  /** FiO2 as % (21) or fraction (0.21). */
  fio2?: number | null;
  na?: number | null;
  cl?: number | null;
  lactate?: number | null;
  mode?: "abg" | "vbg";
}

export interface AbgResult {
  ph: number;
  pco2: number;
  hco3: number;
  status: AcidBaseStatus;
  primary: PrimaryDisorder;
  compensation: { expected: { low: number; high: number }; verdict: CompensationVerdict } | null;
  anionGap: { value: number; high: boolean } | null;
  pf: { value: number; category: PfCategory } | null;
  lactateHigh: boolean;
}

const has = (n: number | null | undefined): n is number => typeof n === "number" && Number.isFinite(n);
const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Stepwise acid–base interpretation. VBG values are approximated to arterial (pH +0.03, PCO₂ −5;
 * Byrne et al. 2014 — agreement is limited, so treat as a screen).
 */
export const interpretABG = (input: AbgInput): AbgResult | null => {
  if (!has(input.ph) || !has(input.pco2) || !has(input.hco3)) return null;
  const vbg = input.mode === "vbg";
  const ph = vbg ? Math.round((input.ph + 0.03) * 1000) / 1000 : input.ph;
  const pco2 = vbg ? input.pco2 - 5 : input.pco2;
  const hco3 = input.hco3;

  const status: AcidBaseStatus = ph < 7.35 ? "acidemia" : ph > 7.45 ? "alkalemia" : "normal";
  const respAcid = pco2 > 45;
  const respAlk = pco2 < 35;
  const metAcid = hco3 < 22;
  const metAlk = hco3 > 26;

  let primary: PrimaryDisorder;
  if (status === "acidemia") {
    primary = respAcid && metAcid ? "mixed_acidosis" : respAcid ? "respiratory_acidosis" : metAcid ? "metabolic_acidosis" : "compensated_or_mixed";
  } else if (status === "alkalemia") {
    primary = respAlk && metAlk ? "mixed_alkalosis" : respAlk ? "respiratory_alkalosis" : metAlk ? "metabolic_alkalosis" : "compensated_or_mixed";
  } else {
    primary = respAcid || respAlk || metAcid || metAlk ? "compensated_or_mixed" : "normal";
  }

  let compensation: AbgResult["compensation"] = null;
  const deltaCO2 = Math.abs(pco2 - 40) / 10;
  if (primary === "metabolic_acidosis" || primary === "metabolic_alkalosis") {
    // Winter's formula for acidosis; 0.7 × HCO3 + 21 for alkalosis (± 2 mmHg).
    const centre = primary === "metabolic_acidosis" ? 1.5 * hco3 + 8 : 0.7 * hco3 + 21;
    const expected = { low: r1(centre - 2), high: r1(centre + 2) };
    const verdict: CompensationVerdict =
      pco2 > expected.high ? "additional_respiratory_acidosis" : pco2 < expected.low ? "additional_respiratory_alkalosis" : "appropriate";
    compensation = { expected, verdict };
  } else if (primary === "respiratory_acidosis" || primary === "respiratory_alkalosis") {
    // Expected HCO3: acidosis +1 (acute) / +3.5 (chronic) per 10 mmHg; alkalosis −2 / −5.
    const [acute, chronic] = primary === "respiratory_acidosis" ? [24 + deltaCO2, 24 + 3.5 * deltaCO2] : [24 - 2 * deltaCO2, 24 - 5 * deltaCO2];
    const expected = { low: r1(Math.min(acute, chronic)), high: r1(Math.max(acute, chronic)) };
    const near = (a: number) => Math.abs(hco3 - a) <= 2;
    const verdict: CompensationVerdict = near(acute)
      ? "acute"
      : near(chronic)
        ? "chronic"
        : hco3 > expected.low && hco3 < expected.high
          ? "between_acute_and_chronic"
          : "beyond_expected";
    compensation = { expected, verdict };
  }

  const anionGap = has(input.na) && has(input.cl) ? (() => {
    const value = r1(input.na - (input.cl + hco3));
    return { value, high: value > 12 };
  })() : null;

  let pf: AbgResult["pf"] = null;
  if (has(input.pao2) && has(input.fio2) && input.fio2 > 0) {
    const fraction = input.fio2 > 1 ? input.fio2 / 100 : input.fio2;
    const value = Math.round(input.pao2 / fraction);
    const category: PfCategory = value <= 100 ? "severe" : value <= 200 ? "moderate" : value <= 300 ? "mild" : "normal";
    pf = { value, category };
  }

  return { ph, pco2, hco3, status, primary, compensation, anionGap, pf, lactateHigh: has(input.lactate) && input.lactate >= 2 };
};
