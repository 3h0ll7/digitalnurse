import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("announces the message politely and shows the title", () => {
    const html = renderToStaticMarkup(<EmptyState variant="no-results" title="No matching results" />);
    expect(html).toContain('role="status"');
    expect(html).toContain("No matching results");
  });
  it("draws a decorative scene for each variant", () => {
    for (const variant of ["no-results", "offline", "not-found"] as const) {
      const html = renderToStaticMarkup(<EmptyState variant={variant} title="x" />);
      expect(html).toContain("<svg");
      expect(html).toContain('aria-hidden="true"');
    }
  });
  it("renders an optional description and action", () => {
    const html = renderToStaticMarkup(
      <EmptyState variant="not-found" title="t" description="Try another word" action={<a href="/home">Home</a>} />,
    );
    expect(html).toContain("Try another word");
    expect(html).toContain('href="/home"');
  });
});
