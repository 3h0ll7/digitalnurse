import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { SECTIONS, type AppSection, type SceneKey } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { project, pts, sceneSize, type Pt } from "./iso";
import { IsoBox, Plant, Poly } from "./primitives";
import { HOSPITAL_ROOMS } from "./rooms";
import { ROOM } from "./rooms/kit";

/** Floors from top to bottom; this is also the keyboard/reading order. */
const HOSPITAL_FLOORS: SceneKey[][] = [
  ["station", "library", "ai"],
  ["icu", "ecg", "iv"],
  ["pharmacy", "lab", "triage"],
];

const FLOOR_HEIGHT = 7;
const PARTITION_HEIGHT = 1.2;
const HIT_HEIGHT = 2.6;
const COLS = 3;
const W = ROOM.w * COLS;
const D = ROOM.d;
const TOP_Z = (HOSPITAL_FLOORS.length - 1) * FLOOR_HEIGHT;
const { width, height, origin } = sceneSize(W, D, TOP_Z + ROOM.h + 0.4, 18);
const FLASH_MS = 120;

interface PlacedRoom {
  section: AppSection;
  col: number;
  z: number;
  roomOrigin: Pt;
}

const placed: PlacedRoom[] = HOSPITAL_FLOORS.flatMap((floor, row) =>
  floor.map((key, col) => {
    const section = SECTIONS.find((s) => s.key === key);
    if (!section) throw new Error(`Unknown hospital room: ${key}`);
    const z = (HOSPITAL_FLOORS.length - 1 - row) * FLOOR_HEIGHT;
    return { section, col, z, roomOrigin: project(col * ROOM.w, 0, z, origin) };
  }),
);

/** Painter's order: lower floors first, then left to right. */
const drawOrder = [...placed].sort((a, b) => a.z - b.z || a.col - b.col);
const floorLevels = [...new Set(placed.map((p) => p.z))].sort((a, b) => a - b);

const hitArea = ({ col, z }: PlacedRoom): Pt[] => {
  const x0 = col * ROOM.w;
  const P = (x: number, y: number, dz: number) => project(x, y, z + dz, origin);
  return [P(x0, 0, HIT_HEIGHT), P(x0 + ROOM.w, 0, HIT_HEIGHT), P(x0 + ROOM.w, 0, 0), P(x0 + ROOM.w, D, 0), P(x0, D, 0)];
};

const labelAnchor = ({ col, z }: PlacedRoom) => {
  const [x, y] = project(col * ROOM.w + ROOM.w / 2, D, z, origin);
  return { left: `${(x / width) * 100}%`, top: `${(y / height) * 100}%` };
};

interface IsometricHospitalProps {
  onOpen: (section: AppSection) => void;
  className?: string;
}

const IsometricHospital = ({ onOpen, className }: IsometricHospitalProps) => {
  const { language, t } = usePreferences();
  const [active, setActive] = useState<SceneKey | null>(null);
  const [flash, setFlash] = useState<SceneKey | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const open = (section: AppSection) => {
    setFlash(section.key);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setFlash(null);
      onOpen(section);
    }, FLASH_MS);
  };

  const onKey = (event: KeyboardEvent<SVGGElement>, section: AppSection) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open(section);
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-[640px]", className)}>
      {/* Labels are positioned in percent of this box, so it must hold only the drawing. */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${Math.round(width)} ${Math.round(height)}`}
          style={{ direction: "ltr", display: "block", width: "100%", height: "auto" }}
          role="group"
          aria-label={language === "ar" ? "خريطة المستشفى" : "Hospital map"}
        >
          <g aria-hidden="true">
            <Poly
              points={[project(-1.5, -1, -0.7, origin), project(W + 1.5, -1, -0.7, origin), project(W + 1.5, D + 2.2, -0.7, origin), project(-1.5, D + 2.2, -0.7, origin)]}
              color="--iso-rug-in"
            />
            {floorLevels.map((z) => (
              <g key={z}>
                <IsoBox x={0} y={0} z={z - 0.7} w={W} d={D} h={0.7} top="--iso-floor" front="--iso-slab-l" side="--iso-slab-r" origin={origin} />
                {drawOrder
                  .filter((room) => room.z === z)
                  .map((room) => {
                    const Room = HOSPITAL_ROOMS[room.section.key];
                    if (!Room) return null;
                    return (
                      <g
                        key={room.section.key}
                        className={cn(
                          "iso-room transition-[transform,filter] duration-200 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
                          active === room.section.key && "-translate-y-1.5 motion-reduce:translate-y-0 [filter:drop-shadow(0_10px_10px_rgba(30,35,64,.22))]",
                          flash === room.section.key && "brightness-110",
                        )}
                      >
                        <Room origin={room.roomOrigin} slab={false} leftWallHeight={room.col === 0 ? ROOM.h : PARTITION_HEIGHT} />
                      </g>
                    );
                  })}
              </g>
            ))}
            <Plant at={project(-0.8, D + 1.2, -0.7, origin)} scale={0.8} />
            <Plant at={project(W + 0.6, D + 1.4, -0.7, origin)} scale={0.9} />
          </g>

          {placed.map((room) => (
            <g
              key={room.section.key}
              role="link"
              tabIndex={0}
              aria-label={room.section.title[language]}
              className="iso-hit cursor-pointer outline-none"
              onMouseEnter={() => setActive(room.section.key)}
              onMouseLeave={() => setActive((k) => (k === room.section.key ? null : k))}
              onFocus={() => setActive(room.section.key)}
              onBlur={() => setActive((k) => (k === room.section.key ? null : k))}
              onClick={() => open(room.section)}
              onKeyDown={(e) => onKey(e, room.section)}
            >
              <polygon points={pts(hitArea(room))} fill="transparent" className="iso-hit-shape" />
            </g>
          ))}
        </svg>

        {placed.map((room) => (
          <span
            key={room.section.key}
            aria-hidden="true"
            style={labelAnchor(room)}
            className={cn(
              "pointer-events-none absolute -translate-x-1/2 -translate-y-[85%] whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold shadow-sm transition-colors sm:text-xs",
              active === room.section.key ? "border-primary bg-primary text-primary-foreground" : "bg-card/95 text-foreground",
            )}
          >
            {room.section.title[language]}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">{t.hospitalHint}</p>
    </div>
  );
};

export default IsometricHospital;
