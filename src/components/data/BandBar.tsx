import { cn } from "@/lib/utils";
import { positionPct } from "./scale";

export type BandTone = "critical" | "warn" | "normal";

export interface Band {
  from: number;
  to: number;
  tone: BandTone;
  label?: string;
}

const FILL: Record<BandTone, string> = {
  critical: "bg-medical-red/30",
  warn: "bg-medical-yellow/35",
  normal: "bg-medical-green/35",
};

interface BandBarProps {
  min: number;
  max: number;
  bands: Band[];
  value?: number | null;
  unit?: string;
  /** Words for the value's band, e.g. "Normal"; read with the value. */
  valueLabel?: string;
  ariaLabel: string;
  ticks?: number[];
  format?: (n: number) => string;
  className?: string;
}

/** A labelled range gauge: coloured zones on a number line with an optional value marker. Always left-to-right. */
const BandBar = ({ min, max, bands, value = null, unit, valueLabel, ariaLabel, ticks, format = String, className }: BandBarProps) => {
  const hasValue = value !== null && Number.isFinite(value);
  const offscale = hasValue && (value < min || value > max);
  const description = hasValue ? `${ariaLabel}: ${format(value)}${unit ? ` ${unit}` : ""}${valueLabel ? ` — ${valueLabel}` : ""}` : ariaLabel;
  const tickValues = (ticks ?? [...new Set(bands.flatMap((b) => [b.from, b.to]))])
    .sort((a, b) => a - b)
    .filter((t, i, all) => i === 0 || positionPct(t, min, max) - positionPct(all[i - 1], min, max) >= 8);

  return (
    <div dir="ltr" role="img" aria-label={description} className={cn("w-full", className)}>
      <div className="relative h-3 overflow-hidden rounded-full bg-muted">
        {bands.map((b) => (
          <div
            key={`${b.from}-${b.to}`}
            title={b.label}
            className={cn("absolute inset-y-0 border-x border-card", FILL[b.tone])}
            style={{ left: `${positionPct(b.from, min, max)}%`, width: `${positionPct(b.to, min, max) - positionPct(b.from, min, max)}%` }}
          />
        ))}
      </div>
      <div className="relative h-5">
        {hasValue && (
          <span
            data-marker=""
            {...(offscale ? { "data-offscale": "" } : {})}
            className="absolute -top-[18px] flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${positionPct(value, min, max)}%` }}
          >
            <span className="h-5 w-1 rounded-full bg-foreground ring-2 ring-card" />
          </span>
        )}
        {tickValues.map((t) => (
          <span
            key={t}
            className="absolute top-0.5 -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground"
            style={{ left: `${positionPct(t, min, max)}%` }}
          >
            {format(t)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BandBar;
