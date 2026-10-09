import { describe, expect, it } from "vitest";
import { createSseParser, extractSseContent } from "./aiChat";

describe("extractSseContent", () => {
  it("returns the delta text of an OpenAI-style chunk", () => {
    expect(extractSseContent('data: {"choices":[{"delta":{"content":"Hello"}}]}')).toBe("Hello");
  });
  it("ignores the DONE marker, comments and reasoning-only chunks", () => {
    expect(extractSseContent("data: [DONE]")).toBeNull();
    expect(extractSseContent(": keep-alive")).toBeNull();
    expect(extractSseContent('data: {"choices":[{"delta":{"reasoning":"thinking"}}]}')).toBeNull();
  });
  it("ignores malformed JSON instead of throwing", () => {
    expect(extractSseContent("data: {oops")).toBeNull();
  });
});

describe("createSseParser", () => {
  it("joins content split across network chunks and lines", () => {
    const out: string[] = [];
    const parser = createSseParser((t) => out.push(t));
    parser.push('data: {"choices":[{"delta":{"content":"Hel"}}]}\n\ndata: {"choi');
    parser.push('ces":[{"delta":{"content":"lo"}}]}\r\n');
    parser.push("data: [DONE]\n");
    parser.end();
    expect(out.join("")).toBe("Hello");
  });
  it("flushes a final line that has no trailing newline", () => {
    const out: string[] = [];
    const parser = createSseParser((t) => out.push(t));
    parser.push('data: {"choices":[{"delta":{"content":"end"}}]}');
    parser.end();
    expect(out).toEqual(["end"]);
  });
});
