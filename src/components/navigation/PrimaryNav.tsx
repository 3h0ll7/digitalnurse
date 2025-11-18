import { useLocation, useNavigate } from "react-router-dom";
import {
  ActivitySquare,
  BookOpenCheck,
  TestTube2,
  ClipboardList,
  Calculator,
  Bot,
  Sparkles,
  GitBranch,
  Cpu,
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

const PrimaryNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = usePreferences();

  const navItems = [
    { path: "/home", icon: ActivitySquare, label: "Home" },
    { path: "/procedures", icon: BookOpenCheck, label: t.navProcedures },
    { path: "/ai-assistant", icon: Bot, label: t.navAssistant },
    { path: "/calculators", icon: Calculator, label: t.navCalculators },
    { path: "/labs", icon: TestTube2, label: "Labs" },
    { path: "/flashcards", icon: Sparkles, label: t.navFlashcards },
    { path: "/mind-maps", icon: GitBranch, label: t.navMindMaps },
    { path: "/ai-tools", icon: Cpu, label: "AI Tools" },
    { path: "/assessments", icon: ClipboardList, label: "Assess" },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 px-4">
      <div className="flex items-center gap-1 rounded-[26px] border border-white/10 bg-card/70 px-2 py-3 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                isActive
                  ? "bg-primary/20 text-white shadow-[0_8px_30px_rgba(21,154,255,0.35)]"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-xs transition-all duration-300 ${
                  isActive
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
