/**
 * Parks: pockets of dense greenery preserved inside a settlement footprint.
 *
 * With wild nature overgrowing settlement land (it's cleared piecemeal by
 * streets and buildings), a park is the quarter the settlers chose to KEEP:
 * existing trees inside the disc are claimed as structure so no building ever
 * clears them, and open spots are planted denser with bushes and flowers.
 * Park tiles are emitted on the "nature" layer so they take the nature tint.
 */

import { NATURE_OBJECTS, type NatureObjectKind, type TileCoord } from "../../bountiful-bits";
import { pick } from "../../rng";
import type { PlacedTile, Town, WorldCtx } from "../../world";
import { PARK_STATUE } from "./catalog";
import { claimable, fits, place } from "./placement";

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
 * Plant one park inside `town`: pick a claimable centre at mid-distance from
 * the town centre (parks sit between the core and the town edge), then claim
 * a small disc of greenery. Returns false if no centre was found.
 */
export function placePark(ctx: WorldCtx, out: PlacedTile[], town: Town): boolean {
  const { cols, rows, tilePx, rng, blocked, structure } = ctx;
  const parkRadius = town.tier === "city" ? 3 : 2;

  for (let t = 0; t < PARK_TRIES; t++) {
    const angle = rng() * Math.PI * 2;
    const dist = (0.35 + rng() * 0.45) * town.radius;
    const px = Math.round(town.cx + Math.cos(angle) * dist);
    const py = Math.round(town.cy + Math.sin(angle) * dist);
    if (px < 0 || px >= cols || py < 0 || py >= rows) continue;
    if (!claimable(ctx, py * cols + px)) continue;

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
        if (!claimable(ctx, i)) continue;

        // A wild tree already here becomes part of the park: claim it so no
        // building clears it, and keep its existing tile.
        if (blocked[i]) {
          structure[i] = 1;
          continue;
        }

        const kind = parkKind(rng());
        if (!kind) continue;
        const [col, row] = pick<TileCoord>(rng, NATURE_OBJECTS[kind]);
        out.push({ col, row, x: nx * tilePx, y: ny * tilePx, layer: "nature" });
        blocked[i] = 1;
        structure[i] = 1;
      }
    }
    return true;
  }
  return false;
}
