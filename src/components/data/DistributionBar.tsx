import { cn } from "@/lib/utils";
import { shares } from "./scale";

export interface Segment {
  key: string;
  label: string;
  count: number;
  /** CSS colour, e.g. "var(--viz-1)". */
  color: string;
}

interface DistributionBarProps {
  segments: Segment[];
  ariaLabel: string;
  selected?: string | null;
  onSelect?: (key: string) => void;
  className?: string;
}

/** One 100% stacked bar with a counted legend; the legend doubles as a filter when onSelect is given. */
const DistributionBar = ({ segments, ariaLabel, selected = null, onSelect, className }: DistributionBarProps) => {
  const pct = shares(segments.map((s) => s.count));
  return (
    <figure className={cn("space-y-2", className)}>
      <div dir="ltr" role="img" aria-label={`${ariaLabel}: ${segments.map((s) => `${s.label} ${s.count}`).join(", ")}`} className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
        {segments.map((s, i) =>
          s.count > 0 ? (
            <div
              key={s.key}
              title={`${s.label}: ${s.count}`}
              className={cn("h-full first:rounded-s-full last:rounded-e-full transition-opacity", selected && selected !== s.key && "opacity-35")}
              style={{ width: `${pct[i]}%`, background: s.color }}
            />
          ) : null,
        )}
      </div>
      <figcaption className="flex flex-wrap gap-x-3 gap-y-1.5">
        {segments.map((s) => {
          const content = (
            <>
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
              <span>{s.label}</span>
              <span className="font-semibold tabular-nums text-foreground">{s.count}</span>
            </>
          );
          return onSelect ? (
            <button
              key={s.key}
              type="button"
              aria-pressed={selected === s.key}
              onClick={() => onSelect(s.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected === s.key && "bg-secondary text-foreground",
              )}
            >
              {content}
            </button>
          ) : (
            <span key={s.key} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              {content}
            </span>
          );
        })}
      </figcaption>
    </figure>
  );
};

export default DistributionBar;
