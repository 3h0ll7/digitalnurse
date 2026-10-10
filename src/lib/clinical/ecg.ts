export type Severity = "BENIGN" | "MONITOR" | "URGENT" | "LIFE_THREATENING";

export const SEVERITY_ORDER: Severity[] = ["BENIGN", "MONITOR", "URGENT", "LIFE_THREATENING"];

export interface RhythmLike {
  category: string;
  severity: Severity;
  nameEn: string;
  nameAr: string;
  characteristics: string;
  interventions: string[];
}

/** Typical adult ventricular rates (bpm) from the rhythm list; null = open-ended. */
export const RHYTHM_RATES: { id: number; label: string; min: number | null; max: number | null }[] = [
  { id: 22, label: "Complete heart block", min: 20, max: 60 },
  { id: 18, label: "Idioventricular", min: 20, max: 40 },
  { id: 11, label: "Junctional", min: 40, max: 60 },
  { id: 2, label: "Sinus bradycardia", min: null, max: 60 },
  { id: 1, label: "Normal sinus rhythm", min: 60, max: 100 },
  { id: 12, label: "Accelerated junctional", min: 60, max: 100 },
  { id: 5, label: "AFib", min: 60, max: null },
  { id: 3, label: "Sinus tachycardia", min: 100, max: null },
  { id: 15, label: "VT (monomorphic)", min: 100, max: 250 },
  { id: 7, label: "SVT", min: 150, max: 250 },
  { id: 16, label: "Torsades de pointes", min: 150, max: 300 },
];

/** "LIFE" is a severity view, not a stored category. */
export const matchesCategory = (r: RhythmLike, category: string) =>
  category === "ALL" || r.category === category || (category === "LIFE" && r.severity === "LIFE_THREATENING");

export const filterRhythms = <R extends RhythmLike>(rhythms: R[], { category, severity, query }: { category: string; severity: Severity | null; query: string }) => {
  const needle = query.trim().toLowerCase();
  return rhythms.filter(
    (r) =>
      matchesCategory(r, category) &&
      (!severity || r.severity === severity) &&
      (!needle || [r.nameEn, r.nameAr, r.characteristics, ...r.interventions].some((text) => text.toLowerCase().includes(needle))),
  );
};

export const severityCounts = (rhythms: RhythmLike[]) => SEVERITY_ORDER.map((s) => ({ severity: s, count: rhythms.filter((r) => r.severity === s).length }));
