/** Isometric projection helpers (30°). One world unit = S pixels. */
export const S = 24;
const COS = Math.cos(Math.PI / 6);
const r1 = (n: number) => Math.round(n * 10) / 10;

export type Pt = [number, number];

export const project = (x: number, y: number, z = 0, origin: Pt = [0, 0]): Pt => [
  origin[0] + (x - y) * S * COS,
  origin[1] + (x + y) * S * 0.5 - z * S,
];

export const pts = (points: Pt[]): string => points.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" ");

/** The three visible faces of a cuboid: top, +y facing ("front") and +x facing ("side"). */
export const boxFaces = (x: number, y: number, z: number, w: number, d: number, h: number, origin: Pt = [0, 0]) => {
  const P = (a: number, b: number, c: number) => project(a, b, c, origin);
  return {
    top: [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)] as Pt[],
    front: [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)] as Pt[],
    side: [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)] as Pt[],
  };
};

/** Transform that maps flat 2D drawing (u right, v down) onto the plane facing +y, anchored at (x, y, z). */
export const planeY = (x: number, y: number, z: number, origin: Pt = [0, 0]): string => {
  const [a, b] = project(x, y, z, origin);
  return `matrix(${r3(COS)},0.5,0,1,${r1(a)},${r1(b)})`;
};

/** Same for the plane facing +x; text reads left to right when anchored at the plane's largest y. */
export const planeX = (x: number, y: number, z: number, origin: Pt = [0, 0]): string => {
  const [a, b] = project(x, y, z, origin);
  return `matrix(${r3(COS)},-0.5,0,1,${r1(a)},${r1(b)})`;
};

function r3(n: number) {
  return Math.round(n * 1000) / 1000;
}

/** Canvas size and origin for a scene whose footprint is w × d with walls h high. */
export const sceneSize = (w: number, d: number, h: number, pad = 12) => {
  const origin: Pt = [d * S * COS + pad, h * S + pad];
  const bottom = project(w, d, -0.7, origin)[1];
  return { width: (w + d) * S * COS + pad * 2, height: bottom + pad, origin };
};
