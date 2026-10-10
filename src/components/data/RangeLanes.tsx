import { cn } from "@/lib/utils";
import { positionPct } from "./scale";

export interface Lane {
  key: string;
  label: string;
  min: number | null;
  max: number | null;
  color?: string;
}

interface RangeLanesProps {
  rows: Lane[];
  domain: [number, number];
  ticks: number[];
  unit: string;
  ariaLabel: string;
  reference?: { from: number; to: number; label: string };
  className?: string;
}

/** Floating min–max bars on one shared axis; open ends fade out to the edge of the scale. */
const RangeLanes = ({ rows, domain, ticks, unit, ariaLabel, reference, className }: RangeLanesProps) => {
  const [lo, hi] = domain;
  // Drop ticks that would print on top of the previous one.
  const visibleTicks = [...ticks].sort((a, b) => a - b).filter((t, i, all) => i === 0 || positionPct(t, lo, hi) - positionPct(all[i - 1], lo, hi) >= 8);
  return (
    <figure className={cn("space-y-1.5", className)}>
      <ul className="space-y-1" aria-hidden="true">
        {rows.map((r) => {
          const start = positionPct(r.min ?? lo, lo, hi);
          const end = positionPct(r.max ?? hi, lo, hi);
          const fade = r.min === null ? "to left" : r.max === null ? "to right" : null;
          const color = r.color ?? "var(--viz-1)";
          return (
            <li key={r.key} className="grid grid-cols-[minmax(5rem,9rem)_1fr] items-center gap-2 text-xs">
              <span className="truncate text-muted-foreground" title={r.label}>{r.label}</span>
              <span dir="ltr" className="relative h-2.5" title={`${r.label}: ${r.min ?? "<"}–${r.max ?? ">"} ${unit}`}>
                {reference && (
                  <span
                    className="absolute inset-y-[-4px] bg-medical-green/15"
                    style={{ left: `${positionPct(reference.from, lo, hi)}%`, width: `${positionPct(reference.to, lo, hi) - positionPct(reference.from, lo, hi)}%` }}
                  />
                )}
                <span
                  className="absolute inset-y-0 rounded-full"
                  style={{
                    left: `${start}%`,
                    width: `${Math.max(end - start, 1)}%`,
                    background: fade ? `linear-gradient(${fade}, ${color} 60%, transparent)` : color,
                  }}
                />
              </span>
            </li>
          );
        })}
      </ul>
      <div className="grid grid-cols-[minmax(5rem,9rem)_1fr] gap-2" aria-hidden="true">
        <span />
        <span dir="ltr" className="relative h-4 border-t border-border">
          {visibleTicks.map((t) => (
            <span key={t} className="absolute top-0.5 -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground" style={{ left: `${positionPct(t, lo, hi)}%` }}>
              {t}
            </span>
          ))}
        </span>
      </div>
      {reference && (
        <figcaption className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-2.5 w-4 rounded-sm bg-medical-green/15" aria-hidden="true" />
          {reference.label} · {unit}
        </figcaption>
      )}
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <th scope="row">{r.label}</th>
              <td>{r.min ?? "—"}–{r.max ?? "—"} {unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

export default RangeLanes;
