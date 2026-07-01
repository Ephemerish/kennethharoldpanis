/**
 * Seeded 2D value noise + fractal Brownian motion (fbm).
 *
 * Value noise gives smooth, spatially-coherent fields: nearby cells get similar
 * values, distant ones vary. That coherence is what turns random placement into
 * recognisable structure, clusters of trees become forests, high patches become
 * meadows, instead of uniform speckle. fbm layers a few octaves for a more
 * organic, less grid-aligned result.
 *
 * Deterministic: a given seed always yields the same field.
 */

export type Noise2D = (x: number, y: number) => number;

/** Hash a lattice point (ix, iy) to a stable value in [0, 1). */
function latticeHash(seed: number, ix: number, iy: number): number {
  let h = (seed ^ Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smoothstep easing for interpolation between lattice points. */
function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** A single octave of bilinearly-interpolated value noise, output in [0, 1). */
export function valueNoise2D(seed: number): Noise2D {
  return (x, y) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const xf = x - x0;
    const yf = y - y0;

    const v00 = latticeHash(seed, x0, y0);
    const v10 = latticeHash(seed, x0 + 1, y0);
    const v01 = latticeHash(seed, x0, y0 + 1);
    const v11 = latticeHash(seed, x0 + 1, y0 + 1);

    const u = smooth(xf);
    const v = smooth(yf);
    const top = v00 * (1 - u) + v10 * u;
    const bottom = v01 * (1 - u) + v11 * u;
    return top * (1 - v) + bottom * v;
  };
}

/**
 * Fractal Brownian motion: sum several octaves of value noise at increasing
 * frequency and decreasing amplitude. Result is normalised to [0, 1).
 */
export function fbm2D(seed: number, octaves = 3, persistence = 0.5): Noise2D {
  // Give each octave its own decorrelated lattice.
  const layers = Array.from({ length: octaves }, (_, i) =>
    valueNoise2D((seed + i * 0x9e3779b1) | 0),
  );
  return (x, y) => {
    let total = 0;
    let amp = 1;
    let freq = 1;
    let norm = 0;
    for (let i = 0; i < octaves; i++) {
      total += layers[i](x * freq, y * freq) * amp;
      norm += amp;
      amp *= persistence;
      freq *= 2;
    }
    return total / norm;
  };
}
