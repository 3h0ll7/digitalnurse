import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import calculatorsI18n from "@/data/calculators-i18n.json";
import { calcText } from "@/data/calculators-text";
import { CALCULATORS, CATEGORY_ORDER } from "./registry";

const prefs = vi.hoisted(() => ({ language: "en" as "en" | "ar" }));
vi.mock("@/contexts/PreferencesContext", () => ({ usePreferences: () => ({ language: prefs.language }) }));

describe("calculator registry", () => {
  it("has a name and description for every calculator in both languages", () => {
    for (const lang of ["en", "ar"] as const) {
      for (const { id } of CALCULATORS) {
        expect(calculatorsI18n[lang].calculators[id].name).toBeTruthy();
        expect(calculatorsI18n[lang].calculators[id].description).toBeTruthy();
      }
    }
  });

  it("files every calculator under a listed category", () => {
    expect(CALCULATORS.every((c) => CATEGORY_ORDER.includes(c.category))).toBe(true);
    expect(new Set(CALCULATORS.map((c) => c.id)).size).toBe(CALCULATORS.length);
  });

  it.each(["en", "ar"] as const)("renders every calculator empty, without numbers made up from blanks (%s)", (lang) => {
    prefs.language = lang;
    for (const { id, Component } of CALCULATORS) {
      const html = renderToStaticMarkup(<Component />);
      expect(html, id).not.toMatch(/NaN|Infinity|undefined/);
      if (id !== "edd") expect(html, id).toContain(calcText[lang].enter);
    }
  });
});
