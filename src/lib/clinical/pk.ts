/** One-compartment, first-order elimination teaching model (IV bolus doses). */

export const LN2 = Math.log(2);

/** Fraction of a dose still in the body after n half-lives. */
export const fractionRemaining = (halfLives: number) => 0.5 ** halfLives;

/** Peak at steady state relative to a single dose: 1 / (1 − e^(−kτ)). */
export const accumulationFactor = (halfLife: number, tau: number) => 1 / (1 - Math.exp((-LN2 / halfLife) * tau));

/** Time to reach a fraction of steady state (default 97 % ≈ 5 half-lives). */
export const timeToSteadyState = (halfLife: number, fraction = 0.97) => (Math.log(1 - fraction) / -LN2) * halfLife;

export interface CurvePoint {
  t: number;
  c: number;
}

/**
 * Concentration over time by superposition: each dose adds C0·e^(−k(t − nτ)) from its own time on.
 * Concentrations are relative to the peak of a single dose (C0 = 1).
 */
export const concentrationCurve = ({ halfLife, tau, doses, until, step }: { halfLife: number; tau: number; doses: number; until: number; step: number }): CurvePoint[] => {
  const k = LN2 / halfLife;
  const points: CurvePoint[] = [];
  const at = (t: number) => {
    let c = 0;
    for (let n = 0; n < doses; n++) {
      const since = t - n * tau;
      if (since >= 0) c += Math.exp(-k * since);
    }
    return c;
  };
  for (let t = 0; t <= until + 1e-9; t += step) {
    // Just before and just after each dose, so the jump is drawn as a vertical edge.
    const n = Math.round(t / tau);
    if (Math.abs(t - n * tau) < 1e-9 && n > 0 && n < doses) points.push({ t, c: at(t - 1e-9) });
    points.push({ t, c: at(t) });
  }
  return points;
};

/** Readable duration from minutes. */
export const formatMinutes = (min: number, lang: "en" | "ar" = "en") => {
  const u = lang === "ar" ? { m: "د", h: "س", d: "يوم" } : { m: "min", h: "h", d: "d" };
  if (min < 60) return `${+min.toFixed(1)} ${u.m}`;
  if (min < 60 * 48) return `${+(min / 60).toFixed(1)} ${u.h}`;
  return `${Math.round(min / 1440)} ${u.d}`;
};

/** Compare two optional numbers; null when either is missing or they are equal. */
export const pick = <T,>(a: { item: T; value: number | null }, b: { item: T; value: number | null }, want: "lower" | "higher"): T | null => {
  if (a.value === null || b.value === null || a.value === b.value) return null;
  return (want === "lower" ? a.value < b.value : a.value > b.value) ? a.item : b.item;
};
