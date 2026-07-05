/**
 * Farms and waterside boats — what settlements do for a living.
 *
 * FARMS ring the settlement just outside its built-up footprint: a fenced
 * rectangular field with tidy rows of crops (each row one crop variant, like
 * a real planting). Fields are cut OUT of the wild — any forest on the plot
 * is cleared (the renderer replaces those tiles) — so farmland reads as land
 * the settlers won from the woods. Hamlets are basically farmsteads and get
 * two small fields.
 *
 * FARMLAND DISTRICTS — some towns (and the city) additionally grow a large
 * patchwork of adjoining fields on one side, a proper farming belt.
 *
 * BOATS sit on the shoreline water near settlements that were founded by
 * water (site scoring favours shores, so most were) — a couple of moored
 * dinghies make the coast read as a harbour.
 */

import { CIVILIZED_PROPS, NATURE_OBJECTS, type TileCoord } from "../../bountiful-bits";
import { NEI4 } from "../../grid";
import { chance, pick } from "../../rng";
import type { PlacedTile, Town, WorldCtx } from "../../world";
import { claimable } from "./placement";

/** Attempts to seat a field before giving up. */
const FARM_TRIES = 14;

/** Chance a city/town grows a large farmland district on its outskirts. */
export const FARMLAND_CHANCE = 0.55;

/** Fields in a farmland district (beyond the first). */
const FARMLAND_EXTRA_FIELDS = 3;

/**
 * Seat one fenced field with its top-left at (x0,y0): fence rows top and
 * bottom, crop rows between. Fails without side effects if any cell is
 * unclaimable (water/road/structure); wild nature on the plot is cleared.
 */
function seatField(ctx: WorldCtx, out: PlacedTile[], x0: number, y0: number, w: number, h: number): boolean {
  const { cols, rows, tilePx, rng, blocked, structure } = ctx;
  if (x0 < 0 || y0 < 0 || x0 + w > cols || y0 + h > rows) return false;

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!claimable(ctx, (y0 + r) * cols + (x0 + c))) return false;
    }
  }

  for (let r = 0; r < h; r++) {
    const isFence = r === 0 || r === h - 1;
    const rowCrop: TileCoord = pick(rng, NATURE_OBJECTS.crop);
    const fenceTile: TileCoord = pick(rng, CIVILIZED_PROPS.fence);
    for (let c = 0; c < w; c++) {
      const i = (y0 + r) * cols + (x0 + c);
      blocked[i] = 1;
      structure[i] = 1;
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

/** Random field footprint: 4-6 wide, fence + 2-3 crop rows + fence tall. */
function fieldSize(ctx: WorldCtx): [w: number, h: number] {
  return [4 + ((ctx.rng() * 3) | 0), 4 + ((ctx.rng() * 2) | 0)];
}

/** Try to place one fenced crop field on the outskirts of `town`. */
export function placeFarm(ctx: WorldCtx, out: PlacedTile[], town: Town): boolean {
  const { rng } = ctx;
  const [w, h] = fieldSize(ctx);

  for (let t = 0; t < FARM_TRIES; t++) {
    // Outskirts: just beyond the footprint, where the land is still open.
    const angle = rng() * Math.PI * 2;
    const dist = town.radius * (0.9 + rng() * 0.6);
    const x0 = Math.round(town.cx + Math.cos(angle) * dist - w / 2);
    const y0 = Math.round(town.cy + Math.sin(angle) * dist - h / 2);
    if (seatField(ctx, out, x0, y0, w, h)) return true;
  }
  return false;
}

/**
 * Grow a large farmland district: a first field on the outskirts, then more
 * fields packed edge-to-edge around it (sharing fence lines like hedgerows),
 * so one side of the settlement reads as its farming belt.
 */
export function placeFarmland(ctx: WorldCtx, out: PlacedTile[], town: Town): void {
  const { rng } = ctx;

  // Seat the anchor field a little farther out than a lone farm, so the
  // district has room to spread without fighting the built-up core.
  let anchor: { x: number; y: number; w: number; h: number } | null = null;
  for (let t = 0; t < FARM_TRIES && !anchor; t++) {
    const [w, h] = fieldSize(ctx);
    const angle = rng() * Math.PI * 2;
    const dist = town.radius * (1.1 + rng() * 0.5);
    const x0 = Math.round(town.cx + Math.cos(angle) * dist - w / 2);
    const y0 = Math.round(town.cy + Math.sin(angle) * dist - h / 2);
    if (seatField(ctx, out, x0, y0, w, h)) anchor = { x: x0, y: y0, w, h };
  }
  if (!anchor) return;

  // Patchwork outward: each extra field abuts the previous one on a random
  // side, so the fields tile into an irregular quilt.
  let prev = anchor;
  for (let f = 0; f < FARMLAND_EXTRA_FIELDS; f++) {
    const [w, h] = fieldSize(ctx);
    let seated = false;
    for (let t = 0; t < 6 && !seated; t++) {
      const side = (rng() * 4) | 0;
      let x0 = prev.x;
      let y0 = prev.y;
      if (side === 0) x0 = prev.x + prev.w; // east of prev
      else if (side === 1) x0 = prev.x - w; // west
      else if (side === 2) y0 = prev.y + prev.h; // south
      else y0 = prev.y - h; // north
      // Slide along the shared edge for a quilted, offset look.
      if (side < 2) y0 = prev.y + Math.round((rng() - 0.5) * prev.h);
      else x0 = prev.x + Math.round((rng() - 0.5) * prev.w);
      if (seatField(ctx, out, x0, y0, w, h)) {
        prev = { x: x0, y: y0, w, h };
        seated = true;
      }
    }
  }
}

/** Does this settlement grow a farmland district this map? */
export function rollFarmland(ctx: WorldCtx, town: Town): boolean {
  return town.tier !== "hamlet" && chance(ctx.rng, FARMLAND_CHANCE);
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
