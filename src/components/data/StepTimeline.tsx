import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Step {
  title: string;
  body?: ReactNode;
  /** Short text in the circle; defaults to the step number. */
  marker?: string;
  tone?: "default" | "good" | "warn" | "critical";
}

const DOT: Record<NonNullable<Step["tone"]>, string> = {
  default: "bg-primary text-primary-foreground",
  good: "bg-medical-green text-white",
  warn: "bg-medical-yellow text-white",
  critical: "bg-medical-red text-white",
};

const StepTimeline = ({ steps, className }: { steps: Step[]; className?: string }) => (
  <ol className={cn("relative space-y-3", className)}>
    {steps.map((s, i) => (
      <li key={`${i}-${s.title}`} className="relative flex gap-3">
        {i < steps.length - 1 && <span className="absolute start-[13px] top-7 h-[calc(100%-12px)] w-0.5 bg-border" aria-hidden="true" />}
        <span className={cn("z-10 flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1 text-[11px] font-semibold tabular-nums", DOT[s.tone ?? "default"])}>
          {s.marker ?? i + 1}
        </span>
        <div className="min-w-0 pb-1">
          <p className="text-sm font-semibold text-foreground">{s.title}</p>
          {s.body && <div className="mt-0.5 text-sm text-muted-foreground">{s.body}</div>}
        </div>
      </li>
    ))}
  </ol>
);

export default StepTimeline;
