import type { SourceId } from "@/data/sources";
import type { Result } from "./calculators";

type N = number | null;

export type Tone = "good" | "warn" | "serious" | "critical";

export type AssessmentCategory =
  | "neuro"
  | "sedation"
  | "skin"
  | "safety"
  | "pain"
  | "neonatal"
  | "sepsis"
  | "warning"
  | "cardiac"
  | "pulmonary"
  | "nutrition"
  | "mental";

export interface ScoreOption {
  label: string;
  points: number;
  /** Shown as an alert whenever this option is chosen. */
  flag?: string;
}

export interface ScaleItem {
  factor: string;
  options: ScoreOption[];
  /** Checklist: any number of options, points add up. Otherwise exactly one option is required. */
  multi?: boolean;
  hint?: string;
  /** Points count in the total but not in the score the bands read (e.g. the sex point of CHA₂DS₂-VASc). */
  excludeFromBand?: boolean;
}

export interface ScoreBand {
  min: number;
  max: number;
  label: string;
  tone: Tone;
  action?: string;
}

export interface ScaleDef {
  id: string;
  name: string;
  short: string;
  description: string;
  category: AssessmentCategory;
  range: [number, number];
  /** "items" are scored by the shared engine; the others have their own inputs. */
  kind: "items" | "news2" | "must" | "cam-icu";
  items: ScaleItem[];
  bands: ScoreBand[];
  /** Explains a band score that differs from the total. */
  bandBasis?: string;
  notes?: string[];
  sources: SourceId[];
}

/** Chosen option indexes per item index. */
export type Selections = Record<number, number[]>;

export interface ItemScore {
  total: number;
  bandScore: number;
  answered: number;
  required: number;
  complete: boolean;
  flags: string[];
}

export const scoreItems = (items: ScaleItem[], selections: Selections): ItemScore => {
  let total = 0;
  let bandScore = 0;
  let answered = 0;
  const flags: string[] = [];
  items.forEach((item, i) => {
    const chosen = selections[i] ?? [];
    if (!item.multi && chosen.length) answered += 1;
    for (const o of chosen) {
      const option = item.options[o];
      if (!option) continue;
      total += option.points;
      if (!item.excludeFromBand) bandScore += option.points;
      if (option.flag) flags.push(option.flag);
    }
  });
  const required = items.filter((item) => !item.multi).length;
  return { total, bandScore, answered, required, complete: answered === required, flags };
};

/** Toggle for checklists, replace for single-choice items. */
export const choose = (items: ScaleItem[], selections: Selections, item: number, option: number): Selections => {
  const current = selections[item] ?? [];
  const next = items[item]?.multi ? (current.includes(option) ? current.filter((o) => o !== option) : [...current, option]) : [option];
  return { ...selections, [item]: next };
};

export const bandFor = (bands: ScoreBand[], value: number): ScoreBand | null => bands.find((b) => value >= b.min && value <= b.max) ?? null;

// ---------- NEWS2 (RCP 2017) ----------

export interface News2Input {
  rr: N;
  spo2: N;
  sbp: N;
  hr: N;
  temp: N;
  /** SpO₂ Scale 2 — only for confirmed hypercapnic respiratory failure, on a clinician's decision. */
  scale2: boolean;
  onOxygen: boolean;
  /** New confusion, or responds only to Voice or Pain, or Unresponsive. */
  cvpu: boolean;
}

export interface News2Result {
  parts: { rr: number; spo2: number; air: number; sbp: number; hr: number; consciousness: number; temp: number };
  total: number;
  singleThree: boolean;
  risk: "low" | "low-medium" | "medium" | "high";
}

const missing = (...values: N[]) => values.some((v) => v === null || !Number.isFinite(v));

export const news2SpO2 = (spo2: number, scale2: boolean, onOxygen: boolean): number => {
  if (!scale2) return spo2 <= 91 ? 3 : spo2 <= 93 ? 2 : spo2 <= 95 ? 1 : 0;
  if (spo2 <= 83) return 3;
  if (spo2 <= 85) return 2;
  if (spo2 <= 87) return 1;
  if (spo2 <= 92 || !onOxygen) return 0;
  return spo2 <= 94 ? 1 : spo2 <= 96 ? 2 : 3;
};

export const news2 = (input: News2Input): Result<News2Result> => {
  const { rr, spo2, sbp, hr, temp } = input;
  if (missing(rr, spo2, sbp, hr, temp)) return { ok: false, reason: "empty" };
  if (rr < 0 || rr > 80) return { ok: false, reason: "range", field: "RR" };
  if (spo2 < 50 || spo2 > 100) return { ok: false, reason: "range", field: "SpO₂" };
  if (sbp < 30 || sbp > 300) return { ok: false, reason: "range", field: "SBP" };
  if (hr < 10 || hr > 300) return { ok: false, reason: "range", field: "HR" };
  if (temp < 25 || temp > 45) return { ok: false, reason: "range", field: "Temp" };
  const parts = {
    rr: rr <= 8 ? 3 : rr <= 11 ? 1 : rr <= 20 ? 0 : rr <= 24 ? 2 : 3,
    spo2: news2SpO2(spo2, input.scale2, input.onOxygen),
    air: input.onOxygen ? 2 : 0,
    sbp: sbp <= 90 ? 3 : sbp <= 100 ? 2 : sbp <= 110 ? 1 : sbp <= 219 ? 0 : 3,
    hr: hr <= 40 ? 3 : hr <= 50 ? 1 : hr <= 90 ? 0 : hr <= 110 ? 1 : hr <= 130 ? 2 : 3,
    consciousness: input.cvpu ? 3 : 0,
    temp: temp <= 35 ? 3 : temp <= 36 ? 1 : temp <= 38 ? 0 : temp <= 39 ? 1 : 2,
  };
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  const singleThree = Object.values(parts).some((p) => p === 3);
  const risk = total >= 7 ? "high" : total >= 5 ? "medium" : singleThree ? "low-medium" : "low";
  return { ok: true, value: { parts, total, singleThree, risk } };
};

// ---------- MUST (BAPEN) ----------

export interface MustResult {
  bmi: number;
  lossPct: number | null;
  bmiScore: number;
  lossScore: number;
  acuteScore: number;
  total: number;
  risk: "low" | "medium" | "high";
}

export const must = ({ weight, height, previousWeight, acute }: { weight: N; height: N; previousWeight: N; acute: boolean }): Result<MustResult> => {
  if (missing(weight, height)) return { ok: false, reason: "empty" };
  if (weight < 20 || weight > 350) return { ok: false, reason: "range", field: "weight" };
  if (height < 100 || height > 250) return { ok: false, reason: "range", field: "height" };
  if (previousWeight !== null && (previousWeight < 20 || previousWeight > 350)) return { ok: false, reason: "range", field: "previous weight" };
  const bmi = weight / (height / 100) ** 2;
  const bmiScore = bmi > 20 ? 0 : bmi >= 18.5 ? 1 : 2;
  // Unplanned loss over the past 3–6 months; a gain scores 0.
  const lossPct = previousWeight === null ? null : ((previousWeight - weight) / previousWeight) * 100;
  const lossScore = lossPct === null || lossPct < 5 ? 0 : lossPct <= 10 ? 1 : 2;
  const acuteScore = acute ? 2 : 0;
  const total = bmiScore + lossScore + acuteScore;
  return { ok: true, value: { bmi: Math.round(bmi * 10) / 10, lossPct: lossPct === null ? null : Math.round(lossPct * 10) / 10, bmiScore, lossScore, acuteScore, total, risk: total >= 2 ? "high" : total === 1 ? "medium" : "low" } };
};

// ---------- CAM-ICU (Ely 2001) ----------

export interface CamIcuInput {
  rass: N;
  /** Feature 1: acute change or fluctuating course of mental status. */
  acuteChange: boolean | null;
  /** Feature 2: errors on the 10-letter attention test (SAVEAHAART). */
  attentionErrors: N;
  /** Feature 4: errors on the 4 questions + command. */
  thinkingErrors: N;
}

export type CamIcuState =
  | { status: "incomplete"; next: "rass" | "feature1" | "feature2" | "feature4" }
  | { status: "unable" }
  | { status: "negative"; stoppedAt: 1 | 2 | 4 }
  | { status: "positive"; via: "feature3" | "feature4" };

export const camIcu = ({ rass, acuteChange, attentionErrors, thinkingErrors }: CamIcuInput): CamIcuState => {
  if (rass === null || !Number.isFinite(rass)) return { status: "incomplete", next: "rass" };
  if (rass <= -4) return { status: "unable" };
  if (acuteChange === null) return { status: "incomplete", next: "feature1" };
  if (!acuteChange) return { status: "negative", stoppedAt: 1 };
  if (attentionErrors === null) return { status: "incomplete", next: "feature2" };
  if (attentionErrors <= 2) return { status: "negative", stoppedAt: 2 };
  // Feature 3: altered level of consciousness = any RASS other than 0.
  if (rass !== 0) return { status: "positive", via: "feature3" };
  if (thinkingErrors === null) return { status: "incomplete", next: "feature4" };
  return thinkingErrors > 1 ? { status: "positive", via: "feature4" } : { status: "negative", stoppedAt: 4 };
};
