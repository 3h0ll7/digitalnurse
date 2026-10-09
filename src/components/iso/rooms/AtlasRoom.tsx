import { IsoBox } from "../primitives";
import { Doctor } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

/** Anatomy model: a skeleton on a stand. */
const Skeleton = ({ at }: { at: [number, number] }) => (
  <g transform={`translate(${at[0]},${at[1]})`} stroke="var(--iso-c5x)" strokeLinecap="round" fill="none">
    <path d="M0 0 V-6 M-10 0 H10" strokeWidth={2.5} stroke="var(--iso-metal-s)" />
    <path d="M0 -6 V-60" strokeWidth={2} />
    <path d="M-5 -6 L-6 -32 M5 -6 L6 -32" strokeWidth={3} stroke="var(--iso-c5)" />
    <ellipse cx={0} cy={-34} rx={8} ry={4} fill="var(--iso-c5)" />
    {[-44, -48, -52, -56].map((y) => (
      <path key={y} d={`M-8 ${y} Q0 ${y + 3} 8 ${y}`} strokeWidth={2} stroke="var(--iso-c5)" />
    ))}
    <path d="M-9 -60 L-12 -38 M9 -60 L12 -38" strokeWidth={2.5} stroke="var(--iso-c5)" />
    <circle cx={0} cy={-68} r={7} fill="var(--iso-c5)" />
    <circle cx={-2.5} cy={-68} r={1.2} fill="var(--iso-ink)" stroke="none" />
    <circle cx={2.5} cy={-68} r={1.2} fill="var(--iso-ink)" stroke="none" />
  </g>
);

const AtlasRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  return (
    <RoomBase {...props}>
      {/* anatomy posters */}
      <IsoBox x={0.6} y={0} z={1.8} w={1.3} d={0.05} h={1.9} top="--iso-c5" front="--iso-c2" side="--iso-c2s" origin={origin} />
      <IsoBox x={2.2} y={0} z={1.8} w={1.3} d={0.05} h={1.9} top="--iso-c5" front="--iso-c1" side="--iso-c1s" origin={origin} />
      <Skeleton at={P(1.6, 2.0)} />
      {/* model on a table */}
      <IsoBox x={3.6} y={1.6} w={1.8} d={1.2} h={1.3} top="--iso-shelf-top" front="--iso-c4" side="--iso-c4s" origin={origin} />
      <IsoBox x={4.1} y={1.9} z={1.3} w={0.6} d={0.5} h={0.8} top="--iso-c2" front="--iso-c2s" side="--iso-c2x" origin={origin} />
      {!compact && <Doctor at={P(3.4, 4.2)} pose="reach" flip />}
    </RoomBase>
  );
};

export default AtlasRoom;
