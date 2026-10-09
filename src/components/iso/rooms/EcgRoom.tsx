import { IsoBox, WallScreen } from "../primitives";
import { Nurse, Patient } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const EcgRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  const [a] = [P(3.75, 0.05, 2.2)];
  return (
    <RoomBase {...props}>
      <WallScreen x0={3.6} x1={5.5} z0={2} z1={3.4} origin={origin}>
        <path
          d={`M${a[0]} ${a[1]} l8 4.6 l3 -10 l4 16 l3 -8 l10 5.8 l3 -10 l4 16 l3 -8 l8 4.6`}
          transform={`translate(0,${-12})`}
          fill="none"
          stroke="var(--iso-trace)"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </WallScreen>
      <IsoBox x={0.5} y={0.4} w={1.0} d={0.8} h={2.3} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      <IsoBox x={0.6} y={0.5} z={2.3} w={0.8} d={0.1} h={0.6} top="--iso-screen-frame" front="--iso-screen" side="--iso-screen-frame" origin={origin} />
      {/* bed */}
      <IsoBox x={1.0} y={1.6} w={3.4} d={1.7} h={0.8} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      <IsoBox x={1.0} y={1.6} z={0.8} w={3.4} d={1.7} h={0.3} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={1.1} y={1.75} z={1.1} w={0.8} d={1.4} h={0.25} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={2.2} y={1.6} z={1.1} w={2.2} d={1.7} h={0.12} top="--iso-gown" front="--iso-gown-d" side="--iso-gown-d" origin={origin} />
      {!compact && <Patient at={P(2.6, 3.4)} pose="sit" />}
      {!compact && <Nurse at={P(4.8, 4.2)} flip />}
    </RoomBase>
  );
};

export default EcgRoom;
