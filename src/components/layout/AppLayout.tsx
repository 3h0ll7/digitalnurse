import { ReactNode } from "react";
import { ChevronLeft, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { SceneKey } from "@/lib/sections";
import SectionScene from "@/components/iso/SectionScene";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  className?: string;
  /** Isometric scene shown under the header row. */
  illustration?: SceneKey;
}

const AppLayout = ({ title, subtitle, actions, children, onBack, className, illustration }: AppLayoutProps) => {
  const { direction, t, setPreferencesOpen } = usePreferences();

  return (
    <div dir={direction} className="relative min-h-screen overflow-x-hidden pb-4 text-foreground">
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6">
        <header className="mb-6 rounded-3xl border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={t.goBack}
              >
                <ChevronLeft size={18} className="rtl:rotate-180" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold leading-tight text-foreground text-balance">{title}</h1>
              {subtitle && <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{subtitle}</p>}
            </div>
            {actions && <div className="hidden items-center gap-2 sm:flex">{actions}</div>}
            {illustration && <SectionScene scene={illustration} className="w-24 shrink-0 sm:w-40" />}
            <button
              type="button"
              onClick={() => setPreferencesOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t.openSettings}
            >
              <Settings size={18} />
            </button>
          </div>
          {actions && <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">{actions}</div>}
        </header>

        <main className={cn("space-y-6", className)}>{children}</main>

        <footer className="mt-12 mb-4 space-y-1 text-center">
          <p className="text-xs text-muted-foreground">
            Developed by : <span className="font-medium text-foreground/80">𝓗𝓪𝓼𝓼𝓪𝓷 𝓼𝓪𝓵𝓶𝓪𝓷</span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            Nurse ICU — <span className="font-medium text-foreground/70">Al-Najaf Teaching Hospital</span>
          </p>
          <a
            href="https://hassanaii.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
          >
            hassanaii.lovable.app
          </a>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
