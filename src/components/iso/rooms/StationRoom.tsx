import { IsoBox, WallClock } from "../primitives";
import { Doctor, Nurse } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const StationRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  const full = (props.leftWallHeight ?? 4.5) > 3;
  return (
    <RoomBase {...props}>
      {full && <WallClock y={2.4} z={3.5} origin={origin} />}
      {/* files cabinet */}
      <IsoBox x={4.4} y={0} w={1.2} d={0.9} h={2.4} top="--iso-c3" front="--iso-c3s" side="--iso-c3x" origin={origin} />
      {!compact && <Nurse at={P(2.4, 1.6)} />}
      {/* desk with a calculator and a computer */}
      <IsoBox x={0.8} y={2.3} w={4.0} d={1.1} h={1.5} top="--iso-shelf-top" front="--iso-c4" side="--iso-c4s" origin={origin} />
      <IsoBox x={1.2} y={2.45} z={1.5} w={1.0} d={0.12} h={0.75} top="--iso-screen-frame" front="--iso-screen" side="--iso-screen-frame" origin={origin} />
      <IsoBox x={2.8} y={2.6} z={1.5} w={0.55} d={0.7} h={0.1} top="--iso-ink" front="--iso-ink" side="--iso-ink" origin={origin} />
      <IsoBox x={3.7} y={2.5} z={1.5} w={0.8} d={0.6} h={0.35} top="--iso-c2" front="--iso-c2s" side="--iso-c2x" origin={origin} />
      {!compact && <Doctor at={P(3.6, 4.9)} />}
    </RoomBase>
  );
};

export default StationRoom;
