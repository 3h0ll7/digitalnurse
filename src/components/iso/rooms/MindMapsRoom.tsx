import { IsoBox } from "../primitives";
import { Nurse } from "../people";
import { planeY } from "../iso";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const NOTES: [number, number, string][] = [
  [10, 10, "--iso-c3"], [52, 6, "--iso-c2"], [88, 18, "--iso-c1"], [30, 40, "--iso-c4"], [72, 44, "--iso-c5"],
];

const MindMapsRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  return (
    <RoomBase {...props}>
      {/* corkboard with notes joined by string */}
      <g transform={planeY(0.6, 0.03, 4.0, origin)}>
        <rect width={116} height={66} rx={4} fill="var(--iso-c4s)" />
        <path d="M18 18 L60 14 L96 26 M60 14 L38 48 L80 52 M96 26 L80 52" fill="none" stroke="#C8324B" strokeWidth={1.2} />
        {NOTES.map(([x, y, c]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={16} height={14} rx={1.5} fill={`var(${c})`} />
        ))}
      </g>
      <IsoBox x={2.6} y={2.4} w={2.2} d={1.4} h={1.3} top="--iso-c3" front="--iso-c3s" side="--iso-c3x" origin={origin} />
      <IsoBox x={3.0} y={2.7} z={1.3} w={0.5} d={0.4} h={0.05} top="--iso-c2" front="--iso-c2s" side="--iso-c2x" origin={origin} />
      <IsoBox x={3.8} y={2.9} z={1.3} w={0.5} d={0.4} h={0.05} top="--iso-c1" front="--iso-c1s" side="--iso-c1x" origin={origin} />
      {!compact && <Nurse at={P(1.8, 3.4)} pose="reach" />}
    </RoomBase>
  );
};

export default MindMapsRoom;
