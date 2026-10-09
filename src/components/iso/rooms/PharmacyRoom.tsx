import { IsoBox, Plant } from "../primitives";
import { Doctor, Elder } from "../people";
import { planeY } from "../iso";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const SHELF_ITEMS: [number, number, number, string][] = [
  // x, width, height, colour index
  [0.75, 0.45, 0.6, "c1"], [1.3, 0.35, 0.8, "c2"], [1.75, 0.5, 0.55, "c3"], [2.35, 0.4, 0.75, "c4"], [2.85, 0.45, 0.6, "c5"], [3.4, 0.4, 0.7, "c1"],
];

const PharmacyRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  return (
    <RoomBase {...props}>
      <IsoBox x={0.5} y={0} w={3.6} d={0.9} h={3.4} top="--iso-shelf-top" front="--iso-shelf-back" side="--iso-shelf-fx" origin={origin} />
      {[0.15, 1.25, 2.35].map((z) =>
        SHELF_ITEMS.map(([x, w, h, c], i) => (
          <IsoBox key={`${z}-${i}`} x={x} y={0.15} z={z} w={w} d={0.6} h={h * 0.9} top={`--iso-${c}`} front={`--iso-${c}s`} side={`--iso-${c}x`} origin={origin} />
        )),
      )}
      {[1.15, 2.25].map((z) => (
        <IsoBox key={z} x={0.5} y={0} z={z} w={3.6} d={0.9} h={0.1} top="--iso-shelf-top" front="--iso-shelf-fy" side="--iso-shelf-fx" origin={origin} />
      ))}
      <g transform={planeY(4.4, 0.02, 3.6, origin)}>
        <rect width={34} height={22} rx={4} fill="var(--iso-sign)" />
        <rect x={13} y={4} width={8} height={14} rx={1.5} fill="#fff" />
        <rect x={10} y={7} width={14} height={8} rx={1.5} fill="#fff" />
      </g>
      <Plant at={P(5.3, 0.8)} scale={0.6} />
      {!compact && <Doctor at={P(3.1, 2.1)} pose="reach" />}
      <IsoBox x={1.1} y={2.9} w={4.2} d={0.9} h={1.5} top="--iso-c1" front="--iso-c3" side="--iso-c3s" origin={origin} />
      <IsoBox x={4.1} y={3.0} z={1.5} w={0.9} d={0.1} h={0.75} top="--iso-screen-frame" front="--iso-screen" side="--iso-screen-frame" origin={origin} />
      <IsoBox x={1.5} y={3.1} z={1.5} w={0.3} d={0.3} h={0.45} top="--iso-c5" front="--iso-c2" side="--iso-c2s" origin={origin} />
      <IsoBox x={1.95} y={3.15} z={1.5} w={0.3} d={0.3} h={0.35} top="--iso-c5" front="--iso-c4" side="--iso-c4s" origin={origin} />
      {!compact && <Elder at={P(2.4, 4.9)} />}
    </RoomBase>
  );
};

export default PharmacyRoom;
