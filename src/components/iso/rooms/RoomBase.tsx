import type { ReactNode } from "react";
import { RoomShell, type IsoColor } from "../primitives";
import { ROOM, type RoomProps } from "./kit";

interface RoomBaseProps extends RoomProps {
  wallX?: IsoColor;
  wallY?: IsoColor;
  floor?: IsoColor;
  children: ReactNode;
}

export const RoomBase = ({ origin, leftWallHeight, slab = true, wallX, wallY, floor, children }: RoomBaseProps) => (
  <g>
    <RoomShell w={ROOM.w} d={ROOM.d} h={ROOM.h} origin={origin} leftWallHeight={leftWallHeight} slab={slab} wallX={wallX} wallY={wallY} floor={floor} />
    {children}
  </g>
);
