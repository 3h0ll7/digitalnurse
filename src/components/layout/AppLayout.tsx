import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/contexts/PreferencesContext";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  className?: string;
  badgeLabel?: string;
  subBadgeLabel?: string;
}

const AppLayout = ({
  title,
  subtitle,
  actions,
  children,
  onBack,
  className,
  badgeLabel,
  subBadgeLabel
}: AppLayoutProps) => {
  const { direction, t } = usePreferences();

  return (
    <div
      dir={direction}
      className="relative min-h-screen overflow-x-hidden pb-[calc(10rem+env(safe-area-inset-bottom))] bg-background text-foreground">

    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-[calc(2rem+env(safe-area-inset-top))] sm:px-6">
      <header className="mb-8 rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {onBack ?
              <button
                onClick={onBack}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary transition-all duration-300 hover:-translate-y-0.5"
                aria-label={t.goBack}>
                <ChevronLeft size={18} className="rtl:rotate-180" />
              </button> :

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
                <div className="relative h-6 w-6">
                  <span className="absolute inset-0 rounded-full border border-primary/30" />
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary" />
                  <span className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 bg-primary" style={{ height: "100%" }} />
                </div>
              </div>
              }
            <div>
              {subtitle &&
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{subtitle}</p>
                }
              <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground text-start sm:text-xl font-mono">
                {title}
              </h1>
            </div>
          </div>
          {actions &&
            <div className="flex flex-1 items-center justify-end gap-3 sm:justify-end">
              {actions}
            </div>
            }
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1 text-primary bg-primary/5 font-serif">
            {badgeLabel ?? t.appBadge}
          </span>
          <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-muted-foreground">
            {subBadgeLabel ?? t.appSubBadge}
          </span>
        </div>
      </header>

      <main className={cn("space-y-6", className)}>{children}</main>

      <footer className="mt-12 mb-4 text-center space-y-2">
        <p className="text-xs text-muted-foreground tracking-wide">
          Developed by : <span className="text-foreground font-medium">𝓗𝓪𝓼𝓼𝓪𝓷 𝓼𝓪𝓵𝓶𝓪𝓷</span>
        </p>
        <p className="text-[11px] text-muted-foreground/80 tracking-wide">
          Nurse ICU — <span className="text-foreground/70 font-medium">Al-Najaf Teaching Hospital</span>
        </p>
        <a
            href="https://hassanaii.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
          hassanaii.lovable.app
        </a>
      </footer>
    </div>
    </div>);

};

export default AppLayout;
