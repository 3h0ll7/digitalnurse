import { IsoBox, WallScreen } from "../primitives";
import { Nurse, Patient } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const PharmaRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  const a = P(1.0, 0.06, 2.1);
  return (
    <RoomBase {...props}>
      {/* concentration–time curve on the wall screen */}
      <WallScreen x0={0.8} x1={3.6} z0={2} z1={3.7} origin={origin}>
        <path d={`M${a[0]} ${a[1]} q14 -44 24 -26 t30 4`} transform="translate(2,-4)" fill="none" stroke="var(--iso-trace)" strokeWidth={2} />
      </WallScreen>
      {/* syringe pump on a pole */}
      <IsoBox x={4.3} y={0.8} w={0.2} d={0.2} h={2.4} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      <IsoBox x={4.0} y={0.7} z={1.6} w={0.8} d={0.5} h={0.45} top="--iso-c3" front="--iso-c3s" side="--iso-c3x" origin={origin} />
      {/* recliner */}
      <IsoBox x={1.6} y={2.6} w={1.6} d={1.4} h={0.9} top="--iso-c1" front="--iso-c1s" side="--iso-c1x" origin={origin} />
      <IsoBox x={1.6} y={2.3} w={1.6} d={0.35} h={2.0} top="--iso-c1" front="--iso-c1s" side="--iso-c1x" origin={origin} />
      {!compact && <Patient at={P(2.5, 4.1)} pose="sit" />}
      {!compact && <Nurse at={P(4.6, 3.6)} pose="reach" flip />}
    </RoomBase>
  );
};

export default PharmaRoom;
