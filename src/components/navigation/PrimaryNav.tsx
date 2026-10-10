import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { GLASS } from "./glass";
import GlassIcon from "./GlassIcon";
import { activeNavKey, NAV_KEYS, pathFor } from "./navModel";

/** One scrollable row of every section as liquid-glass icons; the open section scrolls into view. */
const PrimaryNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, direction } = usePreferences();
  const active = activeNavKey(location.pathname);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav dir={direction} aria-label={language === "ar" ? "أقسام التطبيق" : "App sections"} className="fixed inset-x-0 bottom-0 z-50 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-white/60 bg-card/70 shadow-card backdrop-blur-2xl dark:border-white/10">
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-1 overflow-x-auto px-2 py-2 [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)] [&>li:first-child]:ms-auto [&>li:last-child]:me-auto">
          {NAV_KEYS.map((key) => {
            const isActive = active === key;
            return (
              <li key={key} className="snap-center">
                <button
                  ref={isActive ? activeRef : undefined}
                  type="button"
                  onClick={() => navigate(pathFor(key))}
                  aria-current={isActive ? "page" : undefined}
                  className="flex w-[4.25rem] lg:w-[3.9rem] flex-col items-center gap-1 rounded-2xl px-0.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <GlassIcon name={key} size={40} active={isActive} />
                  <span className={cn("max-w-full truncate text-[10px] leading-tight", isActive ? "font-semibold text-primary" : "text-muted-foreground")}>{GLASS[key].short[language]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default PrimaryNav;
