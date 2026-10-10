import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const INK = "#3b3355";
const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Wraps a drawing in a die-cut sticker: thick white border plus a soft shadow (SVG filter, no images). */
const Sticker = ({ children, label, className, tilt = 0 }: { children: ReactNode; label: string; className?: string; tilt?: number }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={label} className={cn("h-16 w-16 shrink-0 sm:h-20 sm:w-20", className)} style={{ transform: `rotate(${tilt}deg)`, overflow: "visible" }}>
      <defs>
        <filter id={`s${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="grown" />
          <feFlood floodColor="#fff" />
          <feComposite in2="grown" operator="in" result="rim" />
          <feGaussianBlur in="grown" stdDeviation="2.5" result="blur" />
          <feOffset in="blur" dy="2.5" result="drop" />
          <feFlood floodColor="#1e2340" floodOpacity="0.22" />
          <feComposite in2="drop" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="rim" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#s${id})`}>{children}</g>
    </svg>
  );
};

export const HeartSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Heart" {...p}>
    <path d="M50 86 C20 66 10 48 14 34 C18 20 36 16 50 30 C64 16 82 20 86 34 C90 48 80 66 50 86Z" fill="#ff9fb8" {...line} />
    <path d="M24 50 H40 L45 40 L52 62 L58 46 H76" fill="none" stroke="#fff" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
  </Sticker>
);

export const StethoscopeSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Stethoscope" {...p}>
    <path d="M28 14 V40 C28 56 44 62 52 62 C60 62 72 56 72 40 V14" fill="none" stroke="#b9a6e8" strokeWidth={7} strokeLinecap="round" />
    <path d="M52 62 V72 C52 82 62 86 70 80" fill="none" stroke="#b9a6e8" strokeWidth={7} strokeLinecap="round" />
    <circle cx="74" cy="76" r="11" fill="#d8dbe6" {...line} />
    <circle cx="74" cy="76" r="5" fill="#8e94a8" />
    <circle cx="28" cy="12" r="5" fill="#8e94a8" />
    <circle cx="72" cy="12" r="5" fill="#8e94a8" />
  </Sticker>
);

export const IvBagSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="IV bag" {...p}>
    <rect x="24" y="10" width="52" height="62" rx="12" fill="#bfe3ff" {...line} />
    <rect x="32" y="22" width="36" height="18" rx="4" fill="#fff" stroke={INK} strokeWidth={1.6} />
    <path d="M36 28 H62 M36 34 H54" stroke="#5b8fd8" strokeWidth={2.4} strokeLinecap="round" />
    <path d="M44 72 V82 H56 V72" fill="#9fd0f5" {...line} />
    <path d="M50 82 V94" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
    <path d="M30 56 Q50 50 70 56 V64 Q70 70 64 70 H36 Q30 70 30 64Z" fill="#7cc1f2" opacity={0.8} />
  </Sticker>
);

export const CapsuleSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Capsules" {...p}>
    <g transform="rotate(-35 40 44)">
      <rect x="14" y="32" width="52" height="24" rx="12" fill="#fff" {...line} />
      <path d="M40 32 H54 A12 12 0 0 1 54 56 H40Z" fill="#ef5b6f" {...line} />
    </g>
    <g transform="rotate(25 62 70)">
      <rect x="36" y="58" width="52" height="24" rx="12" fill="#fff" {...line} />
      <path d="M62 58 H76 A12 12 0 0 1 76 82 H62Z" fill="#ef5b6f" {...line} />
    </g>
  </Sticker>
);

export const BandageSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Bandage" {...p}>
    <g transform="rotate(-30 50 50)">
      <rect x="8" y="36" width="84" height="28" rx="14" fill="#f2c9a0" {...line} />
      <rect x="36" y="36" width="28" height="28" fill="#f7dcc0" stroke={INK} strokeWidth={1.6} />
      {[16, 24, 72, 80].map((x) => (
        <circle key={x} cx={x} cy={50} r={1.8} fill="#c9976a" />
      ))}
      <path d="M50 58 C42 52 42 46 46 44 C48 43 50 45 50 46 C50 45 52 43 54 44 C58 46 58 52 50 58Z" fill="#ff6f91" />
    </g>
  </Sticker>
);

export const ThermometerSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Thermometer" {...p}>
    <g transform="rotate(35 50 50)">
      <rect x="40" y="6" width="20" height="70" rx="10" fill="#fff" {...line} />
      <rect x="40" y="48" width="20" height="40" rx="10" fill="#ff9fb8" {...line} />
      <rect x="44" y="20" width="12" height="16" rx="2" fill="#e8eef8" stroke={INK} strokeWidth={1.4} />
      <path d="M50 88 V96" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  </Sticker>
);

export const NurseCapSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Nurse cap" {...p}>
    <path d="M10 64 L22 30 H78 L90 64 Z" fill="#fff" {...line} />
    <path d="M10 64 H90" stroke="#ef5b6f" strokeWidth={3} />
    <rect x="44" y="36" width="12" height="22" rx="1.5" fill="#ef4444" />
    <rect x="39" y="41" width="22" height="12" rx="1.5" fill="#ef4444" />
  </Sticker>
);

export const SyringeSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Syringe" {...p}>
    <g transform="rotate(-40 50 50)">
      <rect x="40" y="18" width="20" height="54" rx="3" fill="#e7f6ff" {...line} />
      <rect x="42" y="44" width="16" height="26" fill="#9fd8ff" />
      <path d="M44 28 H52 M44 36 H52 M44 44 H52" stroke={INK} strokeWidth={1.4} />
      <path d="M34 18 H66 M50 18 V8 M42 8 H58" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <path d="M46 72 H54 L50 92Z" fill="#cfd5e3" {...line} />
    </g>
  </Sticker>
);

export const ScrubsSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Scrubs" {...p}>
    <path d="M30 14 L16 26 L22 44 L30 40 V88 H70 V40 L78 44 L84 26 L70 14 L58 14 L50 30 L42 14 Z" fill="#a8ecdf" {...line} />
    <rect x="56" y="54" width="10" height="10" rx="2" fill="#8fdccc" stroke={INK} strokeWidth={1.4} />
    <path d="M58 52 V46" stroke="#ef5b6f" strokeWidth={2.4} strokeLinecap="round" />
  </Sticker>
);

export const PillBottleSticker = (p: { tilt?: number; className?: string }) => (
  <Sticker label="Pill bottle" {...p}>
    <rect x="28" y="10" width="44" height="14" rx="4" fill="#fff" {...line} />
    <rect x="24" y="24" width="52" height="66" rx="10" fill="#ffd3e0" {...line} />
    <rect x="30" y="40" width="40" height="26" rx="4" fill="#fff" stroke={INK} strokeWidth={1.6} />
    <rect x="46" y="44" width="8" height="18" rx="1.5" fill="#ff6f91" />
    <rect x="41" y="49" width="18" height="8" rx="1.5" fill="#ff6f91" />
  </Sticker>
);

const ALL = [HeartSticker, StethoscopeSticker, IvBagSticker, CapsuleSticker, NurseCapSticker, BandageSticker, ThermometerSticker, SyringeSticker, ScrubsSticker, PillBottleSticker];
const TILTS = [-8, 6, -4, 10, -6, 4, -10, 8, -3, 5];

/** A playful, decorative row of stickers. */
export const StickerStrip = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn("flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-1", className)}>
    {ALL.map((S, i) => (
      <S key={i} tilt={TILTS[i]} />
    ))}
  </div>
);
