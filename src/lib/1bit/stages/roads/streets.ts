/**
 * Street grids: the paved road network INSIDE a city or town.
 *
 * Streets are laid before the inter-town trails are routed, as a block grid
 * clipped to the settlement's circular footprint: vertical and horizontal
 * lines every 4th column/row, offset so they run tangent to the 3x3 plaza —
 * the plaza sits in its own block ringed by streets, and every other block is
 * exactly 3x3, which seats the 3x3 hall facades perfectly. A few grid lines
 * are randomly never built and lines stop at water or standing forest, so the
 * grid stays organic rather than graph paper.
 *
 * Street cells are marked `road` (so incoming trails, which treat existing
 * road as nearly free, merge onto the grid and follow it to the plaza) and
 * `blocked` (so buildings line the streets instead of sitting on them).
 * Hamlets get no grid — their lanes stay dirt.
 */

import type { Town, WorldCtx } from "../../world";

/** Street every 4th column/row -> 3-cell blocks between them. */
const SPACING = 4;
/** Chance each grid line actually got built. */
const LINE_KEEP = 0.85;

export function layStreets(ctx: WorldCtx, town: Town): void {
  const { cols, rows, rng, water, road, blocked } = ctx;
  if (town.tier === "hamlet") return;

  const r = town.radius;
  const r2 = r * r;

  // Lines at centre ± (2 + 4k): tangent to the plaza, blocks stay aligned.
  const offsets: number[] = [];
  for (let o = 2; o <= r - 1; o += SPACING) offsets.push(-o, o);

  const mark = (x: number, y: number): void => {
    if (x < 0 || x >= cols || y < 0 || y >= rows) return;
    const dx = x - town.cx;
    const dy = y - town.cy;
    if (dx * dx + dy * dy > r2) return; // clip to the footprint circle
    const i = y * cols + x;
    if (water[i]) return; // streets end at the shore
    if (blocked[i] && !road[i]) return; // a tree interrupts the street
    road[i] = 1;
    blocked[i] = 1;
  };

  for (const o of offsets) {
    if (rng() < LINE_KEEP) {
      for (let t = -r; t <= r; t++) mark(town.cx + o, town.cy + t); // vertical
    }
    if (rng() < LINE_KEEP) {
      for (let t = -r; t <= r; t++) mark(town.cx + t, town.cy + o); // horizontal
    }
  }
}
