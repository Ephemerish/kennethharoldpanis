/**
 * Per-cell nature placement rules.
 *
 * Given the cell's forest/meadow noise samples, decide what (if anything)
 * grows there. Three bands:
 *
 *   FOREST  — above the tree line the canopy is dense (mostly trees, some
 *             bushes), with a thinning fringe just below it so woods feather
 *             out instead of ending on a hard contour line.
 *   MEADOW  — high meadow-noise cells outside forests grow flowers/plants.
 *   AMBIENT — everywhere else, sparse ground detail (grass tufts, pebbles,
 *             rocks, the odd mushroom or sparkle) keeps open land alive.
 */

import type { NatureObjectKind } from "../../bountiful-bits";
import type { Rng } from "../../rng";
import type { MapTuning } from "../../world";

/** Width of the thinning band below the tree line. */
const FOREST_FRINGE = 0.12;
/** Meadow noise threshold above which flowers/plants appear. */
const MEADOW_LINE = 0.62;

/**
 * What grows at a cell with forest sample `f` and meadow sample `m`, or null
 * for bare ground. `lushness` scales every spawn probability.
 */
export function decideKind(rng: Rng, tuning: MapTuning, f: number, m: number): NatureObjectKind | null {
  const { treeLine, lushness } = tuning;

  // Dense forest: spawn chance rises toward the noise peak, so cores are
  // thick and edges are ragged. Deep woods hide the odd dead tree and
  // mushroom cluster under the canopy.
  if (f > treeLine) {
    const core = (f - treeLine) / (1 - treeLine);
    if (rng() < (0.5 + core * 0.4) * lushness) {
      const r = rng();
      if (r < 0.72) return "tree";
      if (r < 0.88) return "bush";
      if (r < 0.94) return "deadTree";
      return "mushroom";
    }
    return null;
  }

  // Forest fringe: sparse stragglers and saplings just outside the woods,
  // with stumps where the treeline was cut back.
  if (f > treeLine - FOREST_FRINGE && rng() < 0.18 * lushness) {
    const r = rng();
    if (r < 0.4) return "tree";
    if (r < 0.7) return "bush";
    if (r < 0.9) return "sapling";
    return "stump";
  }

  // Meadows: flower/plant patches on their own noise field.
  if (m > MEADOW_LINE && rng() < 0.35 * lushness) {
    return rng() < 0.6 ? "flower" : "plant";
  }

  // Ambient ground detail, rarest last.
  const r = rng() / lushness;
  if (r < 0.015) return "grass";
  if (r < 0.025) return "plant";
  if (r < 0.03) return "pebble";
  if (r < 0.033) return "debris";
  if (r < 0.036) return "rock";
  if (r < 0.038) return "boulder";
  if (r < 0.04) return "mushroom";
  if (r < 0.042) return "sparkle";
  return null;
}
