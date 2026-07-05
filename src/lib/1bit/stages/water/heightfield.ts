/**
 * Terrain height for the water stage.
 *
 * Multi-octave fbm, domain-warped (sample coords are themselves offset by
 * noise) so basins and ridges are organic rather than round, plus a gentle
 * random tilt that biases one side lower so a sea/coast can form.
 */

import { fbm2D } from "../../noise";
import { randSeed } from "../../rng";
import type { WorldCtx } from "../../world";

const HEIGHT_FREQ = 0.065; // lattice period ~15 cells -> a few basins across
const WARP_FREQ = 0.11;
const WARP_AMOUNT = 11; // cells of domain-warp displacement (more organic coasts)
const TILT = 0.22; // gentle overall slope (avoids a hard straight coastline)

/** Domain-warped, tilted fbm height field, normalised to 0..1. */
export function buildHeight(ctx: WorldCtx): Float32Array {
  const { cols, rows, rng } = ctx;
  const base = fbm2D(randSeed(rng), 5, 0.5);
  const warpX = fbm2D(randSeed(rng), 3, 0.5);
  const warpY = fbm2D(randSeed(rng), 3, 0.5);

  const tiltAngle = rng() * Math.PI * 2;
  const tx = Math.cos(tiltAngle);
  const ty = Math.sin(tiltAngle);

  const h = new Float32Array(cols * rows);
  let min = Infinity;
  let max = -Infinity;
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const wx = (warpX(cx * WARP_FREQ, cy * WARP_FREQ) - 0.5) * WARP_AMOUNT;
      const wy = (warpY(cx * WARP_FREQ, cy * WARP_FREQ) - 0.5) * WARP_AMOUNT;
      let v = base((cx + wx) * HEIGHT_FREQ, (cy + wy) * HEIGHT_FREQ);
      v += ((cx / cols - 0.5) * tx + (cy / rows - 0.5) * ty) * TILT;
      const i = cy * cols + cx;
      h[i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const span = max - min || 1;
  for (let i = 0; i < h.length; i++) h[i] = (h[i] - min) / span;
  return h;
}

/** Height quantile: the level below which `frac` of cells lie. */
export function quantile(h: Float32Array, frac: number): number {
  const sorted = Float32Array.from(h).sort();
  return sorted[Math.min(sorted.length - 1, Math.floor(frac * sorted.length))];
}
