import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpenCheck,
  TestTube2,
  ClipboardList,
  Calculator,
  Bot,
  Sparkles,
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

const PrimaryNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = usePreferences();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/procedures", icon: BookOpenCheck, label: t.navProcedures },
    { path: "/labs", icon: TestTube2, label: "Labs" },
    { path: "/assessments", icon: ClipboardList, label: "Assess" },
    { path: "/calculators", icon: Calculator, label: t.navCalculators },
    { path: "/flashcards", icon: Sparkles, label: t.navFlashcards },
    { path: "/ai-assistant", icon: Bot, label: t.navAssistant },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border shadow-2xl backdrop-blur">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default PrimaryNav;
