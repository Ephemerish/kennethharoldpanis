/**
 * Farms and waterside boats — what settlements do for a living.
 *
 * FARMS ring the settlement just outside its built-up footprint: a fenced
 * rectangular field with tidy rows of crops (each row one crop variant, like
 * a real planting). Hamlets are basically farmsteads and get two.
 *
 * BOATS sit on the shoreline water near settlements that were founded by
 * water (site scoring favours shores, so most were) — a couple of moored
 * dinghies make the coast read as a harbour.
 */

import { CIVILIZED_PROPS, NATURE_OBJECTS, type TileCoord } from "../../bountiful-bits";
import { NEI4 } from "../../grid";
import { pick } from "../../rng";
import type { PlacedTile, Town, WorldCtx } from "../../world";

/** Attempts to seat a field before giving up. */
const FARM_TRIES = 14;

/** Try to place one fenced crop field on the outskirts of `town`. */
export function placeFarm(ctx: WorldCtx, out: PlacedTile[], town: Town): boolean {
  const { cols, rows, tilePx, rng, blocked } = ctx;
  const w = 4 + ((rng() * 3) | 0); // 4-6 cells wide
  const h = 4; // fence, two crop rows, fence

  for (let t = 0; t < FARM_TRIES; t++) {
    // Outskirts: just beyond the footprint, where the land is still open.
    const angle = rng() * Math.PI * 2;
    const dist = town.radius * (0.9 + rng() * 0.6);
    const x0 = Math.round(town.cx + Math.cos(angle) * dist - w / 2);
    const y0 = Math.round(town.cy + Math.sin(angle) * dist - h / 2);
    if (x0 < 0 || y0 < 0 || x0 + w > cols || y0 + h > rows) continue;

    let clear = true;
    for (let r = 0; r < h && clear; r++) {
      for (let c = 0; c < w; c++) {
        if (blocked[(y0 + r) * cols + (x0 + c)]) {
          clear = false;
          break;
        }
      }
    }
    if (!clear) continue;

    // Fence along the top and bottom edges (rail segments), crops between.
    for (let r = 0; r < h; r++) {
      const isFence = r === 0 || r === h - 1;
      const rowCrop: TileCoord = pick(rng, NATURE_OBJECTS.crop);
      const fenceTile: TileCoord = pick(rng, CIVILIZED_PROPS.fence);
      for (let c = 0; c < w; c++) {
        const i = (y0 + r) * cols + (x0 + c);
        blocked[i] = 1;
        if (isFence) {
          out.push({
            col: fenceTile[0],
            row: fenceTile[1],
            x: (x0 + c) * tilePx,
            y: (y0 + r) * tilePx,
            layer: "civ",
            sheet: "civilized",
          });
        } else {
          out.push({
            col: rowCrop[0],
            row: rowCrop[1],
            x: (x0 + c) * tilePx,
            y: (y0 + r) * tilePx,
            layer: "nature",
          });
        }
      }
    }
    return true;
  }
  return false;
}

/** Moor a boat or two on shoreline water near a waterside settlement. */
export function placeBoats(ctx: WorldCtx, out: PlacedTile[], town: Town): void {
  const { cols, rows, tilePx, rng, water } = ctx;
  const reach = town.radius + 3;
  const want = town.tier === "city" ? 2 : 1;

  // Shoreline cells: water with at least one dry 4-neighbour.
  const shore: number[] = [];
  for (let dy = -reach; dy <= reach; dy++) {
    for (let dx = -reach; dx <= reach; dx++) {
      const cx = town.cx + dx;
      const cy = town.cy + dy;
      if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) continue;
      const i = cy * cols + cx;
      if (!water[i]) continue;
      for (const [nx, ny] of NEI4) {
        const ax = cx + nx;
        const ay = cy + ny;
        if (ax < 0 || ax >= cols || ay < 0 || ay >= rows) continue;
        if (!water[ay * cols + ax]) {
          shore.push(i);
          break;
        }
      }
    }
  }
  if (shore.length === 0) return;

  for (let b = 0; b < want; b++) {
    const i = shore[(rng() * shore.length) | 0];
    const boat: TileCoord = pick(rng, CIVILIZED_PROPS.boat);
    out.push({
      col: boat[0],
      row: boat[1],
      x: (i % cols) * tilePx,
      y: ((i / cols) | 0) * tilePx,
      layer: "civ",
      sheet: "civilized",
    });
  }
}
