import { Card } from "@/components/ui/card";
import AppLayout from "@/components/layout/AppLayout";
import {
  Activity,
  Bot,
  BookOpenCheck,
  Calculator,
  ClipboardList,
  Droplets,
  GitBranch,
  Microscope,
  Pill,
  Sparkles,
  TestTube2,
  FileText,
  BookOpen,
  FlaskConical,
  LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";

interface SectionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  accent: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { t, language } = usePreferences();

  const sections: SectionItem[] = [
    {
      title: t.proceduralPlaybooks,
      description: t.proceduralPlaybooksDesc,
      icon: BookOpenCheck,
      to: "/procedures",
      accent: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    },
    {
      title: t.assessmentCoPilot,
      description: t.assessmentCoPilotDesc,
      icon: ClipboardList,
      to: "/assessments",
      accent: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    },
    {
      title: language === "ar" ? "الحاسبات السريرية" : "Clinical Calculators",
      description: language === "ar" ? "حسابات الجرعات والسوائل ومؤشرات الجسم" : "Dosage, IV drip rate, BMI & fluid calculations",
      icon: Calculator,
      to: "/calculators",
      accent: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    },
    {
      title: t.labIntelligence,
      description: t.labIntelligenceDesc,
      icon: TestTube2,
      to: "/labs",
      accent: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    },
    {
      title: t.drugReference,
      description: t.drugReferenceDesc,
      icon: Pill,
      to: "/drugs",
      accent: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    },
    {
      title: language === "ar" ? "السوائل الوريدية" : "IV Fluids",
      description: language === "ar" ? "أنواع السوائل ومعدلات التسريب" : "Fluid types, rates & electrolyte content",
      icon: Droplets,
      to: "/fluids",
      accent: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30",
    },
    {
      title: language === "ar" ? "تخطيط القلب" : "ECG Interpretation",
      description: language === "ar" ? "تحليل وتفسير تخطيط القلب" : "ECG rhythms, patterns & interpretation guide",
      icon: Activity,
      to: "/ecg",
      accent: "from-red-500/20 to-rose-500/20 border-red-500/30",
    },
    {
      title: language === "ar" ? "التوثيق السريري" : "Clinical Documentation",
      description: language === "ar" ? "نماذج وأدوات التوثيق التمريضي" : "Nursing notes, templates & documentation tools",
      icon: FileText,
      to: "/docs",
      accent: "from-slate-500/20 to-gray-500/20 border-slate-500/30",
    },
    {
      title: language === "ar" ? "البطاقات التعليمية" : "Flashcards",
      description: language === "ar" ? "بطاقات مراجعة سريعة للمفاهيم التمريضية" : "Quick review cards for nursing concepts",
      icon: Sparkles,
      to: "/flashcards",
      accent: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    },
    {
      title: language === "ar" ? "أطلس الجسم" : "Body Atlas",
      description: language === "ar" ? "تشريح الجسم البشري التفاعلي" : "Interactive human anatomy reference",
      icon: Microscope,
      to: "/atlas",
      accent: "from-teal-500/20 to-emerald-500/20 border-teal-500/30",
    },
    {
      title: language === "ar" ? "المكتبة العلمية" : "Pathophysiology",
      description: language === "ar" ? "الفيزيولوجيا المرضية والمسارات السريرية" : "Disease pathways & clinical mechanisms",
      icon: BookOpen,
      to: "/pathways",
      accent: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
    },
    {
      title: language === "ar" ? "الحركية الدوائية" : "Pharmacokinetics",
      description: language === "ar" ? "تصور امتصاص وتوزيع الأدوية" : "Drug absorption, distribution & metabolism visualizer",
      icon: FlaskConical,
      to: "/pharmacokinetics",
      accent: "from-lime-500/20 to-green-500/20 border-lime-500/30",
    },
    {
      title: language === "ar" ? "الخرائط الذهنية" : "Mind Maps",
      description: language === "ar" ? "خرائط مفاهيمية للمواضيع السريرية" : "Visual concept maps for clinical topics",
      icon: GitBranch,
      to: "/mind-maps",
      accent: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30",
    },
  ];

  return (
    <AppLayout
      title={t.homeTitle}
      subtitle={t.homeSubtitle}
    >
      {/* AI Assistant - Featured */}
      <button
        onClick={() => navigate("/ai-assistant")}
        className="group w-full rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-accent/10 p-5 text-start transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_10px_40px_rgba(21,154,255,0.2)]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/20">
            <Bot className="text-primary" size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {language === "ar" ? "المساعد الذكي AI" : "AI Nursing Assistant"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "اسأل عن الإجراءات والأدوية والحالات السريرية"
                : "Ask about procedures, medications & clinical scenarios"}
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {t.open} →
          </span>
        </div>
      </button>

      {/* All Sections Grid */}
      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.to}
              onClick={() => navigate(section.to)}
              className={`group flex flex-col items-center gap-3 rounded-2xl border bg-gradient-to-br ${section.accent} p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/50">
                <Icon className="text-foreground" size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground leading-tight">
                  {section.title}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                  {section.description}
                </p>
              </div>
            </button>
          );
        })}
      </section>
    </AppLayout>
  );
};

export default Home;
