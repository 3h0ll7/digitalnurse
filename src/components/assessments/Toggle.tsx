import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** A labelled on/off button styled like the scale options. */
const Toggle = ({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={on}
    onClick={() => onChange(!on)}
    className={cn(
      "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      on ? "border-primary bg-primary/10" : "hover:bg-secondary/60",
    )}
  >
    <span aria-hidden="true" className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}>
      {on && <Check size={12} strokeWidth={3} />}
    </span>
    <span className="min-w-0 flex-1">{label}</span>
  </button>
);

export default Toggle;
