/**
 * Stage 2: nature.
 *
 * Places clustered nature features (trees/bushes = forests, flowers/plants =
 * meadows, plus sparse ambient detail) on open ground, skipping any cell
 * already blocked by an earlier stage (water). Clustering comes from fbm noise
 * so the result reads as woods and clearings rather than uniform confetti;
 * the per-cell rules live in ./kinds.ts.
 *
 * Settlements are founded FIRST (planTowns, shared with the road stage) and
 * nothing wild grows inside a footprint: the settlers cleared that land, so
 * street grids run unbroken and buildings have ground to stand on. Greenery
 * inside town walls comes back deliberately, as the civilization stage's parks
 * and gardens.
 */

import { NATURE_OBJECTS, type TileCoord } from "../../bountiful-bits";
import { fbm2D } from "../../noise";
import { pick, randSeed } from "../../rng";
import { townAt, type PlacedTile, type Stage, type WorldCtx } from "../../world";
import { planTowns } from "../roads/towns";
import { decideKind } from "./kinds";

export const natureStage: Stage = {
  name: "nature",
  build(ctx: WorldCtx): PlacedTile[] {
    const { cols, rows, tilePx, rng, tuning, blocked } = ctx;
    const { forestFreq, meadowFreq } = tuning;

    // Claim settlement land before anything grows (recorded on ctx.towns for
    // the road and civilization stages).
    const towns = ctx.towns.length > 0 ? ctx.towns : planTowns(ctx);

    const forest = fbm2D(randSeed(rng), 3, 0.55);
    const meadow = fbm2D(randSeed(rng), 2, 0.5);

    const out: PlacedTile[] = [];

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const i = ctx.idx(cx, cy);
        if (blocked[i]) continue;
        if (townAt(towns, cx, cy)) continue; // settlement land stays clear

        const f = forest(cx / forestFreq, cy / forestFreq);
        const m = meadow((cx + 50) / meadowFreq, (cy + 50) / meadowFreq);

        const kind = decideKind(rng, tuning, f, m);
        if (kind) {
          const [col, row] = pick<TileCoord>(rng, NATURE_OBJECTS[kind]);
          out.push({ col, row, x: cx * tilePx, y: cy * tilePx, layer: "nature" });
          blocked[i] = 1;
        }
      }
    }

    return out;
  },
};
