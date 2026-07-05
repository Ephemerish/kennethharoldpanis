/**
 * Stage 1: bodies of water (proper hydrology).
 *
 * Instead of thresholding noise into blobs, this models terrain and lets water
 * behave like water, which is what makes it read as seas / lakes / rivers /
 * ponds / puddles that all connect:
 *
 *   1. HEIGHT field (./heightfield.ts): domain-warped, tilted fbm.
 *   2. LAKES & SEAS: every cell below a water level is water. The level is a
 *      quantile of the heights, so `waterAmount` is the exact fraction covered.
 *      Big low regions become seas/lakes, small ones ponds/puddles, for free.
 *      Anything placed by this pass is classified `pondMask`.
 *   3. RIVERS (./flow.ts + ./rivers.ts): flow accumulation on a D4 drainage
 *      tree; high-flow cells whose drainage terminates in a lake become
 *      1-cell-wide rivers, then 2x2 fat spots and orphans are thinned away.
 *      Anything placed by this pass is classified `riverMask`.
 *   4. Clean up stray single-cell noise (./cleanup.ts); masks are re-synced.
 *
 * Ponds render with the solid-coast alt template, rivers with the wavy
 * template. Classification is by origin (which pass placed the cell), not by
 * shape, so a 1-wide river merging into a lake keeps its wavy texture right up
 * to the shoreline without being absorbed by the lake's connected component.
 *
 * Writes `ctx.water` / `ctx.blocked` so later stages avoid water.
 */

import { NATURE_WATER_ALT_TILES, NATURE_WATER_TILES, SOLID_TILE } from "../../bountiful-bits";
import { autotileMask } from "../../autotile";
import type { PlacedTile, Stage, WorldCtx } from "../../world";
import { buildHeight, quantile } from "./heightfield";
import { accumulateFlow } from "./flow";
import { markRivers, thinRivers } from "./rivers";
import { removeTinyComponents } from "./cleanup";

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

  const flowField = accumulateFlow(h, cols, rows);
  markRivers(h, flowField, pondMask, water, riverMask, tuning.riverAmount);
  thinRivers(water, riverMask, flowField.flow, cols, rows);

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
