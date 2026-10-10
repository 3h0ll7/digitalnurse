import type { Band, BandTone } from "@/components/data/BandBar";
import type { ScaleDef, Tone } from "@/lib/clinical/scores";

const BAR_TONE: Record<Tone, BandTone> = { good: "normal", warn: "warn", serious: "critical", critical: "critical" };

/** Bands become cells around whole scores, so a one-value band such as RASS 0 still has width. */
export const gaugeBands = (scale: ScaleDef): Band[] =>
  scale.bands.map((b, i) => {
    const next = scale.bands[i + 1];
    const prev = scale.bands[i - 1];
    const upper = next ? (next.min - b.max) / 2 : 0.5;
    const lower = prev ? (b.min - prev.max) / 2 : 0.5;
    return { from: b.min - lower, to: b.max + upper, tone: BAR_TONE[b.tone], label: b.label };
  });
