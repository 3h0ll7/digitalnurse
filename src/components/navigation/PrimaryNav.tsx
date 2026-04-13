import { useLocation, useNavigate } from "react-router-dom";
import {
  ActivitySquare,
  Activity,
  BookOpenCheck,
  TestTube2,
  ClipboardList,
  Calculator,
  Bot,
  Sparkles,
  GitBranch,
  Pill,
  Droplets,
  FileText,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PrimaryNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = usePreferences();

  const navItems = [
    { path: "/home", icon: ActivitySquare, label: t.navHome },
    { path: "/procedures", icon: BookOpenCheck, label: t.navProcedures },
    { path: "/assessments", icon: ClipboardList, label: t.navAssessments },
    { path: "/calculators", icon: Calculator, label: t.navCalculators },
    { path: "/labs", icon: TestTube2, label: t.navLabs },
    { path: "/drugs", icon: Pill, label: language === "ar" ? "الأدوية" : "DRUGS" },
    { path: "/fluids", icon: Droplets, label: language === "ar" ? "السوائل" : "FLUIDS" },
    { path: "/ecg", icon: Activity, label: language === "ar" ? "تخطيط القلب" : "ECG" },
    { path: "/docs", icon: FileText, label: language === "ar" ? "التوثيق" : "DOCS" },
    { path: "/infection", icon: ShieldCheck, label: language === "ar" ? "العدوى" : "INFECTION" },
    { path: "/flashcards", icon: Sparkles, label: t.navFlashcards },
    { path: "/library", icon: BookOpen, label: language === "ar" ? "المكتبة" : "LIBRARY" },
    { path: "/mind-maps", icon: GitBranch, label: t.navMindMaps },
    { path: "/ai-assistant", icon: Bot, label: t.navAssistant },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 px-4">
      <div className="flex flex-nowrap items-center gap-1 overflow-x-auto rounded-[26px] border border-white/10 bg-card/70 px-2 py-3 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl touch-pan-x">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isLibrary = item.path === "/library";
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(item.path);
          const isLibraryActive = ["/atlas", "/pathways", "/pharma"].some((path) =>
            location.pathname.startsWith(path),
          );
          const activeState = isLibrary ? isLibraryActive : isActive;

          if (isLibrary) {
            return (
              <DropdownMenu key={item.path}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`group flex flex-none flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 min-w-[72px] sm:flex-1 sm:min-w-0 ${
                      activeState
                        ? "bg-primary/20 text-white shadow-[0_8px_30px_rgba(21,154,255,0.35)]"
                        : "text-muted-foreground hover:text-white"
                    }`}
                    aria-label={item.label}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-xs transition-all duration-300 ${
                        activeState
                          ? "border-primary/50 bg-primary/30 text-white"
                          : "border-white/5 bg-white/5 group-hover:border-white/30"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span>{item.label}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="center" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/atlas")}>
                    {language === "ar" ? "أطلس الجسم" : "Body Atlas"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/pathways")}>
                    {language === "ar" ? "الفيزيولوجيا المرضية" : "Pathophysiology"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/pharma")}>
                    {language === "ar" ? "حركية الأدوية" : "Pharmacokinetics"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group flex flex-none flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 min-w-[72px] sm:flex-1 sm:min-w-0 ${
                activeState
                  ? "bg-primary/20 text-white shadow-[0_8px_30px_rgba(21,154,255,0.35)]"
                  : "text-muted-foreground hover:text-white"
              }`}
              aria-label={item.label}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-xs transition-all duration-300 ${
                  activeState
                    ? "border-primary/50 bg-primary/30 text-white"
                    : "border-white/5 bg-white/5 group-hover:border-white/30"
                }`}
              >
                <Icon size={18} />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default PrimaryNav;
