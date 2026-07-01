/**
 * Atlas for the Bountiful Bits "Nature" sheet (Natural-no-bg.png, 20x22 tiles).
 *
 * Layout (verified by slicing the sheet):
 *   - Left half (cols 0-13): terrain autotile "blob" templates, a body-of-water
 *     terrain and a dirt/path terrain, each in a "plain" (solid, rows 1-7) and
 *     "textured" (speckled, rows 8-14) skin, plus a bordered pool. These are
 *     autotile sources, wiring them up (bitmask -> tile) is a later step; for now
 *     we record their regions.
 *   - Right half (cols 14-19): a big library of single-tile objects (trees,
 *     bushes, flowers, plants, grass, mushrooms, rocks, clouds, crops, ...).
 *
 * NOTE: there is no grass/ground tile here. The ground is a flat colour we
 * supply at render time; this sheet provides terrain accents and props.
 *
 * Tileset: https://v3x3d.itch.io/bountiful-bits (Bountiful Bits 10x10 v3.1)
 */

import type { SheetMeta, TileCoord, TileRect } from "./shared";

export const NATURE_SHEET: SheetMeta = {
  url: "/tileset/Bountiful-Bits-10x10-v-3.1/1-Bit/no-background/Natural-no-bg.png",
  cols: 20,
  rows: 22,
  tileSize: 10,
};

/**
 * Terrain autotile source regions (blob templates). Each is a self-contained
 * autotile set; a bitmask->tile mapping over one of these yields seamless
 * coasts/edges. Labels are best-guess and easy to swap.
 */
export const NATURE_TERRAIN: Record<string, TileRect> = {
  /** Body of water, plain skin. */
  water: { col: 1, row: 1, w: 6, h: 7 },
  /** Body of water, alternate (compact) layout. */
  waterAlt: { col: 8, row: 1, w: 6, h: 7 },
  /** Dirt / path, speckled skin. */
  dirt: { col: 1, row: 8, w: 6, h: 7 },
  /** Dirt / path, alternate (compact) layout. */
  dirtAlt: { col: 8, row: 8, w: 6, h: 7 },
  /** A bordered pool / plot frame. */
  pool: { col: 8, row: 16, w: 6, h: 5 },
};

/**
 * Single-tile objects, grouped by kind. Interchangeable variants within a group.
 * Coordinates are `[col, row]`.
 */
export const NATURE_OBJECTS = {
  /** Trees (pine + bare + small). */
  tree: [
    [18, 1],
    [17, 1],
    [15, 16],
    [16, 16],
    [15, 18],
  ],
  /** Shrubs / bushes. */
  bush: [
    [15, 1],
    [16, 1],
    [19, 1],
    [17, 7],
    [18, 7],
    [19, 7],
  ],
  /** Flowers. */
  flower: [
    [15, 5],
    [16, 5],
    [17, 5],
    [16, 2],
    [17, 2],
  ],
  /** Seedlings, sprouts, small plants. */
  plant: [
    [15, 2],
    [15, 3],
    [16, 3],
    [17, 3],
    [18, 3],
    [19, 3],
    [19, 6],
    [18, 5],
    [19, 5],
  ],
  /** Tall grass tufts. */
  grass: [
    [15, 6],
    [16, 6],
    [17, 6],
    [18, 6],
  ],
  /** Mushrooms. */
  mushroom: [
    [15, 7],
    [16, 7],
    [17, 16],
  ],
  /** Rocks / boulders. */
  rock: [
    [16, 11],
    [16, 12],
  ],
  /** Tiny pebbles / specks, ambient ground detail. */
  pebble: [
    [15, 4],
    [19, 4],
    [16, 4],
    [17, 4],
    [18, 4],
    [18, 2],
    [15, 9],
    [16, 9],
    [15, 11],
    [15, 12],
    [16, 13],
  ],
  /** Sparkles / stars. */
  sparkle: [
    [17, 19],
    [18, 12],
    [15, 19],
    [16, 19],
  ],
  /** Clouds. */
  cloud: [
    [18, 9],
    [18, 10],
    [18, 11],
    [18, 13],
    [18, 14],
    [18, 15],
    [18, 16],
    [18, 17],
  ],
  /** Crops / pumpkins / fruit. */
  crop: [
    [16, 17],
    [17, 17],
    [16, 18],
    [17, 18],
  ],
} as const satisfies Record<string, TileCoord[]>;

export type NatureObjectKind = keyof typeof NATURE_OBJECTS;

/**
 * A fully-solid (100% opaque, no speckle) tile. Used to fill the interior of
 * water/terrain bodies so the inside is clean and only the coasts are textured.
 */
export const SOLID_TILE: TileCoord = [11, 5];

/**
 * Water autotile tiles, classified by shape for best-match autotiling.
 *
 * Each entry describes one tile from the water blob template:
 *   `tile`    [col, row] on the sheet
 *   `edges`   [N, E, S, W] — 1 where the tile's water reaches that edge (i.e.
 *             water continues that direction), 0 where it's a coast.
 *   `corners` [NW, NE, SE, SW] — 1 where the tile fills that corner.
 *
 * The autotiler (see ../autotile.ts) computes the desired signature for each map
 * cell from its water neighbours and picks the tile with the closest match, so
 * it produces good coasts without a hand-built 47-blob mask table. Verified by
 * rendering test ponds/rivers/puddles.
 */
export interface WaterTileDesc {
  tile: TileCoord;
  edges: [n: number, e: number, s: number, w: number];
  corners: [nw: number, ne: number, se: number, sw: number];
}

/**
 * Textured water tiles (from the left `water` template, cols 1-6 / rows 1-7).
 * These have wavy, notched coasts that read as flowing water — used for RIVERS.
 */
export const NATURE_WATER_TILES: WaterTileDesc[] = [
  { tile: [4, 3], edges: [1, 1, 1, 1], corners: [1, 1, 1, 1] }, // interior fill
  { tile: [3, 3], edges: [1, 1, 1, 0], corners: [1, 1, 1, 1] }, // coast W
  { tile: [5, 3], edges: [1, 0, 1, 1], corners: [1, 1, 1, 1] }, // coast E
  { tile: [4, 2], edges: [1, 0, 1, 0], corners: [1, 1, 1, 1] }, // vertical (coasts E+W)
  { tile: [1, 2], edges: [0, 1, 0, 1], corners: [1, 1, 1, 1] }, // horizontal (coasts N+S)
  { tile: [2, 5], edges: [0, 1, 1, 0], corners: [0, 1, 1, 1] }, // corner NW (coasts N+W)
  { tile: [3, 2], edges: [0, 0, 1, 1], corners: [1, 0, 1, 1] }, // corner NE (coasts N+E)
  { tile: [6, 3], edges: [1, 0, 0, 1], corners: [1, 1, 0, 1] }, // corner SE (coasts S+E)
  { tile: [5, 6], edges: [1, 1, 0, 0], corners: [1, 1, 1, 0] }, // corner SW (coasts S+W)
  { tile: [6, 6], edges: [0, 1, 0, 1], corners: [1, 1, 1, 0] }, // horizontal variant
  { tile: [1, 3], edges: [0, 1, 0, 1], corners: [1, 1, 1, 0] }, // horizontal variant
  { tile: [3, 7], edges: [1, 0, 1, 0], corners: [1, 1, 0, 1] }, // vertical variant
  { tile: [6, 1], edges: [1, 0, 1, 0], corners: [1, 1, 1, 1] }, // vertical variant
  { tile: [2, 2], edges: [0, 1, 0, 1], corners: [1, 0, 1, 1] }, // horizontal variant
  { tile: [6, 2], edges: [1, 0, 1, 0], corners: [1, 1, 0, 1] }, // vertical variant
  { tile: [5, 1], edges: [1, 0, 1, 0], corners: [0, 1, 1, 1] }, // vertical variant
];

/**
 * Solid-coast water tiles (from the right `waterAlt` template, cols 8-13 / rows
 * 1-7). These have clean, fully-filled coasts with no speckle — used for still
 * bodies (ponds, lakes, seas) where the edge should read as a solid shoreline,
 * not a river bank. Every entry's `edges` was verified by pixel-sampling the
 * atlas: for each tile we counted filled alpha pixels along its N/E/S/W edge
 * strips and required >=5/10 for a "1" (water reaches that edge).
 *
 * For each straight coast we keep only the "clean" variant — the one whose
 * three non-coast edges are 100% filled with water pixels. Other variants in
 * the alt region look similar but have extra corner notches on their WATER
 * edges (not just the shore edge), which create visible gaps against the
 * adjacent interior tile. Since the autotiler picks the first-matching tile on
 * ties, listing only the clean variant guarantees it always wins.
 */
export const NATURE_WATER_ALT_TILES: WaterTileDesc[] = [
  // Interior (all four edges are water). Cells with all 4 cardinal neighbours
  // water short-circuit to SOLID_TILE in the autotiler, so these variants only
  // serve as near-interior fallbacks.
  { tile: [11, 5], edges: [1, 1, 1, 1], corners: [1, 1, 1, 1] }, // pure solid (== SOLID_TILE)
  { tile: [11, 4], edges: [1, 1, 1, 1], corners: [1, 1, 1, 1] }, // interior variant
  { tile: [10, 5], edges: [1, 1, 1, 1], corners: [1, 1, 1, 1] }, // interior variant
  { tile: [12, 5], edges: [1, 1, 1, 1], corners: [1, 1, 1, 1] }, // interior variant
  { tile: [11, 6], edges: [1, 1, 1, 1], corners: [1, 1, 1, 1] }, // interior variant

  // Straight coasts. Each tile below has its three non-coast edges fully
  // solid (10/10 pixels), so it tiles seamlessly against the adjacent
  // interior tile. Alt-region variants with extra edge notches are
  // deliberately excluded.
  { tile: [12, 4], edges: [0, 1, 1, 1], corners: [0, 0, 1, 1] }, // coast N (bottom edge fully solid)
  { tile: [12, 6], edges: [1, 0, 1, 1], corners: [1, 0, 0, 1] }, // coast E (left edge fully solid)
  { tile: [10, 6], edges: [1, 1, 0, 1], corners: [1, 1, 0, 0] }, // coast S (top edge fully solid)
  { tile: [10, 4], edges: [1, 1, 1, 0], corners: [0, 1, 1, 0] }, // coast W (right edge fully solid)

  // Corners (two adjacent edges are shore). Both variants per direction are
  // visually equivalent — the atlas doesn't have a strictly-cleaner one.
  { tile: [9, 5], edges: [0, 1, 1, 0], corners: [0, 0, 1, 0] }, // corner NW (N+W coast)
  { tile: [10, 3], edges: [0, 1, 1, 0], corners: [0, 0, 1, 0] }, // corner NW variant
  { tile: [11, 3], edges: [0, 0, 1, 1], corners: [0, 0, 0, 1] }, // corner NE (N+E coast)
  { tile: [13, 4], edges: [0, 0, 1, 1], corners: [0, 0, 0, 1] }, // corner NE variant
  { tile: [13, 5], edges: [1, 0, 0, 1], corners: [1, 0, 0, 0] }, // corner SE (S+E coast)
  { tile: [12, 7], edges: [1, 0, 0, 1], corners: [1, 0, 0, 0] }, // corner SE variant
  { tile: [9, 6], edges: [1, 1, 0, 0], corners: [0, 1, 0, 0] }, // corner SW (S+W coast)
  { tile: [11, 7], edges: [1, 1, 0, 0], corners: [0, 1, 0, 0] }, // corner SW variant
];
