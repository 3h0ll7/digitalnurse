import { SECTIONS, sectionForPath } from "@/lib/sections";
import type { GlassKey } from "./glass";

/** Bar order: Home first, then every section in registry order. */
export const NAV_KEYS: GlassKey[] = ["home", ...SECTIONS.map((s) => s.key)];

export const pathFor = (key: GlassKey) => (key === "home" ? "/home" : SECTIONS.find((s) => s.key === key)?.path ?? "/home");

export const activeNavKey = (pathname: string): GlassKey => {
  if (pathname === "/" || pathname.startsWith("/home")) return "home";
  return sectionForPath(pathname)?.key ?? "home";
};
