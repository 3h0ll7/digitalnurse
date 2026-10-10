/** Position of a value on a linear scale as a percentage, clamped to 0–100. */
export const positionPct = (value: number, min: number, max: number): number => {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

/** Percent share of each count (all zeros when the total is zero). */
export const shares = (counts: number[]): number[] => {
  const total = counts.reduce((a, b) => a + b, 0);
  return counts.map((c) => (total === 0 ? 0 : (c / total) * 100));
};
