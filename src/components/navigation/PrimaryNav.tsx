import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActivitySquare, Calculator, LayoutGrid, Pill, TestTube2, type LucideIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { activeNavKey, moreSections, type NavKey } from "./navModel";

interface BarItem {
  key: NavKey;
  path?: string;
  icon: LucideIcon;
  label: { en: string; ar: string };
}

const BAR_ITEMS: BarItem[] = [
  { key: "home", path: "/home", icon: ActivitySquare, label: { en: "Home", ar: "الرئيسية" } },
  { key: "drugs", path: "/drugs", icon: Pill, label: { en: "Drugs", ar: "الأدوية" } },
  { key: "labs", path: "/labs", icon: TestTube2, label: { en: "Labs", ar: "التحاليل" } },
  { key: "calculators", path: "/calculators", icon: Calculator, label: { en: "Calculators", ar: "الحاسبات" } },
  { key: "more", icon: LayoutGrid, label: { en: "More", ar: "المزيد" } },
];

const PrimaryNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, direction, t } = usePreferences();
  const [moreOpen, setMoreOpen] = useState(false);
  const active = activeNavKey(location.pathname);

  const go = (path: string) => {
    setMoreOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav
        dir={direction}
        aria-label={language === "ar" ? "التنقل الرئيسي" : "Primary"}
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-3xl border bg-card/90 p-1.5 shadow-card backdrop-blur-xl">
          {BAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => (item.path ? navigate(item.path) : setMoreOpen(true))}
                  aria-current={isActive && item.path ? "page" : undefined}
                  aria-haspopup={item.path ? undefined : "dialog"}
                  className={cn(
                    "flex w-full flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="truncate">{item.label[language]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Drawer open={moreOpen} onOpenChange={setMoreOpen}>
        <DrawerContent dir={direction} className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <DrawerHeader className="text-start">
            <DrawerTitle>{t.moreLabel}</DrawerTitle>
            <DrawerDescription className="sr-only">{t.moreLabel}</DrawerDescription>
          </DrawerHeader>
          <div className="grid grid-cols-3 gap-2 px-4 sm:grid-cols-4">
            {moreSections().map((section) => {
              const Icon = section.icon;
              const isHere = location.pathname.startsWith(section.path);
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => go(section.path)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isHere ? "border-primary/40 bg-primary/10 text-primary" : "bg-card text-foreground hover:bg-secondary",
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="leading-tight">{section.title[language]}</span>
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PrimaryNav;
