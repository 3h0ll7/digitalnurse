import { project, sceneSize } from "./iso";
import { IsoBox, IsoSvg, RoomShell } from "./primitives";
import { Nurse } from "./people";

export type EmptyVariant = "no-results" | "offline" | "not-found";

const W = 5;
const D = 5;
const H = 3.6;
const { width, height, origin } = sceneSize(W, D, H, 10);
const P = (x: number, y: number, z = 0) => project(x, y, z, origin);

/** Nurse with a magnifier beside an empty shelf. */
const NoResults = () => {
  const lens = P(3.4, 2.9, 2.1);
  return (
    <>
      <IsoBox x={0.5} y={0} w={3} d={0.8} h={2.8} top="--iso-shelf-top" front="--iso-shelf-back" side="--iso-shelf-fx" origin={origin} />
      {[0.9, 1.9].map((z) => (
        <IsoBox key={z} x={0.5} y={0} z={z} w={3} d={0.8} h={0.08} top="--iso-shelf-top" front="--iso-shelf-fy" side="--iso-shelf-fx" origin={origin} />
      ))}
      <Nurse at={P(2.8, 2.8)} pose="reach" />
      <circle cx={lens[0]} cy={lens[1]} r={9} fill="var(--iso-glass)" fillOpacity={0.6} stroke="var(--iso-ink)" strokeWidth={2.5} />
      <path d={`M${lens[0] + 6} ${lens[1] + 6} l8 8`} stroke="var(--iso-ink)" strokeWidth={3} strokeLinecap="round" />
    </>
  );
};

/** Router with an unplugged cable. */
const Offline = () => {
  const plug = P(3.6, 3.4, 0.1);
  const port = P(2.2, 2.2, 0.5);
  return (
    <>
      <IsoBox x={1.4} y={1.6} w={1.6} d={1.0} h={0.5} top="--iso-c5" front="--iso-c5s" side="--iso-c5x" origin={origin} />
      {[1.7, 2.3].map((x) => {
        const [a, b] = P(x, 1.7, 0.5);
        return <path key={x} d={`M${a} ${b} v-26`} stroke="var(--iso-metal-s)" strokeWidth={2.5} strokeLinecap="round" />;
      })}
      <circle cx={P(2.6, 2.6, 0.3)[0]} cy={P(2.6, 2.6, 0.3)[1]} r={2.2} fill="#C8324B" />
      <path d={`M${port[0]} ${port[1]} C${port[0] + 10} ${port[1] + 30} ${plug[0] - 30} ${plug[1]} ${plug[0]} ${plug[1]}`} fill="none" stroke="var(--iso-ink)" strokeWidth={2} />
      <rect x={plug[0] - 2} y={plug[1] - 4} width={10} height={8} rx={2} fill="var(--iso-c4)" />
      <Nurse at={P(3.8, 1.4)} flip />
    </>
  );
};

/** Empty room, nurse pointing at the door. */
const NotFound = () => {
  const door = [P(0, 1.2, 0), P(0, 2.6, 0), P(0, 2.6, 2.6), P(0, 1.2, 2.6)];
  return (
    <>
      <polygon points={door.map((p) => p.join(",")).join(" ")} fill="var(--iso-c1)" />
      <circle cx={P(0, 2.35, 1.3)[0]} cy={P(0, 2.35, 1.3)[1]} r={2} fill="var(--iso-c3)" />
      <Nurse at={P(2.6, 3.0)} pose="reach" flip />
    </>
  );
};

const SCENES: Record<EmptyVariant, () => JSX.Element> = {
  "no-results": NoResults,
  offline: Offline,
  "not-found": NotFound,
};

const EmptyScene = ({ variant, className }: { variant: EmptyVariant; className?: string }) => {
  const Scene = SCENES[variant];
  return (
    <div className={className}>
      <IsoSvg width={width} height={height} decorative>
        <RoomShell w={W} d={D} h={H} origin={origin} />
        <Scene />
      </IsoSvg>
    </div>
  );
};

export default EmptyScene;
