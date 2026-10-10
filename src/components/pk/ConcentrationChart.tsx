import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { CurvePoint } from "@/lib/clinical/pk";

interface Props {
  points: CurvePoint[];
  tau: number;
  steadyPeak: number;
  steadyTrough: number;
  labels: { title: string; time: string; level: string; peak: string; trough: string; hour: string };
}

const PAD = { l: 40, r: 12, t: 12, b: 28 };

/** Relative concentration after repeated IV doses, with steady-state peak/trough guides and a hover read-out. */
const ConcentrationChart = ({ points, tau, steadyPeak, steadyTrough, labels }: Props) => {
  const [hover, setHover] = useState<CurvePoint | null>(null);
  // Draw in real pixels so labels keep their size on phones.
  const box = useRef<HTMLElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 500 ? 220 : 260;
  const tMax = points[points.length - 1]?.t ?? 1;
  const yMax = Math.max(steadyPeak * 1.1, 1.2);
  const x = (t: number) => PAD.l + (t / tMax) * (W - PAD.l - PAD.r);
  const y = (c: number) => PAD.t + (1 - c / yMax) * (H - PAD.t - PAD.b);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.c).toFixed(1)}`).join("");
  const maxTicks = Math.max(3, Math.floor(W / 70));
  const xTicks = Array.from({ length: Math.floor(tMax / tau) + 1 }, (_, i) => i * tau).filter((t, i, all) => all.length <= maxTicks || i % Math.ceil(all.length / maxTicks) === 0);
  const yTicks = [0, 0.5, 1, 1.5, 2, 3, 4].filter((v) => v <= yMax);
  const doseTimes = Array.from({ length: Math.floor(tMax / tau) + 1 }, (_, i) => i * tau);

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const t = ((e.clientX - box.left) / box.width) * tMax;
    let best = points[0];
    for (const p of points) if (Math.abs(p.t - t) < Math.abs(best.t - t)) best = p;
    setHover(best);
  };

  return (
    <figure ref={box} className="space-y-2">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block max-w-full" style={{ direction: "ltr" }} aria-hidden="true">
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="hsl(var(--border))" strokeWidth={1} />
            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="hsl(var(--muted-foreground))">{v}×</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - 8} textAnchor="middle" fontSize={11} fill="hsl(var(--muted-foreground))">{t} {labels.hour}</text>
        ))}
        <line x1={PAD.l} x2={W - PAD.r} y1={y(steadyPeak)} y2={y(steadyPeak)} stroke="hsl(var(--medical-red))" strokeDasharray="5 4" strokeWidth={1.5} />
        <line x1={PAD.l} x2={W - PAD.r} y1={y(steadyTrough)} y2={y(steadyTrough)} stroke="hsl(var(--medical-green))" strokeDasharray="5 4" strokeWidth={1.5} />
        <text x={W - PAD.r} y={y(steadyPeak) - 5} textAnchor="end" fontSize={11} fill="hsl(var(--foreground))">{labels.peak}</text>
        <text x={W - PAD.r} y={y(steadyTrough) + 14} textAnchor="end" fontSize={11} fill="hsl(var(--foreground))">{labels.trough}</text>
        <path d={path} fill="none" stroke="var(--viz-1)" strokeWidth={2} strokeLinejoin="round" />
        {doseTimes.map((t) => (
          <line key={t} x1={x(t)} x2={x(t)} y1={H - PAD.b} y2={H - PAD.b + 5} stroke="hsl(var(--muted-foreground))" />
        ))}
        {hover && (
          <g>
            <line x1={x(hover.t)} x2={x(hover.t)} y1={PAD.t} y2={H - PAD.b} stroke="hsl(var(--foreground))" strokeOpacity={0.35} />
            <circle cx={x(hover.t)} cy={y(hover.c)} r={5} fill="var(--viz-1)" stroke="hsl(var(--card))" strokeWidth={2} />
          </g>
        )}
        <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
      </svg>
      <p className="h-4 text-xs text-muted-foreground" aria-live="polite">
        {hover && (
          <span dir="ltr">
            {labels.time} {hover.t.toFixed(1)} {labels.hour} · {labels.level} {hover.c.toFixed(2)}×
          </span>
        )}
      </p>
      <table className="sr-only">
        <caption>{labels.title}</caption>
        <thead>
          <tr>
            <th>{labels.time}</th>
            <th>{labels.level}</th>
          </tr>
        </thead>
        <tbody>
          {doseTimes.map((t) => {
            // The last point at a dose time is just after the dose (the peak).
            const p = points.filter((q) => Math.abs(q.t - t) < 1e-6).pop();
            return p ? (
              <tr key={t}>
                <td>{t}</td>
                <td>{p.c.toFixed(2)}</td>
              </tr>
            ) : null;
          })}
        </tbody>
      </table>
    </figure>
  );
};

export default ConcentrationChart;
