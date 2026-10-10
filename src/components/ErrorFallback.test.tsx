import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ErrorFallback from "./ErrorFallback";
import { resolveSupabaseUrl } from "@/lib/supabaseEnv";

describe("ErrorFallback", () => {
  it("announces the error with a reload button in English", () => {
    const html = renderToStaticMarkup(<ErrorFallback language="en" message="boom" />);
    expect(html).toContain('role="alert"');
    expect(html).toContain("Something went wrong");
    expect(html).toContain("boom");
    expect(html).toContain("Reload");
  });

  it("switches to Arabic and right-to-left", () => {
    const html = renderToStaticMarkup(<ErrorFallback language="ar" />);
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("إعادة التحميل");
  });
});

describe("resolveSupabaseUrl", () => {
  it("falls back to the project URL when the env var is missing or blank", () => {
    expect(resolveSupabaseUrl(undefined)).toBe("https://gugdclgdpuyhykrjyhph.supabase.co");
    expect(resolveSupabaseUrl("  ")).toBe("https://gugdclgdpuyhykrjyhph.supabase.co");
  });

  it("keeps a configured URL and drops a trailing slash", () => {
    expect(resolveSupabaseUrl("https://example.supabase.co/")).toBe("https://example.supabase.co");
  });
});
