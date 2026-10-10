export interface CatalogDrug {
  id: string;
  genericName: string;
  brandName: string;
  category: string;
  routes: string[];
  highAlert: boolean;
  emergency: boolean;
  hasTitrationGuide: boolean;
  weightBased: boolean;
}

export type DrugFlag = "highAlert" | "emergency" | "weightBased" | "titration";

export interface DrugFilter {
  query?: string;
  category?: string;
  flags?: DrugFlag[];
  route?: string;
}

const hasFlag = (d: CatalogDrug, flag: DrugFlag) => (flag === "titration" ? d.hasTitrationGuide : d[flag]);

export const drugStats = (drugs: CatalogDrug[]) => ({
  total: drugs.length,
  highAlert: drugs.filter((d) => d.highAlert).length,
  emergency: drugs.filter((d) => d.emergency).length,
  weightBased: drugs.filter((d) => d.weightBased).length,
  titration: drugs.filter((d) => d.hasTitrationGuide).length,
});

export const routeCounts = (drugs: CatalogDrug[]) => {
  const counts = new Map<string, number>();
  drugs.forEach((d) => d.routes.forEach((r) => counts.set(r, (counts.get(r) ?? 0) + 1)));
  return [...counts.entries()].map(([route, count]) => ({ route, count })).sort((a, b) => b.count - a.count);
};

export const categoryCounts = (drugs: CatalogDrug[]) => {
  const counts = new Map<string, number>();
  drugs.forEach((d) => counts.set(d.category, (counts.get(d.category) ?? 0) + 1));
  return counts;
};

export const filterDrugs = <T extends CatalogDrug>(drugs: T[], { query = "", category, flags = [], route }: DrugFilter): T[] => {
  const needle = query.trim().toLowerCase();
  return drugs.filter(
    (d) =>
      (!needle || d.genericName.toLowerCase().includes(needle) || d.brandName.toLowerCase().includes(needle) || d.category.toLowerCase().includes(needle)) &&
      (!category || category === "ALL" || d.category === category) &&
      flags.every((f) => hasFlag(d, f)) &&
      (!route || d.routes.includes(route)),
  );
};

export type Compatibility = "compatible" | "incompatible" | "unknown" | "same";

export const compatibility = (
  matrix: { drugA: string; drugB: string; compatible: boolean }[],
  a: string,
  b: string,
): Compatibility | null => {
  if (!a || !b) return null;
  if (a === b) return "same";
  const pair = matrix.find((p) => (p.drugA === a && p.drugB === b) || (p.drugA === b && p.drugB === a));
  return pair ? (pair.compatible ? "compatible" : "incompatible") : "unknown";
};
