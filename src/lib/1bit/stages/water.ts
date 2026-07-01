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
 *      Anything placed by this pass is classified `pondMask`.
 *   3. RIVERS via FLOW ACCUMULATION on a D8 drainage tree: each cell drains to
 *      its lowest neighbour; processing cells high->low, one unit of "rain" per
 *      cell flows downhill and accumulates. Because every cell has exactly one
 *      downhill target, the set of high-flow cells is naturally a 1-cell-wide
 *      branching tree — real river geometry — so we mark them directly, with
 *      no disc widening. A river cell is kept only if its drainage path
 *      actually terminates in a lake/sea (precomputed via a low->high sweep of
 *      `terminatesInLake`); rivers that would dead-end on dry land are
 *      discarded so every river connects to a body of water. Anything placed
 *      by this pass is classified `riverMask`.
 *   4. Clean up stray single-cell noise; masks are re-synced to match.
 *
 * Ponds render with the solid-coast alt template, rivers with the wavy
 * template. Classification is by origin (which pass placed the cell), not by
 * shape, so a 1-wide river merging into a lake keeps its wavy texture right up
 * to the shoreline without being absorbed by the lake's connected component.
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

// 4-neighbourhood (N/E/S/W). Used for river drainage so flow paths are
// inherently 4-connected — matches how the autotiler joins cells and
// guarantees rivers stay strictly 1 cell wide (a D8 diagonal step would
// otherwise need a bridge cell and produce a 2-wide staircase).
const NEI4 = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1],
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

/** Flow accumulation on a D4 drainage tree. Also returns the tree itself.
 *  4-connectivity (not D8) so downhill paths are inherently 4-connected —
 *  rivers rendered from this tree are guaranteed strictly 1 cell wide. */
function accumulateFlow(h: Float32Array, cols: number, rows: number) {
  const n = cols * rows;
  const downhill = new Int32Array(n).fill(-1);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cy * cols + cx;
      let lowest = h[i];
      let target = -1;
      for (const [dx, dy] of NEI4) {
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
  return { flow, maxFlow, downhill };
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

function carveWater(ctx: WorldCtx): { pondMask: Uint8Array; riverMask: Uint8Array } {
  const { cols, rows, tuning, water } = ctx;
  const n = cols * rows;
  const h = buildHeight(ctx);

  const pondMask = new Uint8Array(n);
  const riverMask = new Uint8Array(n);

  // Lakes & seas: everything below the water level. Marked as pond by origin.
  const level = quantile(h, tuning.waterAmount);
  for (let i = 0; i < n; i++) {
    if (h[i] < level) {
      water[i] = 1;
      pondMask[i] = 1;
    }
  }

  // D8 flow accumulation + downhill tree.
  const { flow, maxFlow, downhill } = accumulateFlow(h, cols, rows);

  // Precompute: does this cell's downhill trace reach a lake/sea cell? Sweep
  // low->high so each cell sees its already-resolved downstream neighbour.
  const terminates = new Uint8Array(n);
  const orderLowFirst = Array.from({ length: n }, (_, i) => i).sort((a, b) => h[a] - h[b]);
  for (const i of orderLowFirst) {
    if (pondMask[i]) {
      terminates[i] = 1;
      continue;
    }
    const d = downhill[i];
    if (d < 0) terminates[i] = 0;
    else if (pondMask[d]) terminates[i] = 1;
    else terminates[i] = terminates[d];
  }

  // Rivers: mark 1-cell-wide (no disc widening — the D4 tree is already a
  // strictly 1-wide, 4-connected branching network). Higher `riverAmount` ->
  // lower threshold -> more/branchier rivers. Only keep cells whose drainage
  // actually terminates in a lake so every river connects to a body of water.
  const threshold = maxFlow * (0.5 - 0.0 * tuning.riverAmount);
  for (let i = 0; i < n; i++) {
    if (pondMask[i]) continue;
    if (flow[i] < threshold) continue;
    if (!terminates[i]) continue;
    water[i] = 1;
    riverMask[i] = 1;
  }

  // Two independent parallel branches running in adjacent columns/rows can
  // still produce a 2x2 all-river block — a visible "fat spot" in the
  // channel. Iteratively kill any 2x2 by removing its lowest-flow cell
  // (weakest tributary), then cascade-prune any river cell that ends up with
  // no 4-adjacent water (would render as an isolated island). Rivers can
  // still bend and Y-merge; only true 2x2 fills are removed.
  let broke = true;
  while (broke) {
    broke = false;
    for (let cy = 0; cy < rows - 1; cy++) {
      for (let cx = 0; cx < cols - 1; cx++) {
        const i00 = cy * cols + cx;
        const i01 = i00 + 1;
        const i10 = i00 + cols;
        const i11 = i10 + 1;
        if (!riverMask[i00] || !riverMask[i01] || !riverMask[i10] || !riverMask[i11])
          continue;
        let victim = i00;
        let vFlow = flow[i00];
        if (flow[i01] < vFlow) {
          victim = i01;
          vFlow = flow[i01];
        }
        if (flow[i10] < vFlow) {
          victim = i10;
          vFlow = flow[i10];
        }
        if (flow[i11] < vFlow) {
          victim = i11;
        }
        riverMask[victim] = 0;
        water[victim] = 0;
        broke = true;
      }
    }
  }
  let pruned = true;
  while (pruned) {
    pruned = false;
    for (let i = 0; i < n; i++) {
      if (!riverMask[i]) continue;
      const cx = i % cols;
      const cy = (i / cols) | 0;
      let hasWater = false;
      for (const [dx, dy] of NEI4) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        if (water[ny * cols + nx]) {
          hasWater = true;
          break;
        }
      }
      if (!hasWater) {
        riverMask[i] = 0;
        water[i] = 0;
        pruned = true;
      }
    }
  }

  // Kill speckle; re-sync masks so they match the cleaned water map.
  removeTinyComponents(water, cols, rows, 2);
  for (let i = 0; i < n; i++) {
    if (!water[i]) {
      pondMask[i] = 0;
      riverMask[i] = 0;
    }
  }

  return { pondMask, riverMask };
}

export const waterStage: Stage = {
  name: "water",
  build(ctx: WorldCtx): PlacedTile[] {
    const { pondMask, riverMask } = carveWater(ctx);
    for (let i = 0; i < ctx.water.length; i++) if (ctx.water[i]) ctx.blocked[i] = 1;

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
