import { cn } from "@/lib/utils";

export interface ChipOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: ChipOption[];
  value: string | string[];
  onChange: (value: string) => void;
  ariaLabel: string;
  /** Drop options whose count is 0 so a filter can never lead to an empty list. */
  hideEmpty?: boolean;
  className?: string;
}

const FilterChips = ({ options, value, onChange, ariaLabel, hideEmpty, className }: FilterChipsProps) => {
  const selected = Array.isArray(value) ? value : [value];
  const visible = hideEmpty ? options.filter((o) => o.count === undefined || o.count > 0) : options;
  return (
    <div role="group" aria-label={ariaLabel} className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              on ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-secondary",
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cn("rounded-full px-1.5 text-[10px] tabular-nums", on ? "bg-primary-foreground/20" : "bg-secondary text-muted-foreground")}>
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
