import { IsoBox } from "../primitives";
import { Doctor, Nurse } from "../people";
import { planeY } from "../iso";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const PathwaysRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  return (
    <RoomBase {...props}>
      {/* whiteboard with a cause → effect pathway */}
      <g transform={planeY(0.7, 0.03, 4.0, origin)}>
        <rect width={100} height={58} rx={4} fill="var(--iso-c5)" stroke="var(--iso-metal-s)" strokeWidth={2} />
        <rect x={8} y={10} width={22} height={12} rx={3} fill="var(--iso-c2)" />
        <rect x={42} y={10} width={22} height={12} rx={3} fill="var(--iso-c3)" />
        <rect x={72} y={34} width={22} height={12} rx={3} fill="var(--iso-c1)" />
        <rect x={24} y={36} width={22} height={12} rx={3} fill="var(--iso-c4)" />
        <path d="M30 16 H42 M64 16 Q78 16 82 34 M53 22 Q48 34 46 38" fill="none" stroke="var(--iso-ink)" strokeWidth={1.4} />
      </g>
      <IsoBox x={4.6} y={0.3} w={0.9} d={0.9} h={1.1} top="--iso-c3" front="--iso-c3s" side="--iso-c3x" origin={origin} />
      {!compact && <Doctor at={P(2.4, 2.6)} pose="reach" />}
      {!compact && <Nurse at={P(4.2, 4.0)} flip />}
    </RoomBase>
  );
};

export default PathwaysRoom;
