import { describe, expect, it } from "vitest";
import { SECTIONS, sectionForPath } from "./sections";

// Routes declared in src/App.tsx (list pages only).
const ROUTES = [
  "/home", "/drugs", "/fluids", "/procedures", "/labs", "/assessments", "/calculators", "/ai-assistant",
  "/flashcards", "/mind-maps", "/atlas", "/pathways", "/pharma", "/ecg", "/docs", "/infection", "/terminology",
];

describe("SECTIONS", () => {
  it("only links to routes that exist in App.tsx", () => {
    for (const section of SECTIONS) expect(ROUTES).toContain(section.path);
  });
  it("has one entry per section scene", () => expect(SECTIONS).toHaveLength(16));
  it("puts exactly nine rooms in the hospital", () => expect(SECTIONS.filter((s) => s.inHospital)).toHaveLength(9));
  it("has titles in both languages", () => {
    for (const s of SECTIONS) {
      expect(s.title.en.length).toBeGreaterThan(0);
      expect(s.title.ar.length).toBeGreaterThan(0);
    }
  });
});

describe("sectionForPath", () => {
  it("maps a drug detail page to the pharmacy", () => expect(sectionForPath("/drugs/abc")?.key).toBe("pharmacy"));
  it("maps a procedure detail page to the ICU", () => expect(sectionForPath("/procedure/x")?.key).toBe("icu"));
  it("maps a calculator detail page to the nurse station", () => expect(sectionForPath("/calculator/bmi")?.key).toBe("station"));
  it("maps a scale detail page to triage", () => expect(sectionForPath("/scale/gcs")?.key).toBe("triage"));
  it("maps docs sub-pages to docs", () => expect(sectionForPath("/docs/patient")?.key).toBe("docs"));
  it("returns nothing for home", () => expect(sectionForPath("/home")).toBeUndefined());
  it("does not confuse /pharma with /pharmacy-like prefixes", () => expect(sectionForPath("/pharma")?.key).toBe("pharma"));
});
