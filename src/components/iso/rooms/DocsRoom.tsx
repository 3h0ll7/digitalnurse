import { IsoBox, WallClock } from "../primitives";
import { Nurse } from "../people";
import { planeY } from "../iso";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const DocsRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  return (
    <RoomBase {...props}>
      <WallClock y={4.4} z={3.4} origin={origin} />
      {/* chart board on the back wall */}
      <g transform={planeY(0.8, 0.03, 3.7, origin)}>
        <rect width={60} height={38} rx={3} fill="var(--iso-c5)" stroke="var(--iso-c5x)" />
        {[8, 16, 24, 32].map((y) => (
          <path key={y} d={`M8 ${y} h${y % 16 ? 30 : 44}`} stroke="var(--iso-ink)" strokeWidth={1.4} opacity={0.35} />
        ))}
      </g>
      {/* printer cabinet */}
      <IsoBox x={4.4} y={0.2} w={1.2} d={1.0} h={1.4} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={4.55} y={0.35} z={1.4} w={0.9} d={0.7} h={0.4} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      {/* desk with charts */}
      <IsoBox x={1.0} y={2.2} w={3.2} d={1.2} h={1.4} top="--iso-shelf-top" front="--iso-c3" side="--iso-c3s" origin={origin} />
      <IsoBox x={1.4} y={2.4} z={1.4} w={0.8} d={0.6} h={0.12} top="--iso-clipboard" front="--iso-c4s" side="--iso-c4x" origin={origin} />
      <IsoBox x={1.5} y={2.45} z={1.52} w={0.6} d={0.5} h={0.02} top="--iso-c5" front="--iso-c5" side="--iso-c5" origin={origin} />
      <IsoBox x={2.6} y={2.5} z={1.4} w={0.7} d={0.5} h={0.4} top="--iso-c1" front="--iso-c1s" side="--iso-c1x" origin={origin} />
      {!compact && <Nurse at={P(3.6, 4.4)} flip />}
    </RoomBase>
  );
};

export default DocsRoom;
