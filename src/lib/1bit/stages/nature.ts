/**
 * Stage 2: nature.
 *
 * Places clustered nature features (trees/bushes = forests, flowers/plants =
 * meadows, plus sparse ambient detail) on open ground, skipping any cell already
 * blocked by an earlier stage (water). Clustering comes from fbm noise so the
 * result reads as woods and clearings rather than uniform confetti.
 */

import { NATURE_OBJECTS, type NatureObjectKind } from "../bountiful-bits";
import { fbm2D } from "../noise";
import { pick } from "../rng";
import type { PlacedTile, Stage, WorldCtx } from "../world";

export const natureStage: Stage = {
  name: "nature",
  build(ctx: WorldCtx): PlacedTile[] {
    const { cols, rows, tilePx, rng, tuning, blocked } = ctx;
    const { forestFreq, meadowFreq, treeLine, lushness } = tuning;

    const forest = fbm2D((rng() * 0xffffffff) >>> 0, 3, 0.55);
    const meadow = fbm2D((rng() * 0xffffffff) >>> 0, 2, 0.5);

    const out: PlacedTile[] = [];

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const i = ctx.idx(cx, cy);
        if (blocked[i]) continue;

        const f = forest(cx / forestFreq, cy / forestFreq);
        const m = meadow((cx + 50) / meadowFreq, (cy + 50) / meadowFreq);

        let kind: NatureObjectKind | null = null;

        if (f > treeLine) {
          const core = (f - treeLine) / (1 - treeLine);
          if (rng() < (0.5 + core * 0.4) * lushness) {
            kind = rng() < 0.8 ? "tree" : "bush";
          }
        } else if (f > treeLine - 0.12) {
          if (rng() < 0.18 * lushness) kind = rng() < 0.5 ? "tree" : "bush";
        }

        if (!kind && m > 0.62 && rng() < 0.35 * lushness) {
          kind = rng() < 0.6 ? "flower" : "plant";
        }

        if (!kind) {
          const r = rng() / lushness;
          if (r < 0.015) kind = "grass";
          else if (r < 0.025) kind = "plant";
          else if (r < 0.03) kind = "pebble";
          else if (r < 0.034) kind = "rock";
          else if (r < 0.037) kind = "mushroom";
          else if (r < 0.04) kind = "sparkle";
        }

        if (kind) {
          const [col, row] = pick(rng, NATURE_OBJECTS[kind]);
          out.push({ col, row, x: cx * tilePx, y: cy * tilePx, layer: "nature" });
          blocked[i] = 1;
        }
      }
    }

    return out;
  },
};
