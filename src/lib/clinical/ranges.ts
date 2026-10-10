export interface NumericRange {
  min: number | null;
  max: number | null;
  unit?: string;
}

const NUM = String.raw`\d+(?:\.\d+)?`;

/**
 * Extracts the first numeric range from free text such as "60–100 bpm", "< 60", "> 100 bpm",
 * "0.01-3 mcg/kg/min" or "Idioventricular 20–40 | AIVR 40–100". Returns null when there is none.
 */
export const parseRange = (text: string): NumericRange | null => {
  const unitAfter = (rest: string) => rest.trim().match(/^([a-zA-Z%/µμ]+(?:\/[a-zA-Z]+)*)/)?.[1];

  const closed = text.match(new RegExp(`(${NUM})\\s*[-–—]\\s*(${NUM})\\+?(.*)`));
  if (closed) {
    const [a, b] = [Number(closed[1]), Number(closed[2])];
    const unit = unitAfter(closed[3]);
    return { min: Math.min(a, b), max: Math.max(a, b), ...(unit ? { unit } : {}) };
  }
  const open = text.match(new RegExp(`([<>≤≥])\\s*(${NUM})(.*)`));
  if (open) {
    const value = Number(open[2]);
    const unit = unitAfter(open[3]);
    const below = open[1] === "<" || open[1] === "≤";
    return { min: below ? null : value, max: below ? value : null, ...(unit ? { unit } : {}) };
  }
  return null;
};
