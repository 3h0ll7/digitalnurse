import type { JSX } from "react";
import { project, type Pt } from "../iso";

/** Every room shares one footprint so rooms can sit side by side in the hospital. */
export const ROOM = { w: 6, d: 6, h: 4.5 } as const;

export interface RoomProps {
  /** Screen point of the room's local (0, 0, 0). */
  origin: Pt;
  /** Hide people (icon-sized rendering). */
  compact?: boolean;
  /** Height of the left wall; lower inside the hospital so neighbours stay visible. */
  leftWallHeight?: number;
  /** Stand-alone rooms sit on a slab; rooms inside the hospital do not. */
  slab?: boolean;
}

export type RoomComponent = (props: RoomProps) => JSX.Element;

export const pointFn = (origin: Pt) => (x: number, y: number, z = 0): Pt => project(x, y, z, origin);
