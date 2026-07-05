/**
 * Parks: pockets of dense greenery planted inside a settlement footprint.
 *
 * Whatever wild nature survived inside a town already reads as its gardens;
 * a park goes further — a deliberate grove of trees, bushes and flowers
 * clustered in a disc, so the built-up area keeps a clearly green quarter.
 * Park tiles are emitted on the "nature" layer so they take the nature tint,
 * and their cells are marked blocked so no building lands in the green.
 */

import { NATURE_OBJECTS, type NatureObjectKind, type TileCoord } from "../../bountiful-bits";
import { pick } from "../../rng";
import type { PlacedTile, Town, WorldCtx } from "../../world";
import { PARK_STATUE } from "./catalog";
import { fits, place } from "./placement";

/** Attempts to find an open park centre before giving up. */
const PARK_TRIES = 14;

/** Chance a park is a memorial garden with a statue at its heart. */
const STATUE_CHANCE = 0.4;

/** What grows on a park cell; denser and greener than wild scatter. */
function parkKind(roll: number): NatureObjectKind | null {
  if (roll < 0.4) return "tree";
  if (roll < 0.55) return "bush";
  if (roll < 0.75) return "flower";
  if (roll < 0.85) return "grass";
  return null; // a little open lawn between the plants
}

/**
 * Plant one park inside `town`: pick an open centre at mid-distance from the
 * plaza (parks sit between the square and the town edge), then fill a small
 * disc with greenery. Returns false if no open centre was found.
 */
export function placePark(ctx: WorldCtx, out: PlacedTile[], town: Town): boolean {
  const { cols, rows, tilePx, rng, blocked } = ctx;
  const parkRadius = town.tier === "city" ? 3 : 2;

  for (let t = 0; t < PARK_TRIES; t++) {
    const angle = rng() * Math.PI * 2;
    const dist = (0.35 + rng() * 0.45) * town.radius;
    const px = Math.round(town.cx + Math.cos(angle) * dist);
    const py = Math.round(town.cy + Math.sin(angle) * dist);
    if (px < 0 || px >= cols || py < 0 || py >= rows) continue;
    if (blocked[py * cols + px]) continue;

    // Some parks are memorial gardens: a statue first, greenery around it.
    if (rng() < STATUE_CHANCE && fits(ctx, px, py, PARK_STATUE)) {
      place(ctx, out, px, py, PARK_STATUE);
    }

    for (let dy = -parkRadius; dy <= parkRadius; dy++) {
      for (let dx = -parkRadius; dx <= parkRadius; dx++) {
        if (dx * dx + dy * dy > parkRadius * parkRadius) continue;
        const nx = px + dx;
        const ny = py + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const i = ny * cols + nx;
        if (blocked[i]) continue;

        const kind = parkKind(rng());
        if (!kind) continue;
        const [col, row] = pick<TileCoord>(rng, NATURE_OBJECTS[kind]);
        out.push({ col, row, x: nx * tilePx, y: ny * tilePx, layer: "nature" });
        blocked[i] = 1;
      }
    }
    return true;
  }
  return false;
}
