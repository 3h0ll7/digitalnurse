import { cn } from "@/lib/utils";
import { GLASS, type GlassKey } from "./glass";

interface GlassIconProps {
  name: GlassKey;
  size?: number;
  active?: boolean;
  className?: string;
}

/** Rounded "liquid glass" tile: colour gradient, frosted rim, top sheen and a soft coloured glow. */
const GlassIcon = ({ name, size = 44, active, className }: GlassIconProps) => {
  const { icon: Icon, from, to } = GLASS[name];
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden transition-transform duration-200 motion-reduce:transition-none", active && "scale-110", className)}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`,
        boxShadow: `0 ${size * 0.16}px ${size * 0.36}px -${size * 0.14}px ${to}, inset 0 0 0 1px rgba(255,255,255,.55), inset 0 -${size * 0.08}px ${size * 0.2}px rgba(255,255,255,.18)`,
      }}
    >
      {/* Top sheen */}
      <span
        className="pointer-events-none absolute inset-x-[10%] top-[6%] h-[42%] rounded-[40%]"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,0))" }}
      />
      <Icon size={size * 0.5} strokeWidth={2.2} color="#fff" className="relative drop-shadow-[0_1px_1px_rgba(0,0,0,.18)]" />
    </span>
  );
};

export default GlassIcon;
