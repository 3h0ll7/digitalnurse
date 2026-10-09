import {
  Activity,
  BookA,
  BookOpen,
  BookOpenCheck,
  Bot,
  Calculator,
  ClipboardList,
  Droplets,
  FileText,
  FlaskConical,
  GitBranch,
  Microscope,
  Pill,
  ShieldAlert,
  Sparkles,
  TestTube2,
  type LucideIcon,
} from "lucide-react";

export type SceneKey =
  | "pharmacy"
  | "lab"
  | "ecg"
  | "icu"
  | "triage"
  | "station"
  | "library"
  | "iv"
  | "ai"
  | "docs"
  | "infection"
  | "atlas"
  | "pathways"
  | "pharma"
  | "terms"
  | "mindmaps";

type Bilingual = { en: string; ar: string };

export interface AppSection {
  key: SceneKey;
  path: string;
  icon: LucideIcon;
  title: Bilingual;
  description: Bilingual;
  /** Shown as a room on the Home hospital map. */
  inHospital: boolean;
  /** Detail routes that belong to this section (e.g. /drugs/:id). */
  detailPrefixes?: string[];
}

export const SECTIONS: AppSection[] = [
  {
    key: "pharmacy",
    path: "/drugs",
    icon: Pill,
    title: { en: "Drug Reference", ar: "دليل الأدوية" },
    description: { en: "Dosing, cautions & nursing checks", ar: "الجرعات والتحذيرات وفحوصات التمريض" },
    inHospital: true,
  },
  {
    key: "lab",
    path: "/labs",
    icon: TestTube2,
    title: { en: "Lab Values", ar: "التحاليل المختبرية" },
    description: { en: "Normal ranges & critical values", ar: "القيم الطبيعية والحرجة" },
    inHospital: true,
  },
  {
    key: "ecg",
    path: "/ecg",
    icon: Activity,
    title: { en: "ECG Interpretation", ar: "تخطيط القلب" },
    description: { en: "Rhythms, patterns & interpretation", ar: "تحليل وتفسير تخطيط القلب" },
    inHospital: true,
  },
  {
    key: "icu",
    path: "/procedures",
    icon: BookOpenCheck,
    title: { en: "Procedures", ar: "الإجراءات التمريضية" },
    description: { en: "Step-by-step bedside procedures", ar: "خطوات الإجراءات بجانب السرير" },
    inHospital: true,
    detailPrefixes: ["/procedure/"],
  },
  {
    key: "triage",
    path: "/assessments",
    icon: ClipboardList,
    title: { en: "Assessments", ar: "التقييمات السريرية" },
    description: { en: "Validated bedside scales & risk scores", ar: "المقاييس السريرية وتقييم الخطورة" },
    inHospital: true,
    detailPrefixes: ["/scale/"],
  },
  {
    key: "station",
    path: "/calculators",
    icon: Calculator,
    title: { en: "Clinical Calculators", ar: "الحاسبات السريرية" },
    description: { en: "Dosage, IV drip rate, BMI & fluids", ar: "حسابات الجرعات والسوائل ومؤشرات الجسم" },
    inHospital: true,
    detailPrefixes: ["/calculator/"],
  },
  {
    key: "library",
    path: "/flashcards",
    icon: Sparkles,
    title: { en: "Flashcards", ar: "البطاقات التعليمية" },
    description: { en: "Quick review cards for nursing concepts", ar: "بطاقات مراجعة سريعة للمفاهيم التمريضية" },
    inHospital: true,
  },
  {
    key: "iv",
    path: "/fluids",
    icon: Droplets,
    title: { en: "IV Fluids", ar: "السوائل الوريدية" },
    description: { en: "Fluid types, rates & electrolytes", ar: "أنواع السوائل ومعدلات التسريب" },
    inHospital: true,
  },
  {
    key: "ai",
    path: "/ai-assistant",
    icon: Bot,
    title: { en: "AI Assistant", ar: "المساعد الذكي" },
    description: { en: "Ask about procedures, drugs & cases", ar: "اسأل عن الإجراءات والأدوية والحالات" },
    inHospital: true,
  },
  {
    key: "docs",
    path: "/docs",
    icon: FileText,
    title: { en: "Clinical Documentation", ar: "التوثيق السريري" },
    description: { en: "Nursing notes & templates", ar: "نماذج وأدوات التوثيق التمريضي" },
    inHospital: false,
  },
  {
    key: "infection",
    path: "/infection",
    icon: ShieldAlert,
    title: { en: "Infection Control", ar: "مكافحة العدوى" },
    description: { en: "PPE, isolation & exposure response", ar: "معدات الوقاية والعزل والتعامل مع التعرض" },
    inHospital: false,
  },
  {
    key: "terms",
    path: "/terminology",
    icon: BookA,
    title: { en: "Medical Terms", ar: "المصطلحات الطبية" },
    description: { en: "Bilingual medical dictionary", ar: "قاموس طبي ثنائي اللغة" },
    inHospital: false,
  },
  {
    key: "atlas",
    path: "/atlas",
    icon: Microscope,
    title: { en: "Body Atlas", ar: "أطلس الجسم" },
    description: { en: "Interactive anatomy reference", ar: "تشريح الجسم البشري التفاعلي" },
    inHospital: false,
  },
  {
    key: "pathways",
    path: "/pathways",
    icon: BookOpen,
    title: { en: "Pathophysiology", ar: "الفيزيولوجيا المرضية" },
    description: { en: "Disease pathways & mechanisms", ar: "المسارات المرضية والآليات السريرية" },
    inHospital: false,
  },
  {
    key: "pharma",
    path: "/pharma",
    icon: FlaskConical,
    title: { en: "Pharmacokinetics", ar: "الحركية الدوائية" },
    description: { en: "Absorption, distribution & metabolism", ar: "امتصاص وتوزيع واستقلاب الأدوية" },
    inHospital: false,
  },
  {
    key: "mindmaps",
    path: "/mind-maps",
    icon: GitBranch,
    title: { en: "Mind Maps", ar: "الخرائط الذهنية" },
    description: { en: "Visual concept maps", ar: "خرائط مفاهيمية للمواضيع السريرية" },
    inHospital: false,
  },
];

const matchesPath = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

export const sectionForPath = (pathname: string): AppSection | undefined =>
  SECTIONS.find(
    (s) => matchesPath(pathname, s.path) || s.detailPrefixes?.some((prefix) => pathname.startsWith(prefix)),
  );
