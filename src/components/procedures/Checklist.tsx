import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChecklistProps {
  items: string[];
  numbered?: boolean;
  progress: (done: number, total: number) => string;
  clear: string;
}

/** A tick-as-you-go list with a progress bar. State lives only in memory. */
const Checklist = ({ items, numbered, progress, clear }: ChecklistProps) => {
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const pct = items.length ? (done.size / items.length) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={done.size} aria-label={progress(done.size, items.length)}>
          <div className="h-full rounded-full bg-medical-green transition-[width]" style={{ width: `${pct}%` }} />
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{progress(done.size, items.length)}</span>
        {done.size > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setDone(new Set())}>
            {clear}
          </Button>
        )}
      </div>
      <ol className="space-y-2">
        {items.map((item, i) => {
          const on = done.has(i);
          return (
            <li key={item}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(i)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border p-3 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "border-medical-green/40 bg-medical-green/5" : "hover:bg-secondary/60",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums",
                    on ? "border-medical-green bg-medical-green text-white" : numbered ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                  )}
                >
                  {on ? <Check size={13} strokeWidth={3} /> : numbered ? i + 1 : null}
                </span>
                <span dir="ltr" className={cn("min-w-0 flex-1 text-start", on && "text-muted-foreground line-through decoration-muted-foreground/40")}>
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Checklist;
