import { useId, type ReactNode } from "react";
import { boxFaces, planeX, project, pts, type Pt } from "./iso";

/** CSS custom property holding a colour, e.g. "--iso-c1". */
export type IsoColor = `--iso-${string}`;

const fill = (color: IsoColor) => `var(${color})`;

export const Poly = ({ points, color }: { points: Pt[]; color: IsoColor }) => (
  <polygon points={pts(points)} fill={fill(color)} />
);

interface IsoBoxProps {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  top: IsoColor;
  front: IsoColor;
  side: IsoColor;
  origin: Pt;
}

export const IsoBox = ({ x, y, z = 0, w, d, h, top, front, side, origin }: IsoBoxProps) => {
  const faces = boxFaces(x, y, z, w, d, h, origin);
  return (
    <g>
      <Poly points={faces.front} color={front} />
      <Poly points={faces.side} color={side} />
      <Poly points={faces.top} color={top} />
    </g>
  );
};

interface RoomShellProps {
  w: number;
  d: number;
  h: number;
  origin: Pt;
  wallX?: IsoColor;
  wallY?: IsoColor;
  floor?: IsoColor;
  /** Draw the slab under the floor (only for stand-alone rooms). */
  slab?: boolean;
}

/** Floor with tile lines and the two back walls (along x at y=0, along y at x=0). */
export const RoomShell = ({
  w,
  d,
  h,
  origin,
  wallX = "--iso-wall-x",
  wallY = "--iso-wall-y",
  floor = "--iso-floor",
  slab = true,
}: RoomShellProps) => {
  const P = (x: number, y: number, z = 0) => project(x, y, z, origin);
  const lines: ReactNode[] = [];
  for (let i = 1; i < w; i++) {
    const [a, b] = [P(i, 0), P(i, d)];
    lines.push(<line key={`x${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--iso-floor-line)" strokeWidth={1} />);
  }
  for (let j = 1; j < d; j++) {
    const [a, b] = [P(0, j), P(w, j)];
    lines.push(<line key={`y${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--iso-floor-line)" strokeWidth={1} />);
  }
  return (
    <g>
      {slab && (
        <>
          <Poly points={[P(0, d), P(w, d), P(w, d, -0.7), P(0, d, -0.7)]} color="--iso-slab-l" />
          <Poly points={[P(w, 0), P(w, d), P(w, d, -0.7), P(w, 0, -0.7)]} color="--iso-slab-r" />
        </>
      )}
      <Poly points={[P(0, 0), P(w, 0), P(w, d), P(0, d)]} color={floor} />
      {lines}
      <Poly points={[P(0, 0), P(w, 0), P(w, 0, h), P(0, 0, h)]} color={wallX} />
      <Poly points={[P(0, 0), P(0, d), P(0, d, h), P(0, 0, h)]} color={wallY} />
      <Poly points={[P(0, 0), P(w, 0), P(w, 0, 0.4), P(0, 0, 0.4)]} color="--iso-skirting" />
      <Poly points={[P(0, 0), P(0, d), P(0, d, 0.4), P(0, 0, 0.4)]} color="--iso-skirting" />
      <Poly
        points={[P(-0.35, -0.35, h), P(w, -0.35, h), P(w, 0, h), P(0, 0, h), P(0, d, h), P(-0.35, d, h)]}
        color="--iso-wall-cap"
      />
      <Poly points={[P(w, -0.35, h), P(w, 0, h), P(w, 0, 0), P(w, -0.35, 0)]} color="--iso-wall-cap-side" />
      <Poly points={[P(-0.35, d, h), P(0, d, h), P(0, d, 0), P(-0.35, d, 0)]} color="--iso-wall-cap-side" />
    </g>
  );
};

/** Window on the left wall (x = 0) between y0..y1 and z0..z1; day sun or night moon follows the theme. */
export const WallWindow = ({ y0, y1, z0, z1, origin }: { y0: number; y1: number; z0: number; z1: number; origin: Pt }) => {
  const clipId = useId();
  const P = (y: number, z: number) => project(0, y, z, origin);
  const pane = [P(y0, z0), P(y1, z0), P(y1, z1), P(y0, z1)];
  const [cx, cy] = P(y0 + (y1 - y0) * 0.35, z0 + (z1 - z0) * 0.72);
  const [mx, my] = P((y0 + y1) / 2, z0);
  const [tx, ty] = P((y0 + y1) / 2, z1);
  return (
    <g>
      <Poly points={[P(y0 - 0.2, z0 - 0.2), P(y1 + 0.2, z0 - 0.2), P(y1 + 0.2, z1 + 0.2), P(y0 - 0.2, z1 + 0.2)]} color="--iso-frame" />
      <clipPath id={clipId}>
        <polygon points={pts(pane)} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <Poly points={pane} color="--iso-sky" />
        <circle cx={cx} cy={cy} r={8} fill="var(--iso-sun)" />
        <circle className="iso-night-only" cx={cx + 3.5} cy={cy - 2.5} r={7} fill="var(--iso-sky)" />
        <polygon points={pts([P(y0, z1), P(y0 + (y1 - y0) * 0.4, z1), P(y0, z0 + (z1 - z0) * 0.3)])} fill="#fff" opacity={0.18} />
      </g>
      <line x1={mx} y1={my} x2={tx} y2={ty} stroke="var(--iso-frame)" strokeWidth={3} />
    </g>
  );
};

/** Flat drawing mapped onto the left wall (x = 0), anchored at (y, z). */
export const OnWallY = ({ y, z, origin, children }: { y: number; z: number; origin: Pt; children: ReactNode }) => (
  <g transform={planeX(0, y, z, origin)}>{children}</g>
);

export const WallClock = ({ y, z, origin }: { y: number; z: number; origin: Pt }) => (
  <OnWallY y={y} z={z} origin={origin}>
    <circle r={11} fill="var(--iso-clock)" />
    <circle r={8.5} fill="#fff" />
    <path d="M0 0 V-5.5 M0 0 H4" stroke="var(--iso-ink)" strokeWidth={1.5} strokeLinecap="round" />
  </OnWallY>
);

export const Plant = ({ at, scale = 0.75 }: { at: Pt; scale?: number }) => (
  <g transform={`translate(${at[0]},${at[1]}) scale(${scale})`}>
    <path d="M-11 0 L-13 -20 H13 L11 0 Z" fill="var(--iso-pot)" />
    <ellipse cx={0} cy={-20} rx={13} ry={4} fill="var(--iso-pot-top)" />
    <path d="M0 -22 C-22 -40 -20 -62 -6 -70 C-4 -52 -2 -36 0 -22 Z" fill="var(--iso-leaf)" />
    <path d="M0 -22 C18 -36 26 -58 12 -72 C6 -54 4 -40 0 -22 Z" fill="var(--iso-leaf2)" />
    <path d="M0 -22 C-6 -44 2 -74 4 -86 C10 -66 8 -42 0 -22 Z" fill="var(--iso-leaf)" />
  </g>
);

/** Flat screen on the back wall (y = 0) facing +y, x0..x1, z0..z1. */
export const WallScreen = ({ x0, x1, z0, z1, origin, children }: { x0: number; x1: number; z0: number; z1: number; origin: Pt; children?: ReactNode }) => {
  const P = (x: number, z: number) => project(x, 0.05, z, origin);
  return (
    <g>
      <Poly points={[P(x0 - 0.15, z0 - 0.15), P(x1 + 0.15, z0 - 0.15), P(x1 + 0.15, z1 + 0.15), P(x0 - 0.15, z1 + 0.15)]} color="--iso-screen-frame" />
      <Poly points={[P(x0, z0), P(x1, z0), P(x1, z1), P(x0, z1)]} color="--iso-screen" />
      {children}
    </g>
  );
};

interface IsoSvgProps {
  width: number;
  height: number;
  title?: string;
  decorative?: boolean;
  /** Contains focusable rooms: exposed as a labelled group instead of a single image. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

/** Root <svg>. Always LTR so Arabic labels drawn inside never mirror. */
export const IsoSvg = ({ width, height, title, decorative, interactive, className, children }: IsoSvgProps) => {
  const titleId = useId();
  if (interactive) {
    return (
      <svg
        viewBox={`0 0 ${Math.round(width)} ${Math.round(height)}`}
        className={className}
        style={{ direction: "ltr", display: "block", width: "100%", height: "auto", overflow: "visible" }}
        role="group"
        aria-label={title}
      >
        {children}
      </svg>
    );
  }
  return (
    <svg
      viewBox={`0 0 ${Math.round(width)} ${Math.round(height)}`}
      className={className}
      style={{ direction: "ltr", display: "block", width: "100%", height: "auto" }}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={!decorative && title ? titleId : undefined}
      focusable="false"
    >
      {!decorative && title && <title id={titleId}>{title}</title>}
      {children}
    </svg>
  );
};
