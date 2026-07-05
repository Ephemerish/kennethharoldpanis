/**
 * Turning the road mask into tiles: paved inside settlements, dirt outside.
 *
 *   - PLAZAS: cities and towns get a 3x3 cobbled square from the Civilized
 *     sheet stamped at their centre — the town square roads dead-end into.
 *   - STREETS: road cells inside a settlement footprint render as a paving
 *     swatch (one style per map, picked at random) so towns read as built-up.
 *   - TRAILS: road cells in open country autotile with the speckled DIRT
 *     template, so 1-wide paths read as worn natural footpaths (cf. rivers
 *     use the wavy water skin).
 *
 * All three passes emit on the "road" layer; both dirt autotiling and street
 * classification run against the FULL road mask, so the trail/street seam at a
 * town boundary stays continuous.
 */

import {
  CIVILIZED_PAVING_TILES,
  CIVILIZED_PROPS,
  CIVILIZED_ROADS,
  DIRT_SOLID_TILE,
  NATURE_DIRT_TILES,
  type TileCoord,
} from "../../bountiful-bits";
import { autotileMask } from "../../autotile";
import { pick } from "../../rng";
import { townAt, type PlacedTile, type Town, type WorldCtx } from "../../world";

/**
 * Stamp the 3x3 cobbled plaza centred on a settlement. Marks its cells as
 * road (so routes merge into it and streets connect) and blocked (so no
 * building lands on the square).
 */
export function stampPlaza(ctx: WorldCtx, out: PlacedTile[], town: Town, plaza: Uint8Array): void {
  const { cols, tilePx, road, blocked } = ctx;
  // Solid style: filled slab square with seams. (The outline style reads as an
  // ornamental garden frame, not a paved square — keep it for special sites.)
  const rect = CIVILIZED_ROADS.solid.plaza;
  const left = town.cx - 1;
  const top = town.cy - 1;
  for (let r = 0; r < rect.h; r++) {
    for (let c = 0; c < rect.w; c++) {
      const i = (top + r) * cols + (left + c);
      road[i] = 1;
      blocked[i] = 1;
      plaza[i] = 1;
      out.push({
        col: rect.col + c,
        row: rect.row + r,
        x: (left + c) * tilePx,
        y: (top + r) * tilePx,
        layer: "road",
        sheet: "civilized",
      });
    }
  }
}

/**
 * Render every road cell (except plaza cells, which already have their own
 * tiles): plank bridges over water, paving swatches inside settlements,
 * autotiled dirt in the open.
 */
export function renderRoads(ctx: WorldCtx, out: PlacedTile[], plaza: Uint8Array): void {
  const { cols, rows, tilePx, rng, road, water, towns } = ctx;
  const n = cols * rows;

  const paving: TileCoord = pick(rng, CIVILIZED_PAVING_TILES);
  const rural = new Uint8Array(n);
  const streets: number[] = [];
  const bridges: number[] = [];

  for (let i = 0; i < n; i++) {
    if (!road[i] || plaza[i]) continue;
    const cx = i % cols;
    const cy = (i / cols) | 0;
    const town = water[i] ? null : townAt(towns, cx, cy);
    if (water[i]) bridges.push(i);
    // Hamlets keep dirt lanes — brick paving only where there's a plaza.
    else if (town && town.tier !== "hamlet") streets.push(i);
    else rural[i] = 1;
  }

  // Dirt trails: autotile against the FULL road mask (renderMask = rural) so
  // the coast shapes stay correct where a trail meets a street or a bridge.
  out.push(...autotileMask(road, cols, rows, tilePx, NATURE_DIRT_TILES, "road", DIRT_SOLID_TILE, rural));

  for (const i of streets) {
    out.push({
      col: paving[0],
      row: paving[1],
      x: (i % cols) * tilePx,
      y: ((i / cols) | 0) * tilePx,
      layer: "road",
      sheet: "civilized",
    });
  }

  // Bridges: the crossing direction comes from where the road continues —
  // horizontal crossings get plank boardwalk tiles, vertical ones the runged
  // ladder tile (rails + rungs read as a walkway from above). Drawn over the
  // water tile, whose texture shows through the gaps.
  for (const i of bridges) {
    const cx = i % cols;
    const cy = (i / cols) | 0;
    const horizontal = (cx > 0 && road[i - 1] === 1) || (cx < cols - 1 && road[i + 1] === 1);
    const tile: TileCoord = horizontal ? pick(rng, CIVILIZED_PROPS.bridge) : CIVILIZED_PROPS.ladder[0];
    out.push({
      col: tile[0],
      row: tile[1],
      x: cx * tilePx,
      y: cy * tilePx,
      layer: "road",
      sheet: "civilized",
    });
  }
}
