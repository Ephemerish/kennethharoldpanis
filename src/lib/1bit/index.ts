/**
 * 1-bit procedural, live-building map background toolkit.
 *
 * Structure:
 *   bountiful-bits/  atlases (one module per sheet) + shared types
 *   noise.ts         seeded value noise / fbm
 *   rng.ts           seeded PRNG + sampling helpers
 *   autotile.ts      best-match autotiler (water, later roads)
 *   world.ts         shared world model + Stage interface
 *   stages/          one file per generation stage, run sequentially
 *   pixiBackground.ts renderer (pulls in PixiJS)
 *
 * The renderer pulls in PixiJS, so it's intentionally NOT re-exported here to
 * keep this barrel runtime-free. Load it lazily from the call site:
 *
 *   const { createBackground } = await import("./lib/1bit/pixiBackground");
 *
 * Only its *types* are re-exported below (erased at build time).
 */

export * from "./bountiful-bits";
export * from "./rng";
export * from "./noise";
export * from "./autotile";
export * from "./world";
export * from "./stages";
export type { BackgroundOptions, BackgroundHandle } from "./pixiBackground";
