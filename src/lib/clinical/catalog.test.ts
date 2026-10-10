import { describe, expect, it } from "vitest";
import catalog from "@/data/drugs-catalog.json";
import { compatibility, drugStats, filterDrugs, routeCounts } from "./catalog";

const drugs = catalog.drugs;

describe("drugStats", () => {
  it("counts the catalogue flags", () => {
    expect(drugStats(drugs)).toEqual({ total: 60, highAlert: 24, emergency: 14, weightBased: 19, titration: 15 });
  });
});

describe("routeCounts", () => {
  it("counts each route, most common first", () => {
    const counts = routeCounts(drugs);
    expect(counts[0]).toEqual({ route: "IV", count: 59 });
    expect(Object.fromEntries(counts.map((c) => [c.route, c.count]))).toMatchObject({ IO: 15, PO: 10, IM: 8, SubQ: 4, ET: 3 });
  });
});

describe("filterDrugs", () => {
  it("returns everything with no filters", () => {
    expect(filterDrugs(drugs, {})).toHaveLength(60);
  });
  it("combines search, category, flags and route", () => {
    expect(filterDrugs(drugs, { flags: ["highAlert"] })).toHaveLength(24);
    expect(filterDrugs(drugs, { flags: ["highAlert", "emergency"] }).every((d) => d.highAlert && d.emergency)).toBe(true);
    expect(filterDrugs(drugs, { route: "ET" })).toHaveLength(3);
    expect(filterDrugs(drugs, { category: "VASOPRESSORS" }).every((d) => d.category === "VASOPRESSORS")).toBe(true);
    expect(filterDrugs(drugs, { query: "levophed" }).map((d) => d.id)).toContain("norepinephrine");
  });
});

describe("compatibility", () => {
  it("looks pairs up in either order", () => {
    expect(compatibility(catalog.ivCompatibilityMatrix, "Vasopressin", "Norepinephrine")).toBe("compatible");
    expect(compatibility(catalog.ivCompatibilityMatrix, "Sodium Bicarbonate", "Calcium Chloride")).toBe("incompatible");
  });
  it("reports unknown pairs and same-drug picks separately", () => {
    expect(compatibility(catalog.ivCompatibilityMatrix, "Heparin", "Insulin")).toBe("unknown");
    expect(compatibility(catalog.ivCompatibilityMatrix, "Heparin", "Heparin")).toBe("same");
    expect(compatibility(catalog.ivCompatibilityMatrix, "", "Heparin")).toBeNull();
  });
});
