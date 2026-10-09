import { Suspense, lazy, type ComponentType } from "react";
import type { SceneKey } from "@/lib/sections";
import { sceneSize } from "./iso";
import { IsoSvg } from "./primitives";
import { HOSPITAL_ROOMS } from "./rooms";
import { ROOM, type RoomProps } from "./rooms/kit";

/** Hospital rooms already ship with Home; only the other section rooms load on demand. */
const ROOM_LOADERS: Partial<Record<SceneKey, () => Promise<{ default: ComponentType<RoomProps> }>>> = {
  docs: () => import("./rooms/DocsRoom"),
  infection: () => import("./rooms/InfectionRoom"),
  atlas: () => import("./rooms/AtlasRoom"),
  pathways: () => import("./rooms/PathwaysRoom"),
  pharma: () => import("./rooms/PharmaRoom"),
  terms: () => import("./rooms/TermsRoom"),
  mindmaps: () => import("./rooms/MindMapsRoom"),
};

const ROOMS: Partial<Record<SceneKey, ComponentType<RoomProps>>> = { ...HOSPITAL_ROOMS };
for (const [key, load] of Object.entries(ROOM_LOADERS) as [SceneKey, () => Promise<{ default: ComponentType<RoomProps> }>][]) {
  ROOMS[key] = lazy(load);
}

const { width, height, origin } = sceneSize(ROOM.w, ROOM.d, ROOM.h, 10);

interface SectionSceneProps {
  scene: SceneKey;
  className?: string;
}

/** One stand-alone room for a section header. Decorative: the page title already names it. */
const SectionScene = ({ scene, className }: SectionSceneProps) => {
  const Room = ROOMS[scene];
  if (!Room) return null;
  return (
    <div className={className} style={{ aspectRatio: `${Math.round(width)} / ${Math.round(height)}` }}>
      <Suspense fallback={null}>
        <IsoSvg width={width} height={height} decorative>
          <Room origin={origin} />
        </IsoSvg>
      </Suspense>
    </div>
  );
};

export default SectionScene;
