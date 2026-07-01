/**
 * Stage 1: bodies of water (proper hydrology).
 *
 * Instead of thresholding noise into blobs, this models terrain and lets water
 * behave like water, which is what makes it read as seas / lakes / rivers /
 * ponds / puddles that all connect:
 *
 *   1. Build a HEIGHT field: multi-octave fbm, domain-warped (sample coords are
 *      themselves offset by noise) so basins and ridges are organic, not round.
 *      A gentle random tilt biases one side lower so a sea/coast can form.
 *   2. LAKES & SEAS: every cell below a water level is water. The level is a
 *      quantile of the heights, so `waterAmount` is the exact fraction covered.
 *      Big low regions become seas/lakes, small ones ponds/puddles, for free.
 *   3. RIVERS via FLOW ACCUMULATION: each cell drains to its lowest neighbour;
 *      processing cells high->low, one unit of "rain" per cell flows downhill and
 *      accumulates. Cells whose accumulated flow exceeds a threshold become river,
 *      widening with flow, so streams merge, widen downstream, pool into ponds at
 *      basins, and drain into lakes. Rivers turning into ponds (and back) falls
 *      out of this naturally.
 *   4. Clean up stray single-cell noise.
 *   5. Split water bodies into PONDS vs RIVERS by *connected component*: any
 *      water component that reaches 3+ cells wide anywhere becomes a pond/sea
 *      (solid-coast alt template); components that stay thin end-to-end become
 *      rivers (wavy template). Component-level classification means a thin arm
 *      off a wide body still reads as part of that body — no mixed textures
 *      inside a single visual shape.
 *
 * Writes `ctx.water` / `ctx.blocked` so later stages avoid water.
 */

import { NATURE_WATER_ALT_TILES, NATURE_WATER_TILES, SOLID_TILE } from "../bountiful-bits";
import { fbm2D } from "../noise";
import { autotileMask } from "../autotile";
import type { PlacedTile, Stage, WorldCtx } from "../world";

const HEIGHT_FREQ = 0.065; // lattice period ~15 cells -> a few basins across
const WARP_FREQ = 0.11;
const WARP_AMOUNT = 11; // cells of domain-warp displacement (more organic coasts)
const TILT = 0.22; // gentle overall slope (avoids a hard straight coastline)

const NEI8 = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

function seed(rng: () => number): number {
  return (rng() * 0xffffffff) >>> 0;
}

/** Domain-warped, tilted fbm height field, normalised to 0..1. */
function buildHeight(ctx: WorldCtx): Float32Array {
  const { cols, rows, rng } = ctx;
  const base = fbm2D(seed(rng), 5, 0.5);
  const warpX = fbm2D(seed(rng), 3, 0.5);
  const warpY = fbm2D(seed(rng), 3, 0.5);

  const tiltAngle = rng() * Math.PI * 2;
  const tx = Math.cos(tiltAngle);
  const ty = Math.sin(tiltAngle);

  const h = new Float32Array(cols * rows);
  let min = Infinity;
  let max = -Infinity;
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const wx = (warpX(cx * WARP_FREQ, cy * WARP_FREQ) - 0.5) * WARP_AMOUNT;
      const wy = (warpY(cx * WARP_FREQ, cy * WARP_FREQ) - 0.5) * WARP_AMOUNT;
      let v = base((cx + wx) * HEIGHT_FREQ, (cy + wy) * HEIGHT_FREQ);
      v += ((cx / cols - 0.5) * tx + (cy / rows - 0.5) * ty) * TILT;
      const i = cy * cols + cx;
      h[i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const span = max - min || 1;
  for (let i = 0; i < h.length; i++) h[i] = (h[i] - min) / span;
  return h;
}

/** Height quantile: the level below which `frac` of cells lie. */
function quantile(h: Float32Array, frac: number): number {
  const sorted = Float32Array.from(h).sort();
  return sorted[Math.min(sorted.length - 1, Math.floor(frac * sorted.length))];
}

/** Flow accumulation: returns per-cell drainage and the max seen. */
function accumulateFlow(h: Float32Array, cols: number, rows: number) {
  const n = cols * rows;
  const downhill = new Int32Array(n).fill(-1);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cy * cols + cx;
      let lowest = h[i];
      let target = -1;
      for (const [dx, dy] of NEI8) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const j = ny * cols + nx;
        if (h[j] < lowest) {
          lowest = h[j];
          target = j;
        }
      }
      downhill[i] = target;
    }
  }

  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => h[b] - h[a]);
  const flow = new Float32Array(n).fill(1);
  let maxFlow = 1;
  for (const i of order) {
    const d = downhill[i];
    if (d >= 0) {
      flow[d] += flow[i];
      if (flow[d] > maxFlow) maxFlow = flow[d];
    }
  }
  return { flow, maxFlow };
}

/** Stamp a filled disc into `water`. */
function stampDisc(
  water: Uint8Array,
  cols: number,
  rows: number,
  cx: number,
  cy: number,
  r: number,
) {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r + 1) continue;
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      water[ny * cols + nx] = 1;
    }
  }
}

/** Remove connected water components smaller than `minSize` (kills speckle). */
function removeTinyComponents(water: Uint8Array, cols: number, rows: number, minSize: number) {
  const n = cols * rows;
  const seen = new Uint8Array(n);
  const stack: number[] = [];
  for (let start = 0; start < n; start++) {
    if (!water[start] || seen[start]) continue;
    const comp: number[] = [];
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const i = stack.pop()!;
      comp.push(i);
      const cx = i % cols;
      const cy = (i / cols) | 0;
      for (const [dx, dy] of NEI8) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const j = ny * cols + nx;
        if (water[j] && !seen[j]) {
          seen[j] = 1;
          stack.push(j);
        }
      }
    }
    if (comp.length < minSize) for (const i of comp) water[i] = 0;
  }
}

function carveWater(ctx: WorldCtx): void {
  const { cols, rows, tuning, water } = ctx;
  const h = buildHeight(ctx);

  // Lakes & seas: everything below the water level.
  const level = quantile(h, tuning.waterAmount);
  for (let i = 0; i < h.length; i++) if (h[i] < level) water[i] = 1;

  // Rivers: carve where drainage is high, widening with flow.
  const { flow, maxFlow } = accumulateFlow(h, cols, rows);
  // More riverAmount -> lower threshold -> more/branchier rivers.
  const threshold = maxFlow * (0.28 - 0.22 * tuning.riverAmount);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cy * cols + cx;
      if (flow[i] < threshold) continue;
      const ratio = flow[i] / maxFlow;
      const r = ratio > 0.45 ? 2 : ratio > 0.14 ? 1 : 0; // widen downstream
      stampDisc(water, cols, rows, cx, cy, r);
    }
  }

  removeTinyComponents(water, cols, rows, 2);
}

/**
 * Split the water mask into "pond-like" and "river-like" cells by CONNECTED
 * COMPONENT: any connected water body that reaches at least 3 cells wide
 * somewhere (i.e. contains at least one cell whose 8 neighbours are all water)
 * is classified entirely as a pond/sea/lake. Bodies that stay thin end-to-end
 * are classified entirely as rivers. Component-level classification (rather
 * than per-cell) means a thin arm coming off a wide body still reads as part
 * of that body — no mixed textures within a single visual water shape.
 */
function classifyPondCells(water: Uint8Array, cols: number, rows: number): Uint8Array {
  const n = cols * rows;
  const wet = (x: number, y: number): number =>
    x >= 0 && x < cols && y >= 0 && y < rows ? water[y * cols + x] : 0;

  // deep[i] = 1 iff cell i and all 8 neighbours are water (center of a 3x3
  // fully-water block). Used only as a component-level "this body is wide
  // somewhere" test.
  const deep = new Uint8Array(n);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (!water[i]) continue;
      if (
        wet(x - 1, y - 1) &&
        wet(x, y - 1) &&
        wet(x + 1, y - 1) &&
        wet(x - 1, y) &&
        wet(x + 1, y) &&
        wet(x - 1, y + 1) &&
        wet(x, y + 1) &&
        wet(x + 1, y + 1)
      ) {
        deep[i] = 1;
      }
    }
  }

  // Flood-fill (8-connectivity) each water component; if it contains any deep
  // cell, mark every cell in it as pond.
  const pond = new Uint8Array(n);
  const seen = new Uint8Array(n);
  const stack: number[] = [];
  for (let start = 0; start < n; start++) {
    if (!water[start] || seen[start]) continue;
    const comp: number[] = [];
    let hasDeep = false;
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const i = stack.pop()!;
      comp.push(i);
      if (deep[i]) hasDeep = true;
      const cx = i % cols;
      const cy = (i / cols) | 0;
      for (const [dx, dy] of NEI8) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const j = ny * cols + nx;
        if (water[j] && !seen[j]) {
          seen[j] = 1;
          stack.push(j);
        }
      }
    }
    if (hasDeep) for (const i of comp) pond[i] = 1;
  }
  return pond;
}

export const waterStage: Stage = {
  name: "water",
  build(ctx: WorldCtx): PlacedTile[] {
    carveWater(ctx);
    for (let i = 0; i < ctx.water.length; i++) if (ctx.water[i]) ctx.blocked[i] = 1;

    // Classify per connected component: any water body that reaches 3+ cells
    // wide anywhere becomes a pond (solid coasts); components that stay thin
    // end-to-end become rivers (wavy coasts). Whole-body classification means
    // no mixed pond/river texture inside a single visual water shape.
    const pondMask = classifyPondCells(ctx.water, ctx.cols, ctx.rows);
    const riverMask = new Uint8Array(ctx.water.length);
    for (let i = 0; i < ctx.water.length; i++) {
      if (ctx.water[i] && !pondMask[i]) riverMask[i] = 1;
    }

    // Ponds/seas/lakes: autotile with the solid-coast alt template so the
    // shoreline has proper rounded corners and edge detail. Rivers keep the
    // textured (wavy) template. Both passes autotile against the FULL water
    // mask so the coast shape at the pond/river seam is picked consistently
    // — only the tile texture differs across the boundary.
    const ponds = autotileMask(
      ctx.water,
      ctx.cols,
      ctx.rows,
      ctx.tilePx,
      NATURE_WATER_ALT_TILES,
      "water",
      SOLID_TILE,
      pondMask,
    );
    const rivers = autotileMask(
      ctx.water,
      ctx.cols,
      ctx.rows,
      ctx.tilePx,
      NATURE_WATER_TILES,
      "water",
      SOLID_TILE,
      riverMask,
    );
    return [...ponds, ...rivers];
  },
};
