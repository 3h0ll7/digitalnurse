const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EASTERN_ARABIC = "۰۱۲۳۴۵۶۷۸۹";

/** Parses user-typed numbers. Empty input is null (never 0); accepts Arabic digits and "٫" or "," as decimal mark. */
export const parseNumber = (input: string | number | null | undefined): number | null => {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (input == null) return null;
  const normalized = input
    .trim()
    .replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(EASTERN_ARABIC.indexOf(d)))
    .replace(/[٫,]/g, ".");
  if (!normalized || !/^[-+]?(\d+\.?\d*|\.\d+)$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
};
