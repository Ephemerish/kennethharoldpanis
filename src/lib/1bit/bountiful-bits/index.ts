/**
 * Bountiful Bits atlases.
 *
 * One module per sheet (all pure data, no renderer dependency):
 *   - nature.ts     terrain (water/dirt blob autotiles) + nature objects
 *   - civilized.ts  roads, paving, building structures, props
 *   - shared.ts     common types + frame helpers
 *
 * Reminder: the pack has no ground tile. Supply a flat ground colour and draw
 * these on top.
 */

export * from "./shared";
export * from "./nature";
export * from "./civilized";
