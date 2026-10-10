import {
  Atom,
  Calculator,
  ChartSpline,
  ClipboardCheck,
  Droplets,
  FilePenLine,
  FlaskConical,
  GalleryVerticalEnd,
  HeartPulse,
  House,
  MessageSquareHeart,
  Network,
  PersonStanding,
  Pill,
  ShieldPlus,
  BookOpenText,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import type { SceneKey } from "@/lib/sections";

export type GlassKey = SceneKey | "home";

export interface GlassStyle {
  icon: LucideIcon;
  /** Gradient top → bottom; the glow uses the bottom colour. */
  from: string;
  to: string;
  short: { en: string; ar: string };
}

/** Liquid-glass tile colours and short bar labels, one per section. */
export const GLASS: Record<GlassKey, GlassStyle> = {
  home: { icon: House, from: "#7aa7ff", to: "#4f46e5", short: { en: "Home", ar: "الرئيسية" } },
  pharmacy: { icon: Pill, from: "#ff8fa3", to: "#e11d48", short: { en: "Drugs", ar: "الأدوية" } },
  lab: { icon: FlaskConical, from: "#5fd0ff", to: "#0284c7", short: { en: "Labs", ar: "التحاليل" } },
  ecg: { icon: HeartPulse, from: "#ff8a80", to: "#dc2626", short: { en: "ECG", ar: "القلب" } },
  icu: { icon: Syringe, from: "#a5b4fc", to: "#4f46e5", short: { en: "Procedures", ar: "الإجراءات" } },
  triage: { icon: ClipboardCheck, from: "#5eead4", to: "#0d9488", short: { en: "Assess", ar: "التقييمات" } },
  station: { icon: Calculator, from: "#fcd34d", to: "#f97316", short: { en: "Calculators", ar: "الحاسبات" } },
  library: { icon: GalleryVerticalEnd, from: "#f0abfc", to: "#a21caf", short: { en: "Flashcards", ar: "البطاقات" } },
  iv: { icon: Droplets, from: "#67e8f9", to: "#0ea5e9", short: { en: "IV fluids", ar: "السوائل" } },
  ai: { icon: MessageSquareHeart, from: "#f9a8d4", to: "#c026d3", short: { en: "AI", ar: "المساعد" } },
  docs: { icon: FilePenLine, from: "#b6c2d4", to: "#475569", short: { en: "Docs", ar: "التوثيق" } },
  infection: { icon: ShieldPlus, from: "#86efac", to: "#16a34a", short: { en: "Infection", ar: "العدوى" } },
  terms: { icon: BookOpenText, from: "#fdba74", to: "#ea580c", short: { en: "Terms", ar: "المصطلحات" } },
  atlas: { icon: PersonStanding, from: "#7dd3fc", to: "#0891b2", short: { en: "Atlas", ar: "الأطلس" } },
  pathways: { icon: ChartSpline, from: "#bef264", to: "#16a34a", short: { en: "Patho", ar: "الإمراضية" } },
  pharma: { icon: Atom, from: "#fbcfe8", to: "#db2777", short: { en: "PK", ar: "الحركية" } },
  mindmaps: { icon: Network, from: "#c7d2fe", to: "#6366f1", short: { en: "Mind maps", ar: "الخرائط" } },
};
