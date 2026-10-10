import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import BandBar from "@/components/data/BandBar";
import { TONE_CLASS } from "@/data/assessments-text";
import { bandFor, type ScaleDef } from "@/lib/clinical/scores";
import { gaugeBands } from "./gauge";
import { cn } from "@/lib/utils";

interface ScoreResultProps {
  scale: ScaleDef;
  title: string;
  /** Score the bands read; null while the form is incomplete. */
  value: number | null;
  /** Full total when it differs from the band score. */
  total?: number;
  /** Highest possible band score; omitted for scales that run below zero. */
  max?: number;
  waiting: string;
  labels: { score: string; bandScore: string };
  flags?: string[];
  children?: ReactNode;
}

const ScoreResult = ({ scale, title, value, total, max, waiting, labels, flags = [], children }: ScoreResultProps) => {
  const band = value === null ? null : bandFor(scale.bands, value);
  const bands = gaugeBands(scale);
  const [lo, hi] = [bands[0]?.from ?? scale.range[0], bands[bands.length - 1]?.to ?? scale.range[1]];
  return (
    <section aria-live="polite" className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {value === null ? (
        <p role="status" className="rounded-2xl border border-dashed p-3 text-center text-sm text-muted-foreground">{waiting}</p>
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{total !== undefined && total !== value ? labels.bandScore : labels.score}</p>
              <p dir="ltr" className="text-3xl font-semibold tabular-nums">
                {value}
                {max !== undefined && <span className="text-sm font-normal text-muted-foreground"> / {max}</span>}
              </p>
            </div>
            {band && <span className={cn("rounded-full border px-3 py-1 text-sm font-semibold", TONE_CLASS[band.tone])}>{band.label}</span>}
          </div>
          {bands.length > 0 && <BandBar min={lo} max={hi} bands={bands} value={value} valueLabel={band?.label} ariaLabel={scale.short} ticks={scale.bands.map((b) => b.min)} />}
          {total !== undefined && total !== value && (
            <div className="space-y-1 text-xs text-muted-foreground">
              <p dir="ltr" className="text-start">
                {scale.short}: <span className="font-semibold tabular-nums text-foreground">{total}</span>
              </p>
              {scale.bandBasis && <p dir="ltr" className="text-start">{scale.bandBasis}</p>}
            </div>
          )}
          {band?.action && <p dir="ltr" className="text-start text-sm">{band.action}</p>}
        </>
      )}
      {flags.map((flag) => (
        <p key={flag} role="alert" dir="ltr" className="flex items-start gap-2 rounded-2xl border border-medical-red/40 bg-medical-red/10 p-3 text-start text-sm font-medium text-medical-red">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {flag}
        </p>
      ))}
      {children}
    </section>
  );
};

export default ScoreResult;
