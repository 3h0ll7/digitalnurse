import { describe, expect, it } from "vitest";
import { THEME_COLOR, greetingKey, parseStoredTheme, resolveTheme } from "./theme";

const at = (h: number, m: number) => new Date(2026, 9, 9, h, m, 0);

describe("resolveTheme", () => {
  it("is dark just before 07:00 in auto mode", () => expect(resolveTheme("auto", at(6, 59))).toBe("dark"));
  it("turns light at 07:00 in auto mode", () => expect(resolveTheme("auto", at(7, 0))).toBe("light"));
  it("stays light at 18:59 in auto mode", () => expect(resolveTheme("auto", at(18, 59))).toBe("light"));
  it("turns dark at 19:00 in auto mode", () => expect(resolveTheme("auto", at(19, 0))).toBe("dark"));
  it("keeps an explicit light choice at night", () => expect(resolveTheme("light", at(23, 0))).toBe("light"));
  it("keeps an explicit dark choice at noon", () => expect(resolveTheme("dark", at(12, 0))).toBe("dark"));
});

describe("parseStoredTheme", () => {
  it("defaults to auto when nothing is stored", () => expect(parseStoredTheme(null)).toBe("auto"));
  it("keeps a stored dark choice from the old version", () => expect(parseStoredTheme("dark")).toBe("dark"));
  it("keeps a stored light choice from the old version", () => expect(parseStoredTheme("light")).toBe("light"));
  it("falls back to auto for unknown values", () => expect(parseStoredTheme("garbage")).toBe("auto"));
});

describe("greetingKey", () => {
  it("greets the morning from 05:00", () => expect(greetingKey(at(5, 0))).toBe("morning"));
  it("greets the evening from 12:00", () => expect(greetingKey(at(12, 0))).toBe("evening"));
  it("greets the night shift from 19:00", () => expect(greetingKey(at(19, 0))).toBe("night"));
  it("still greets the night shift at 04:59", () => expect(greetingKey(at(4, 59))).toBe("night"));
});

describe("THEME_COLOR", () => {
  it("matches the day and night backgrounds", () => {
    expect(THEME_COLOR.light).toBe("#FBF7F2");
    expect(THEME_COLOR.dark).toBe("#11142B");
  });
});
