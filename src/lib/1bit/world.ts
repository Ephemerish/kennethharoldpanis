/**
 * The shared world model that generation stages read and write.
 *
 * The map is built in ordered STAGES (water -> nature -> roads -> civilization),
 * each in its own file under ./stages. Every stage receives the same `WorldCtx`:
 * it can inspect what earlier stages placed (e.g. nature avoids water) and record
 * what it occupies, then returns the tiles it wants drawn. The renderer reveals
 * those tiles progressively so a visitor watches the world assemble.
 */

import type { Rng } from "./rng";

export type LayerName = "water" | "nature" | "road" | "civ";

/** One tile to draw: which sheet tile, and where on screen (top-left px). */
export interface PlacedTile {
  /** sheet column */
  col: number;
  /** sheet row */
  row: number;
  /** screen x (px) */
  x: number;
  /** screen y (px) */
  y: number;
  /** which layer/stage produced it (drives tint + draw order) */
  layer: LayerName;
}

/** Per-stage tuning knobs, surfaced as background options. */
export interface MapTuning {
  /** 0..1 fraction of the map covered by lakes/seas (low basins). */
  waterAmount: number;
  /** 0..1 how dense/branchy the river network is (lower flow threshold). */
  riverAmount: number;
  /** Lattice period (cells) of forest clumps. */
  forestFreq: number;
  /** Lattice period (cells) of flower meadows. */
  meadowFreq: number;
  /** Noise threshold (0..1) above which a cell is dense forest. */
  treeLine: number;
  /** Multiplier on how much nature spawns. */
  lushness: number;
}

/** Everything a stage needs; the grids are mutated in place across stages. */
export interface WorldCtx {
  /** grid width in cells */
  cols: number;
  /** grid height in cells */
  rows: number;
  /** on-screen tile size (px) */
  tilePx: number;
  /** viewport width (px) */
  width: number;
  /** viewport height (px) */
  height: number;
  rng: Rng;
  tuning: MapTuning;
  /** water mask, 1 = water. */
  water: Uint8Array;
  /** cells occupied by any layer, so later stages avoid overlap. */
  blocked: Uint8Array;
  idx(cx: number, cy: number): number;
  inBounds(cx: number, cy: number): boolean;
  isWater(cx: number, cy: number): boolean;
}

export function createWorld(
  width: number,
  height: number,
  tilePx: number,
  rng: Rng,
  tuning: MapTuning,
): WorldCtx {
  const cols = Math.max(1, Math.ceil(width / tilePx));
  const rows = Math.max(1, Math.ceil(height / tilePx));
  const water = new Uint8Array(cols * rows);
  const blocked = new Uint8Array(cols * rows);

  return {
    cols,
    rows,
    tilePx,
    width,
    height,
    rng,
    tuning,
    water,
    blocked,
    idx: (cx, cy) => cy * cols + cx,
    inBounds: (cx, cy) => cx >= 0 && cx < cols && cy >= 0 && cy < rows,
    isWater: (cx, cy) =>
      cx >= 0 && cx < cols && cy >= 0 && cy < rows ? water[cy * cols + cx] === 1 : false,
  };
}

/** A generation stage: populates the world and returns tiles to draw. */
export interface Stage {
  name: LayerName;
  build(ctx: WorldCtx): PlacedTile[];
}
