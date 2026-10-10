import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { assessmentScales } from "@/data/assessmentScales";
import { assessText } from "@/data/assessments-text";
import CamIcu from "./CamIcu";
import ItemsScale from "./ItemsScale";
import Must from "./Must";
import News2 from "./News2";

const prefs = vi.hoisted(() => ({ language: "en" as "en" | "ar" }));
vi.mock("@/contexts/PreferencesContext", () => ({ usePreferences: () => ({ language: prefs.language }) }));

describe("assessment components", () => {
  it.each(["en", "ar"] as const)("render every tool empty without a premature result (%s)", (lang) => {
    prefs.language = lang;
    for (const scale of assessmentScales) {
      const el = scale.kind === "news2" ? <News2 scale={scale} /> : scale.kind === "must" ? <Must scale={scale} /> : scale.kind === "cam-icu" ? <CamIcu /> : <ItemsScale scale={scale} />;
      const html = renderToStaticMarkup(el);
      expect(html, scale.id).not.toMatch(/NaN|undefined|Infinity/);
      expect(html, scale.id).not.toMatch(/No delirium|negative —|Not at risk|Minimal|Reassuring/);
      const waiting = scale.items.every((i) => i.multi) ? assessText[lang].finishChecklist : assessText[lang].finish;
      if (scale.kind === "items") expect(html, scale.id).toContain(waiting);
    }
  });
});
