import { describe, expect, it } from "vitest";
import { bundles, organisms, PRECAUTION_ORDER, PRECAUTIONS } from "./infection";
import { SOURCES } from "./sources";

const find = (name: string) => organisms.find((o) => o.name.startsWith(name));

describe("infection reference", () => {
  it("maps organisms to the HICPAC precautions", () => {
    expect(find("SARS-CoV-2")?.precautions).toContain("airborne");
    expect(find("Streptococcus pneumoniae")?.precautions).toEqual(["standard"]);
    expect(find("Listeria")?.precautions).toEqual(["standard"]);
    expect(find("Aspergillus")?.precautions).toEqual(["standard"]);
    expect(find("Pneumocystis")?.precautions).toEqual(["standard"]);
    expect(find("Varicella")?.precautions).toEqual(["airborne", "contact"]);
    expect(find("Measles")?.precautions).toEqual(["airborne"]);
  });

  it("uses only known precaution types and has a card for each", () => {
    for (const o of organisms) for (const p of o.precautions) expect(PRECAUTION_ORDER).toContain(p);
    for (const p of PRECAUTION_ORDER) expect(PRECAUTIONS[p].ppe).toBeTruthy();
  });

  it("does not recommend chlorhexidine oral care or the 3–6 ft mask rule", () => {
    const text = JSON.stringify({ organisms, bundles, PRECAUTIONS });
    expect(text).not.toMatch(/Oral care CHG|3-6 ft/);
    expect(bundles.find((b) => b.key === "vap")?.items.join(" ")).toMatch(/without chlorhexidine/);
  });

  it("cites known sources", () => {
    for (const b of bundles) for (const s of b.sources) expect(SOURCES[s]).toBeDefined();
  });
});
