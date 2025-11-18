import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  className?: string;
}

const AppLayout = ({
  title,
  subtitle,
  actions,
  children,
  onBack,
  className,
}: AppLayoutProps) => (
  <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(21,154,255,0.35),_transparent_60%),linear-gradient(180deg,_#030711_0%,_#03060f_100%)] pb-[calc(10rem+env(safe-area-inset-bottom))] text-foreground">
    <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:120px_120px]" />
    <div className="absolute inset-x-10 top-[-120px] h-64 rounded-[50%] bg-[radial-gradient(circle,_rgba(80,255,235,0.18),transparent_70%)] blur-3xl" />
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-[calc(2rem+env(safe-area-inset-top))] sm:px-6">
      <header className="mb-8 rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_25px_120px_rgba(0,168,255,0.18)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                onClick={onBack}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-primary/40 to-primary/10 text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Go back"
              >
                <ChevronLeft size={18} />
              </button>
            ) : (
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-primary/30 to-transparent text-white shadow-[0_0_30px_rgba(0,168,255,0.35)] animate-pulse-glow">
                <span className="absolute inset-1 rounded-2xl border border-white/10" />
                <div className="relative h-6 w-6">
                  <span className="absolute inset-0 rounded-full border border-white/30" />
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary" />
                  <span className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 bg-primary" style={{ height: "100%" }} />
                </div>
              </div>
            )}
            <div>
              {subtitle && (
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{subtitle}</p>
              )}
              <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                {title}
              </h1>
            </div>
          </div>
          {actions && (
            <div className="flex flex-1 items-center justify-end gap-3 sm:justify-end">
              {actions}
            </div>
          )}
        </div>
      </header>

      <main className={cn("space-y-6", className)}>{children}</main>
    </div>
  </div>
);

export default AppLayout;
