import { describe, expect, it } from "vitest";
import { parseNumber } from "./numbers";

describe("parseNumber", () => {
  it("returns null for empty or blank input instead of 0", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("   ")).toBeNull();
    expect(parseNumber(undefined)).toBeNull();
  });
  it("parses decimals and negatives", () => {
    expect(parseNumber("7.35")).toBe(7.35);
    expect(parseNumber("-2.5")).toBe(-2.5);
  });
  it("accepts Arabic-Indic digits and the Arabic decimal separator", () => {
    expect(parseNumber("١٣٥")).toBe(135);
    expect(parseNumber("٧٫٣٥")).toBe(7.35);
  });
  it("accepts a comma as decimal separator", () => {
    expect(parseNumber("4,5")).toBe(4.5);
  });
  it("rejects text and non-finite values", () => {
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("12abc")).toBeNull();
    expect(parseNumber("Infinity")).toBeNull();
  });
});
