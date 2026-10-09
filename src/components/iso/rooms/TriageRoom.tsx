import { IsoBox, OnWallY } from "../primitives";
import { Nurse, Patient } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const TriageRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  const full = (props.leftWallHeight ?? 4.5) > 3;
  return (
    <RoomBase {...props}>
      {full && (
        <OnWallY y={3.2} z={3.6} origin={origin}>
          <rect x={0} y={0} width={10} height={70} rx={2} fill="var(--iso-c3)" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M0 ${i * 10 + 5} h${i % 2 ? 4 : 7}`} stroke="var(--iso-ink)" strokeWidth={1} opacity={0.5} />
          ))}
        </OnWallY>
      )}
      {/* BP monitor on stand */}
      <IsoBox x={3.9} y={0.6} w={0.25} d={0.25} h={2.2} top="--iso-metal" front="--iso-metal-s" side="--iso-metal-s" origin={origin} />
      <IsoBox x={3.65} y={0.55} z={2.2} w={0.8} d={0.35} h={0.6} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      {/* chair */}
      <IsoBox x={1.4} y={1.5} w={1.4} d={1.3} h={0.9} top="--iso-c1" front="--iso-c1s" side="--iso-c1x" origin={origin} />
      <IsoBox x={1.4} y={1.3} w={1.4} d={0.25} h={2.0} top="--iso-c1" front="--iso-c1s" side="--iso-c1x" origin={origin} />
      {!compact && <Patient at={P(2.2, 2.9)} pose="sit" />}
      {!compact && <Nurse at={P(4.0, 3.2)} pose="reach" flip />}
      {/* scale */}
      <IsoBox x={4.2} y={4.4} w={1.0} d={1.0} h={0.15} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={4.4} y={4.6} z={0.15} w={0.6} d={0.3} h={0.05} top="--iso-trace" front="--iso-c1s" side="--iso-c1s" origin={origin} />
    </RoomBase>
  );
};

export default TriageRoom;
