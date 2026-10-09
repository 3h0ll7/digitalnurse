import { IsoBox, Poly, WallWindow } from "../primitives";
import { Doctor } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const TUBES = ["--iso-c2", "--iso-c4", "--iso-c3", "--iso-c1", "--iso-c2"] as const;

const LabRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  return (
    <RoomBase {...props}>
      {(props.leftWallHeight ?? 4.5) > 3 && <WallWindow y0={1.6} y1={3.6} z0={2} z1={3.6} origin={origin} />}
      <IsoBox x={0.8} y={0} z={2.6} w={4.6} d={0.7} h={1.1} top="--iso-shelf-top" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={0.6} y={0} w={4.9} d={1.3} h={1.5} top="--iso-shelf-top" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      {/* microscope */}
      <IsoBox x={1.0} y={0.35} z={1.5} w={0.6} d={0.5} h={0.12} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      <IsoBox x={1.15} y={0.4} z={1.62} w={0.2} d={0.2} h={0.8} top="--iso-ink" front="--iso-screen-frame" side="--iso-ink" origin={origin} />
      <IsoBox x={1.1} y={0.5} z={2.2} w={0.55} d={0.18} h={0.18} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      {/* tube rack */}
      <IsoBox x={2.3} y={0.4} z={1.5} w={1.3} d={0.45} h={0.2} top="--iso-shelf-fx" front="--iso-shelf-fx" side="--iso-shelf-fx" origin={origin} />
      {TUBES.map((c, i) => {
        const [x, y] = P(2.45 + i * 0.24, 0.62, 1.7);
        return <rect key={i} x={x - 2} y={y - 14} width={4} height={14} rx={2} fill={`var(${c})`} />;
      })}
      {/* centrifuge */}
      <IsoBox x={4.2} y={0.3} z={1.5} w={0.9} d={0.8} h={0.5} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <Poly points={[P(4.35, 0.45, 2.01), P(4.95, 0.45, 2.01), P(4.95, 0.95, 2.01), P(4.35, 0.95, 2.01)]} color="--iso-glass" />
      {!compact && <Doctor at={P(3.0, 2.6)} pose="reach" />}
      <IsoBox x={4.4} y={3.6} w={0.9} d={0.9} h={1.1} top="--iso-c4" front="--iso-c4s" side="--iso-c4x" origin={origin} />
    </RoomBase>
  );
};

export default LabRoom;
