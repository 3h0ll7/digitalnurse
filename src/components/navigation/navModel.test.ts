import { describe, expect, it } from "vitest";
import { SECTIONS } from "@/lib/sections";
import { GLASS } from "./glass";
import { activeNavKey, NAV_KEYS, pathFor } from "./navModel";

describe("bottom bar model", () => {
  it("shows home plus every section, each with a glass style", () => {
    expect(NAV_KEYS).toHaveLength(SECTIONS.length + 1);
    for (const k of NAV_KEYS) expect(GLASS[k], k).toBeDefined();
  });
  it("highlights the section of a detail page", () => {
    expect(activeNavKey("/drugs/5")).toBe("pharmacy");
    expect(activeNavKey("/calculator/bmi")).toBe("station");
    expect(activeNavKey("/scale/gcs")).toBe("triage");
    expect(activeNavKey("/ecg")).toBe("ecg");
  });
  it("falls back to home", () => {
    expect(activeNavKey("/home")).toBe("home");
    expect(activeNavKey("/nowhere")).toBe("home");
  });
  it("maps keys to paths", () => {
    expect(pathFor("home")).toBe("/home");
    expect(pathFor("pharmacy")).toBe("/drugs");
  });
});
