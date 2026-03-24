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
}

const AppLayout = ({
  title,
  subtitle,
  actions,
  children,
  onBack,
  className,
}: AppLayoutProps) => {
  const { t } = usePreferences();

  return (
    <div className="min-h-screen bg-muted/20 pb-28">
      <header className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground px-4 py-6 shadow-lg">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="mt-1 rounded-full border border-primary-foreground/30 p-2 text-primary-foreground transition-opacity hover:opacity-80"
              aria-label={t.goBack}
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="flex-1">
            {subtitle && (
              <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
                {subtitle}
              </p>
            )}
            <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </header>

      <main className={cn("p-4 space-y-6", className)}>{children}</main>
    </div>
  );
};

export default AppLayout;
