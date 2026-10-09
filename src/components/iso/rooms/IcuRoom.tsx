import { IsoBox } from "../primitives";
import { Nurse } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const IcuRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  const [px, py] = P(1.6, 2.4, 1.45);
  const [pole0, pole1] = [P(4.3, 1.4, 0), P(4.3, 1.4, 3.3)];
  const bag = P(4.3, 1.4, 3.3);
  return (
    <RoomBase {...props}>
      {/* ventilator */}
      <IsoBox x={0.4} y={0.3} w={0.9} d={0.9} h={2.0} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={0.5} y={1.2} z={1.3} w={0.7} d={0.02} h={0.5} top="--iso-screen" front="--iso-screen" side="--iso-screen" origin={origin} />
      {/* ICU bed with rails */}
      <IsoBox x={1.2} y={1.4} w={3.0} d={2.0} h={0.9} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      <IsoBox x={1.2} y={1.4} z={0.9} w={3.0} d={2.0} h={0.3} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={1.3} y={1.7} z={1.2} w={0.8} d={1.4} h={0.25} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <circle cx={px} cy={py - 6} r={7} fill="var(--iso-skin-2)" />
      <path d={`M${px - 7} ${py - 8} q7 -8 14 0`} fill="var(--iso-hair)" />
      <IsoBox x={2.0} y={1.5} z={1.2} w={2.2} d={1.8} h={0.35} top="--iso-gown" front="--iso-gown-d" side="--iso-gown-d" origin={origin} />
      <IsoBox x={1.4} y={3.35} z={1.3} w={2.6} d={0.06} h={0.5} top="--iso-metal-s" front="--iso-metal" side="--iso-metal-s" origin={origin} />
      {/* IV pole */}
      <line x1={pole0[0]} y1={pole0[1]} x2={pole1[0]} y2={pole1[1]} stroke="var(--iso-metal-s)" strokeWidth={2} />
      <rect x={bag[0] - 5} y={bag[1]} width={10} height={14} rx={3} fill="var(--iso-glass)" stroke="var(--iso-metal-s)" />
      <path d={`M${bag[0]} ${bag[1] + 14} Q${bag[0] - 20} ${bag[1] + 40} ${px + 22} ${py + 6}`} fill="none" stroke="var(--iso-metal)" strokeWidth={1} />
      {!compact && <Nurse at={P(4.6, 3.9)} pose="reach" flip />}
      <IsoBox x={0.6} y={4.3} w={0.8} d={0.8} h={1.2} top="--iso-c2" front="--iso-c2s" side="--iso-c2x" origin={origin} />
    </RoomBase>
  );
};

export default IcuRoom;
