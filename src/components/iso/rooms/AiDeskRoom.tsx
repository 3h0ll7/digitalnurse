import { IsoBox, WallScreen } from "../primitives";
import { Child, Nurse } from "../people";
import { planeY } from "../iso";
import { pointFn, type RoomProps } from "./kit";
import { RoomBase } from "./RoomBase";

const AiDeskRoom = (props: RoomProps) => {
  const { origin, compact } = props;
  const P = pointFn(origin);
  const head = P(4.2, 2.6, 1.9);
  return (
    <RoomBase {...props}>
      <WallScreen x0={0.8} x1={4.2} z0={1.9} z1={3.8} origin={origin}>
        <g transform={planeY(1.1, 0.06, 3.5, origin)}>
          <rect x={0} y={0} width={34} height={11} rx={5} fill="var(--iso-c1)" />
          <rect x={22} y={16} width={36} height={11} rx={5} fill="var(--iso-c5)" />
          <rect x={0} y={32} width={26} height={11} rx={5} fill="var(--iso-c1)" />
        </g>
      </WallScreen>
      <IsoBox x={0.9} y={1.4} w={3.2} d={1.0} h={1.4} top="--iso-shelf-top" front="--iso-c2" side="--iso-c2s" origin={origin} />
      {/* robot helper */}
      <IsoBox x={3.9} y={2.3} w={0.7} d={0.7} h={1.2} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      <rect x={head[0] - 10} y={head[1] - 14} width={20} height={14} rx={5} fill="var(--iso-c5)" stroke="var(--iso-metal-s)" />
      <circle cx={head[0] - 4} cy={head[1] - 7} r={1.8} fill="var(--iso-c1)" />
      <circle cx={head[0] + 4} cy={head[1] - 7} r={1.8} fill="var(--iso-c1)" />
      <path d={`M${head[0]} ${head[1] - 14} v-6`} stroke="var(--iso-metal-s)" strokeWidth={1.5} />
      <circle cx={head[0]} cy={head[1] - 21} r={2.2} fill="var(--iso-c2)" />
      {!compact && <Child at={P(2.3, 3.6)} />}
      {!compact && <Nurse at={P(1.4, 4.3)} />}
    </RoomBase>
  );
};

export default AiDeskRoom;
