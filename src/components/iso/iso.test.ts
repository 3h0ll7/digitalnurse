import { describe, expect, it } from "vitest";
import { boxFaces, planeX, planeY, project, pts, sceneSize } from "./iso";

describe("project", () => {
  it("keeps the origin in place", () => expect(project(0, 0, 0, [0, 0])).toEqual([0, 0]));
  it("moves +x right and down", () => {
    const [x, y] = project(1, 0, 0, [0, 0]);
    expect(x).toBeCloseTo(20.78, 2);
    expect(y).toBeCloseTo(12, 5);
  });
  it("moves +y left and down", () => {
    const [x, y] = project(0, 1, 0, [0, 0]);
    expect(x).toBeCloseTo(-20.78, 2);
    expect(y).toBeCloseTo(12, 5);
  });
  it("moves +z straight up", () => expect(project(0, 0, 1, [0, 0])).toEqual([0, -24]));
});

describe("pts", () => {
  it("formats points with one decimal", () => expect(pts([[1.234, 5.678]])).toBe("1.2,5.7"));
});

describe("boxFaces", () => {
  it("returns a four-point top face starting at the top back corner", () => {
    const { top } = boxFaces(0, 0, 0, 1, 1, 1, [0, 0]);
    expect(top).toHaveLength(4);
    expect(top[0]).toEqual(project(0, 0, 1, [0, 0]));
  });
});

describe("plane transforms", () => {
  it("skews the +x facing plane upward to the right", () => expect(planeX(0, 0, 0, [0, 0]).startsWith("matrix(0.866,-0.5")).toBe(true));
  it("skews the +y facing plane downward to the right", () => expect(planeY(0, 0, 0, [0, 0]).startsWith("matrix(0.866,0.5")).toBe(true));
});

describe("sceneSize", () => {
  it("fits a room footprint plus padding", () => {
    const { width, height, origin } = sceneSize(10, 9, 6.5, 16);
    expect(width).toBeCloseTo(19 * 24 * Math.cos(Math.PI / 6) + 32, 1);
    expect(origin[1]).toBeCloseTo(6.5 * 24 + 16, 5);
    expect(height).toBeGreaterThan(origin[1]);
  });
});
