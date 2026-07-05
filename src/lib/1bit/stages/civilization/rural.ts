/**
 * Rural dressing: the country between settlements.
 *
 * WAYPOINT POIs — the road stage routes trails through wild-country waypoints
 * (`ctx.waypoints`); this pass puts something at each one, so every trail
 * leads somewhere: a wayside shrine ringed with flowers, a lone statue, a
 * small graveyard, or a traveller's camp (tent + cook pot + chest).
 *
 * SIGNS — sparse shaped signposts along the trails between them.
 */

import {
  CIVILIZED_LANDMARKS,
  CIVILIZED_PROPS,
  CIVILIZED_STATUES,
  NATURE_OBJECTS,
  type TileCoord,
  type TileRect,
} from "../../bountiful-bits";
import { pick } from "../../rng";
import { townAt, type PlacedTile, type WorldCtx } from "../../world";
import { GRAVE_TILES, RURAL_SIGNS } from "./catalog";
import { fits, place } from "./placement";

function rect1([col, row]: TileCoord): TileRect {
  return { col, row, w: 1, h: 1 };
}

/** Find an open seat for `rect` within `spread` cells of `(cx, cy)`. */
function seatNear(
  ctx: WorldCtx,
  cx: number,
  cy: number,
  rect: TileRect,
  spread: number,
): [number, number] | null {
  const { rng } = ctx;
  for (let t = 0; t < 12; t++) {
    const x = cx + Math.round((rng() - 0.5) * 2 * spread);
    const y = cy + Math.round((rng() - 0.5) * 2 * spread);
    if (fits(ctx, x, y, rect)) return [x, y];
  }
  return null;
}

/** Scatter a few nature objects of `kind` around a point (dressing). */
function dress(
  ctx: WorldCtx,
  out: PlacedTile[],
  cx: number,
  cy: number,
  kind: keyof typeof NATURE_OBJECTS,
  count: number,
): void {
  const { cols, rows, tilePx, rng, blocked } = ctx;
  for (let t = 0; t < count * 3 && count > 0; t++) {
    const x = cx + Math.round((rng() - 0.5) * 5);
    const y = cy + Math.round((rng() - 0.5) * 5);
    if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
    const i = y * cols + x;
    if (blocked[i]) continue;
    const [col, row] = pick<TileCoord>(rng, NATURE_OBJECTS[kind]);
    out.push({ col, row, x: x * tilePx, y: y * tilePx, layer: "nature" });
    blocked[i] = 1;
    count--;
  }
}

/** Put a point of interest at every rural waypoint the trails pass through. */
export function decorateWaypoints(ctx: WorldCtx, out: PlacedTile[]): void {
  const { cols, rng } = ctx;

  for (const wp of ctx.waypoints) {
    const cx = wp % cols;
    const cy = (wp / cols) | 0;
    const roll = rng();

    if (roll < 0.3) {
      // Wayside shrine in a flower ring.
      const seat = seatNear(ctx, cx, cy, CIVILIZED_LANDMARKS.shrine, 2);
      if (seat) {
        place(ctx, out, seat[0], seat[1], CIVILIZED_LANDMARKS.shrine);
        dress(ctx, out, cx, cy, "flower", 4);
      }
    } else if (roll < 0.5) {
      // A lone statue where paths meet, glinting.
      const seat = seatNear(ctx, cx, cy, CIVILIZED_STATUES.large, 2);
      if (seat) {
        place(ctx, out, seat[0], seat[1], CIVILIZED_STATUES.large);
        dress(ctx, out, cx, cy, "sparkle", 2);
      }
    } else if (roll < 0.75) {
      // Small graveyard: a loose blob of grave markers.
      let planted = 0;
      for (let t = 0; t < 15 && planted < 5; t++) {
        const grave = pick(rng, GRAVE_TILES);
        const seat = seatNear(ctx, cx, cy, grave, 3);
        if (seat) {
          place(ctx, out, seat[0], seat[1], grave);
          planted++;
        }
      }
      if (planted > 0) dress(ctx, out, cx, cy, "deadTree", 1);
    } else {
      // Traveller's camp: tent, cook pot, stashed chest.
      const pieces: TileRect[] = [
        rect1(pick(rng, CIVILIZED_PROPS.tent)),
        rect1(CIVILIZED_PROPS.cookPot[0]),
        rect1(CIVILIZED_PROPS.chest[0]),
      ];
      for (const piece of pieces) {
        const seat = seatNear(ctx, cx, cy, piece, 2);
        if (seat) place(ctx, out, seat[0], seat[1], piece);
      }
    }
  }
}

/**
 * Sparse signposts along rural trails. `sites` are open roadside cells in
 * random order; in-town cells are skipped (streets get their own decor).
 */
export function placeSigns(ctx: WorldCtx, out: PlacedTile[], sites: number[]): void {
  const { cols, rows, rng, blocked, towns } = ctx;
  let budget = Math.max(2, Math.round((cols * rows) / 1600));

  for (const site of sites) {
    if (budget <= 0) break;
    if (blocked[site]) continue;
    const cx = site % cols;
    const cy = (site / cols) | 0;
    if (townAt(towns, cx, cy)) continue;
    if (rng() > 0.3) continue; // skip most spots so signs stay sparse
    const sign = pick(rng, RURAL_SIGNS);
    if (fits(ctx, cx, cy, sign)) {
      place(ctx, out, cx, cy, sign);
      budget--;
    }
  }
}
