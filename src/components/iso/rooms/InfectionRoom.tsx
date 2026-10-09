import { IsoBox } from "../primitives";
import { Nurse } from "../people";
import { planeY } from "../iso";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const InfectionRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  const tap = P(1.5, 0.3, 2.3);
  return (
    <RoomBase {...props}>
      {/* isolation sign */}
      <g transform={planeY(3.0, 0.03, 3.9, origin)}>
        <rect width={46} height={30} rx={4} fill="var(--iso-c3)" />
        <circle cx={14} cy={15} r={8} fill="none" stroke="var(--iso-ink)" strokeWidth={2} />
        <path d="M8 21 L20 9" stroke="var(--iso-ink)" strokeWidth={2} />
        <path d="M26 11 h14 M26 17 h10 M26 23 h12" stroke="var(--iso-ink)" strokeWidth={1.6} opacity={0.6} />
      </g>
      {/* sink */}
      <IsoBox x={0.7} y={0} w={1.6} d={1.0} h={1.6} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={0.9} y={0.15} z={1.45} w={1.2} d={0.7} h={0.15} top="--iso-glass" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <path d={`M${tap[0]} ${tap[1]} v-12 h8`} fill="none" stroke="var(--iso-metal-s)" strokeWidth={2.5} strokeLinecap="round" />
      {/* PPE cart: gloves, masks, gowns */}
      <IsoBox x={4.3} y={0.5} w={1.2} d={1.0} h={1.6} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      <IsoBox x={4.4} y={0.6} z={1.6} w={0.45} d={0.4} h={0.3} top="--iso-c2" front="--iso-c2s" side="--iso-c2x" origin={origin} />
      <IsoBox x={4.95} y={0.6} z={1.6} w={0.45} d={0.4} h={0.3} top="--iso-gown" front="--iso-gown-d" side="--iso-gown-d" origin={origin} />
      <IsoBox x={4.2} y={3.8} w={0.8} d={0.8} h={1.0} top="--iso-c3" front="--iso-c3s" side="--iso-c3x" origin={origin} />
      {!compact && <Nurse at={P(2.4, 2.4)} pose="reach" />}
    </RoomBase>
  );
};

export default InfectionRoom;
