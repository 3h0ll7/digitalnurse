import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "good" | "warn" | "critical";

const TONES: Record<Tone, string> = {
  default: "bg-secondary text-foreground",
  primary: "bg-primary/10 text-primary",
  good: "bg-medical-green/10 text-medical-green",
  warn: "bg-medical-yellow/10 text-medical-yellow",
  critical: "bg-medical-red/10 text-medical-red",
};

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: LucideIcon;
  tone?: Tone;
  className?: string;
}

const StatTile = ({ label, value, hint, icon: Icon, tone = "default", className }: StatTileProps) => (
  <div className={cn("flex min-w-0 items-center gap-3 rounded-2xl border bg-card p-3", className)}>
    {Icon && (
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", TONES[tone])}>
        <Icon size={18} aria-hidden="true" />
      </span>
    )}
    <div className="min-w-0">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <p dir="auto" className="text-lg font-semibold leading-tight tabular-nums text-foreground">{value}</p>
      {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  </div>
);

export default StatTile;
