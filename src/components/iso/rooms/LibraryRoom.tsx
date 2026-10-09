import { IsoBox } from "../primitives";
import { Nurse } from "../people";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const BOOKS = ["c1", "c2", "c3", "c4", "c5", "c1", "c4", "c2", "c3"] as const;

const LibraryRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  return (
    <RoomBase {...props}>
      <IsoBox x={0.4} y={0} w={4.4} d={0.8} h={3.6} top="--iso-c4s" front="--iso-shelf-back" side="--iso-c4x" origin={origin} />
      {[0.1, 1.25, 2.4].map((z, row) =>
        BOOKS.map((c, i) => (
          <IsoBox
            key={`${row}-${i}`}
            x={0.55 + i * 0.45}
            y={0.15}
            z={z}
            w={0.35}
            d={0.55}
            h={0.75 + ((i + row) % 3) * 0.12}
            top={`--iso-${c}`}
            front={`--iso-${c}s`}
            side={`--iso-${c}x`}
            origin={origin}
          />
        )),
      )}
      {/* chair + table with flashcards */}
      <IsoBox x={1.6} y={2.6} w={0.9} d={0.9} h={0.8} top="--iso-c1" front="--iso-c1s" side="--iso-c1x" origin={origin} />
      {!compact && <Nurse at={P(2.2, 3.4)} pose="sit" />}
      <IsoBox x={2.4} y={2.4} w={2.4} d={1.6} h={1.3} top="--iso-c3" front="--iso-c3s" side="--iso-c3x" origin={origin} />
      <IsoBox x={2.8} y={2.7} z={1.3} w={0.6} d={0.4} h={0.05} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <IsoBox x={3.6} y={2.9} z={1.3} w={0.6} d={0.4} h={0.05} top="--iso-c2" front="--iso-c2s" side="--iso-c2x" origin={origin} />
      <IsoBox x={3.1} y={3.3} z={1.3} w={0.6} d={0.4} h={0.05} top="--iso-c1" front="--iso-c1s" side="--iso-c1x" origin={origin} />
    </RoomBase>
  );
};

export default LibraryRoom;
