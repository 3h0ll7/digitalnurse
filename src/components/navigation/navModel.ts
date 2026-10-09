import { SECTIONS, sectionForPath, type AppSection, type SceneKey } from "@/lib/sections";

export type NavKey = "home" | "drugs" | "labs" | "calculators" | "more";

/** Sections that have their own slot in the bottom bar. */
export const BAR_SECTIONS: Partial<Record<SceneKey, NavKey>> = {
  pharmacy: "drugs",
  lab: "labs",
  station: "calculators",
};

export const activeNavKey = (pathname: string): NavKey => {
  if (pathname === "/" || pathname.startsWith("/home")) return "home";
  const section = sectionForPath(pathname);
  if (!section) return "home";
  return BAR_SECTIONS[section.key] ?? "more";
};

export const moreSections = (): AppSection[] => SECTIONS.filter((s) => !BAR_SECTIONS[s.key]);
