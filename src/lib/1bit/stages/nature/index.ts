/**
 * Stage 2: nature.
 *
 * Places clustered nature features (trees/bushes = forests, flowers/plants =
 * meadows, plus sparse ambient detail) on open ground, skipping any cell
 * already blocked by an earlier stage (water). Clustering comes from fbm noise
 * so the result reads as woods and clearings rather than uniform confetti;
 * the per-cell rules live in ./kinds.ts.
 *
 * Settlements are founded FIRST (planTowns, shared with the road stage) but
 * the wild grows over their land anyway: the later stages CLEAR it as they
 * build — roads cut lanes through the woods, buildings and farms replace the
 * trees under their footprints (the renderer swaps the tiles out as each
 * stage reveals) — so watching the build reads as civilization carving into
 * wilderness rather than filling pre-cleared lots.
 */

import { NATURE_OBJECTS, type TileCoord } from "../../bountiful-bits";
import { fbm2D } from "../../noise";
import { pick, randSeed } from "../../rng";
import type { PlacedTile, Stage, WorldCtx } from "../../world";
import { planTowns } from "../roads/towns";
import { decideKind } from "./kinds";

export const natureStage: Stage = {
  name: "nature",
  build(ctx: WorldCtx): PlacedTile[] {
    const { cols, rows, tilePx, rng, tuning, blocked } = ctx;
    const { forestFreq, meadowFreq } = tuning;

    // Found the settlements now (recorded on ctx.towns for the road and
    // civilization stages) — but let the wild overgrow their land; building
    // clears it later.
    if (ctx.towns.length === 0) planTowns(ctx);

    const forest = fbm2D(randSeed(rng), 3, 0.55);
    const meadow = fbm2D(randSeed(rng), 2, 0.5);

    const out: PlacedTile[] = [];

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const i = ctx.idx(cx, cy);
        if (blocked[i]) continue;

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
