import { cn } from "@/lib/utils";
import { positionPct } from "./scale";

export interface BarRow {
  key: string;
  label: string;
  value: number;
  /** Text shown instead of the raw value (e.g. "1026 ↑" for a clipped bar). */
  display?: string;
  color?: string;
}

interface BarListProps {
  rows: BarRow[];
  ariaLabel: string;
  /** Scale maximum; defaults to the largest value. */
  max?: number;
  unit?: string;
  /** Shaded reference zone, e.g. the plasma osmolality band. */
  reference?: { from: number; to: number; label: string };
  className?: string;
}

/** Horizontal bars, each labelled with its value; values past `max` are clipped and marked. */
const BarList = ({ rows, ariaLabel, max, unit, reference, className }: BarListProps) => {
  const scaleMax = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <figure className={cn("space-y-2", className)}>
      <ul className="space-y-1.5" aria-hidden="true">
        {rows.map((r) => {
          const clipped = r.value > scaleMax;
          return (
            <li key={r.key} className="grid grid-cols-[minmax(4.5rem,8rem)_1fr_auto] items-center gap-2 text-xs">
              <span className="truncate text-muted-foreground" title={r.label}>{r.label}</span>
              <span dir="ltr" className="relative h-3 rounded-e-full bg-muted/60" title={`${r.label}: ${r.display ?? r.value}${unit ? ` ${unit}` : ""}`}>
                {reference && (
                  <span
                    className="absolute inset-y-[-3px] border-x border-dashed border-foreground/40 bg-medical-green/15"
                    style={{ left: `${positionPct(reference.from, 0, scaleMax)}%`, width: `${positionPct(reference.to, 0, scaleMax) - positionPct(reference.from, 0, scaleMax)}%` }}
                  />
                )}
                <span
                  className={cn("absolute inset-y-0 start-0 rounded-e-full", clipped && "rounded-e-none")}
                  style={{ width: `${positionPct(r.value, 0, scaleMax)}%`, background: r.color ?? "var(--viz-1)" }}
                />
              </span>
              <span className="min-w-[3rem] text-end font-semibold tabular-nums text-foreground">{r.display ?? r.value}</span>
            </li>
          );
        })}
      </ul>
      {reference && (
        <figcaption className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-2.5 w-4 rounded-sm border border-dashed border-foreground/40 bg-medical-green/15" aria-hidden="true" />
          {reference.label}
        </figcaption>
      )}
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <th scope="row">{r.label}</th>
              <td>{r.value}{unit ? ` ${unit}` : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

export default BarList;
