import { describe, expect, it } from "vitest";
import { activeNavKey, moreSections } from "./navModel";

describe("activeNavKey", () => {
  it("highlights home on /home", () => expect(activeNavKey("/home")).toBe("home"));
  it("highlights drugs on a drug detail page", () => expect(activeNavKey("/drugs/5")).toBe("drugs"));
  it("highlights labs on /labs", () => expect(activeNavKey("/labs")).toBe("labs"));
  it("highlights calculators on a calculator detail page", () => expect(activeNavKey("/calculator/bmi")).toBe("calculators"));
  it("highlights more for a library section", () => expect(activeNavKey("/atlas")).toBe("more"));
  it("highlights more for ECG", () => expect(activeNavKey("/ecg")).toBe("more"));
});

describe("moreSections", () => {
  it("lists every section that is not already a bar item", () => {
    const keys = moreSections().map((s) => s.key);
    expect(keys).not.toContain("pharmacy");
    expect(keys).not.toContain("lab");
    expect(keys).not.toContain("station");
    expect(keys).toContain("atlas");
    expect(keys).toHaveLength(13);
  });
});
