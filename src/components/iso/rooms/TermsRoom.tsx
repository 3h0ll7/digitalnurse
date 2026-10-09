import { IsoBox } from "../primitives";
import { Nurse } from "../people";
import { planeY } from "../iso";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const TermsRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  return (
    <RoomBase {...props}>
      {/* bilingual word cards on the wall */}
      <g transform={planeY(0.8, 0.03, 3.8, origin)}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 34},${(i % 2) * 10})`}>
            <rect width={28} height={20} rx={3} fill={["var(--iso-c3)", "var(--iso-c2)", "var(--iso-c1)"][i]} />
            <text x={14} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--iso-ink)">{["Aa", "أب", "Rx"][i]}</text>
          </g>
        ))}
      </g>
      {/* lectern with an open dictionary */}
      <IsoBox x={2.2} y={2.0} w={1.0} d={0.9} h={1.8} top="--iso-c4" front="--iso-c4s" side="--iso-c4x" origin={origin} />
      <IsoBox x={2.05} y={1.95} z={1.8} w={1.3} d={1.0} h={0.15} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <path d={`M${P(2.7, 1.95, 1.95)[0]} ${P(2.7, 1.95, 1.95)[1]} L${P(2.7, 2.95, 1.95)[0]} ${P(2.7, 2.95, 1.95)[1]}`} stroke="var(--iso-c5x)" strokeWidth={1.4} />
      <IsoBox x={4.5} y={0.2} w={1.0} d={0.8} h={2.6} top="--iso-c3s" front="--iso-shelf-back" side="--iso-c3x" origin={origin} />
      {!compact && <Nurse at={P(3.0, 4.2)} />}
    </RoomBase>
  );
};

export default TermsRoom;
