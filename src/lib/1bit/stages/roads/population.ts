/**
 * Population density field: the GLOBAL GOAL that steers highway growth.
 *
 * Following j9liu/roadgen (after Parish & Müller's "Procedural Modeling of
 * Cities"), highways don't route point-to-point — they march outward from the
 * city and continually turn toward where people are. This field is what they
 * sample: a tier-weighted gaussian hill over every settlement (the city the
 * tallest and widest, hamlets barely a bump) plus a whiff of low-frequency
 * noise so open country isn't perfectly flat and rays break ties organically.
 *
 * Water carries zero population (nobody lives in the lake), which keeps ray
 * weights honest along shorelines.
 */

import { fbm2D } from "../../noise";
import { randSeed } from "../../rng";
import type { Town, TownTier, WorldCtx } from "../../world";

/** Peak height per settlement tier (the city dominates the field). */
const TIER_WEIGHT: Record<TownTier, number> = { city: 1, town: 0.6, hamlet: 0.3 };

/** Gaussian spread as a multiple of the settlement's footprint radius. */
const SPREAD = 1.6;

/** Amplitude of the rural noise floor (relative to the city peak of ~1). */
const NOISE_AMP = 0.08;
const NOISE_FREQ = 0.05;

/** Sampleable population density, one value per cell, in [0, ~1.2]. */
export function buildPopulationField(ctx: WorldCtx, towns: Town[]): Float32Array {
  const { cols, rows, water, rng } = ctx;
  const noise = fbm2D(randSeed(rng), 2, 0.5);
  const pop = new Float32Array(cols * rows);

  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cy * cols + cx;
      if (water[i]) continue;
      let p = noise(cx * NOISE_FREQ, cy * NOISE_FREQ) * NOISE_AMP;
      for (const t of towns) {
        const sigma = t.radius * SPREAD;
        const d2 = (cx - t.cx) ** 2 + (cy - t.cy) ** 2;
        p += TIER_WEIGHT[t.tier] * Math.exp(-d2 / (2 * sigma * sigma));
      }
      pop[i] = p;
    }
  }
  return pop;
}
