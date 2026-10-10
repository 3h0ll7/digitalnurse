type N = number | null;
const ok = (...values: N[]) => values.every((v) => v !== null && Number.isFinite(v));
const round = (n: number, digits = 1) => Math.round(n * 10 ** digits) / 10 ** digits;

/** Maintenance rate by the 4-2-1 rule (Holliday & Segar 1957), mL/h. */
export const hollidaySegar = (kg: N): number | null => {
  if (!ok(kg) || kg! <= 0 || kg! > 350) return null;
  const w = kg!;
  if (w <= 10) return round(w * 4);
  if (w <= 20) return round(40 + (w - 10) * 2);
  return round(60 + (w - 20));
};

/** Fluid deficit = weight × % dehydration, replaced 50% over 8 h and 50% over 16 h. */
export const fluidDeficit = (kg: N, percent: N) => {
  if (!ok(kg, percent) || kg! <= 0 || percent! <= 0 || percent! > 30) return null;
  const total = round(kg! * (percent! / 100) * 1000, 0);
  return { total, first8h: round(total / 2, 0), next16h: round(total / 2, 0) };
};

/** Free water deficit (L) = TBW × (Na / target − 1); TBW = 0.6 × kg (male) or 0.5 × kg (female). */
export const freeWaterDeficit = (kg: N, sex: "male" | "female", na: N, target: N): number | null => {
  if (!ok(kg, na, target) || kg! <= 0 || target! <= 0) return null;
  const tbw = kg! * (sex === "male" ? 0.6 : 0.5);
  return Math.max(0, round(tbw * (na! / target! - 1), 2));
};

/** Sodium correction speed; limit 10 mmol/L per 24 h, or 8 when osmotic demyelination risk is high. */
export const sodiumChange = (initial: N, now: N, hours: N, highRisk = false) => {
  if (!ok(initial, now, hours) || hours! <= 0) return null;
  const perHour = round((now! - initial!) / hours!, 2);
  const per24h = round(perHour * 24, 1);
  return { perHour, per24h, overLimit: Math.abs(per24h) > (highRisk ? 8 : 10) };
};

export const dripRate = (volumeMl: N, hours: N, dropFactor: N) => {
  if (!ok(volumeMl, hours, dropFactor) || volumeMl! <= 0 || hours! <= 0 || dropFactor! <= 0) return null;
  const mlPerHour = round(volumeMl! / hours!);
  return { mlPerHour, dropsPerMin: round((mlPerHour * dropFactor!) / 60) };
};

export type PotassiumBand = "severe_low" | "low" | "normal" | "mild_high" | "moderate_high" | "severe_high";

/** Hyperkalaemia severity per UK Kidney Association (mild 5.5–5.9, moderate 6.0–6.4, severe ≥ 6.5). */
export const potassiumBand = (k: N): PotassiumBand | null => {
  if (!ok(k)) return null;
  if (k! < 2.5) return "severe_low";
  if (k! < 3.5) return "low";
  if (k! < 5.5) return "normal";
  if (k! < 6.0) return "mild_high";
  if (k! < 6.5) return "moderate_high";
  return "severe_high";
};
