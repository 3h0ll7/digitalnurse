import { IsoBox } from "../primitives";
import { Nurse, Patient } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const BAGS = ["--iso-glass", "--iso-c3", "--iso-glass", "--iso-c2"] as const;

const IvRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  const pole = [P(3.2, 2.0, 0), P(3.2, 2.0, 3.3)];
  return (
    <RoomBase {...props}>
      {/* wall rack of IV bags */}
      <IsoBox x={0.6} y={0} z={2.6} w={3.0} d={0.5} h={0.12} top="--iso-shelf-top" front="--iso-shelf-fy" side="--iso-shelf-fx" origin={origin} />
      {BAGS.map((c, i) => {
        const [x, y] = P(0.95 + i * 0.7, 0.25, 2.72);
        return <rect key={i} x={x - 6} y={y - 18} width={12} height={18} rx={4} fill={`var(${c})`} stroke="var(--iso-metal-s)" strokeWidth={0.8} />;
      })}
      {/* recliner */}
      <IsoBox x={1.0} y={2.1} w={1.6} d={1.5} h={0.9} top="--iso-c4" front="--iso-c4s" side="--iso-c4x" origin={origin} />
      <IsoBox x={1.0} y={1.8} w={1.6} d={0.35} h={2.1} top="--iso-c4" front="--iso-c4s" side="--iso-c4x" origin={origin} />
      <line x1={pole[0][0]} y1={pole[0][1]} x2={pole[1][0]} y2={pole[1][1]} stroke="var(--iso-metal-s)" strokeWidth={2} />
      <rect x={pole[1][0] - 6} y={pole[1][1]} width={12} height={16} rx={4} fill="var(--iso-glass)" stroke="var(--iso-metal-s)" strokeWidth={0.8} />
      {!compact && <Patient at={P(1.9, 3.7)} pose="sit" />}
      {!compact && <Nurse at={P(4.2, 3.4)} pose="reach" flip />}
      <IsoBox x={4.5} y={0.4} w={1.0} d={0.8} h={1.3} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
    </RoomBase>
  );
};

export default IvRoom;
