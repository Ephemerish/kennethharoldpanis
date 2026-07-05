/**
 * Tiny seeded PRNG + sampling helpers for deterministic procedural generation.
 *
 * `mulberry32` is a fast, well-distributed 32-bit generator. Given the same
 * seed it always produces the same sequence, so a scatter layout is stable
 * across reloads and can be reproduced/tweaked via a single `seed` value.
 */

/** A pseudo-random generator: returns a float in [0, 1). */
export type Rng = () => number;

/** mulberry32 — deterministic PRNG seeded by a 32-bit integer. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string to a 32-bit seed (FNV-1a), so seeds can be human-readable. */
export function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Build an Rng from a number or string seed. */
export function makeRng(seed: number | string): Rng {
  return mulberry32(typeof seed === "number" ? seed >>> 0 : hashSeed(seed));
}

/** Draw a fresh 32-bit integer seed (e.g. to seed a noise field). */
export function randSeed(rng: Rng): number {
  return (rng() * 0xffffffff) >>> 0;
}

/** Random float in [min, max). */
export function randRange(rng: Rng, min: number, max: number): number {
  return min + (max - min) * rng();
}

/** Random integer in [min, max] (inclusive). */
export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Return true with probability `p` (0..1). */
export function chance(rng: Rng, p: number): boolean {
  return rng() < p;
}

/** Pick a uniformly random element from a non-empty array. */
export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/**
 * Pick an element weighted by `weightOf`. Entries with weight <= 0 are skipped.
 * Returns `undefined` only if every weight is <= 0.
 */
export function pickWeighted<T>(
  rng: Rng,
  items: readonly T[],
  weightOf: (item: T) => number,
): T | undefined {
  let total = 0;
  for (const item of items) total += Math.max(0, weightOf(item));
  if (total <= 0) return undefined;

  let roll = rng() * total;
  for (const item of items) {
    roll -= Math.max(0, weightOf(item));
    if (roll < 0) return item;
  }
  return items[items.length - 1];
}
