/**
 * Atlas for the Bountiful Bits "Civilized" sheet (Civilized-no-bg.png, 24x18).
 *
 * Contents (verified by slicing the sheet):
 *   - Roads (bottom-right, cols 15-23, rows 11-16): two styles, each with a 3x3
 *     plaza/junction block and straight vertical (1x3) / horizontal (3x1)
 *     segments. Mapped precisely below.
 *   - Paving swatches (row 9, cols 16-21): single-tile fill patterns.
 *   - Building facades (top-right, cols 14-21, rows 0-7): large multi-tile
 *     arched structures.
 *   - Props / furniture (left + mid): doors, windows, fences, wells, market
 *     stalls, lamps, signs, barrels, crates, boats, graves, indoor furniture.
 *
 * Road/paving coords are exact. Multi-tile STRUCTURE/PROP regions are
 * best-effort bounding boxes read from the sheet and may need a pixel-nudge;
 * they're kept as data so they're trivial to refine.
 *
 * Tileset: https://v3x3d.itch.io/bountiful-bits (Bountiful Bits 10x10 v3.1)
 */

import type { SheetMeta, TileCoord, TileRect } from "./shared";

export const CIVILIZED_SHEET: SheetMeta = {
  url: "/tileset/Bountiful-Bits-10x10-v-3.1/1-Bit/no-background/Civilized-no-bg.png",
  cols: 24,
  rows: 18,
  tileSize: 10,
};

/**
 * Road pieces, two visual styles. Each has a plaza (junction) block plus
 * straight segments, enough to lay out paths and crossings.
 */
export const CIVILIZED_ROADS: Record<
  "cobble" | "brick",
  { plaza: TileRect; vertical: TileRect; horizontal: TileRect }
> = {
  // Solid-edged style.
  cobble: {
    plaza: { col: 15, row: 11, w: 3, h: 3 },
    vertical: { col: 18, row: 11, w: 1, h: 3 },
    horizontal: { col: 20, row: 11, w: 3, h: 1 },
  },
  // Dashed style.
  brick: {
    plaza: { col: 15, row: 14, w: 3, h: 3 },
    vertical: { col: 18, row: 14, w: 1, h: 3 },
    horizontal: { col: 20, row: 14, w: 3, h: 1 },
  },
};

/** Single-tile paving / floor fill swatches (row 9). */
export const CIVILIZED_PAVING: TileCoord[] = [
  [16, 9],
  [17, 9],
  [18, 9],
  [19, 9],
  [20, 9],
  [21, 9],
];

/** Large multi-tile structures (best-effort regions). */
export const CIVILIZED_STRUCTURES: Record<string, TileRect> = {
  /** Arched stone building / gatehouse. */
  facadeA: { col: 15, row: 0, w: 3, h: 8 },
  /** Second arched building. */
  facadeB: { col: 19, row: 0, w: 3, h: 8 },
  /** Well / water pump. */
  well: { col: 10, row: 9, w: 2, h: 4 },
  /** Market stall / awning. */
  market: { col: 12, row: 9, w: 3, h: 2 },
  /** Statue / fountain on a pedestal. */
  statue: { col: 7, row: 9, w: 1, h: 7 },
};

/** Smaller props, as `[col,row]` tiles or small multi-tile rects. */
export const CIVILIZED_PROPS = {
  /** Door (1x2). */
  door: { col: 6, row: 0, w: 1, h: 2 } as TileRect,
  /** Lamp post (1x2). */
  lamp: { col: 14, row: 11, w: 1, h: 2 } as TileRect,
  /** Sign post (1x2). */
  sign: { col: 14, row: 13, w: 1, h: 2 } as TileRect,
  /** Single-tile windows / wall panels. */
  window: [[8, 0]] as TileCoord[],
  /** Fence / railing tops. */
  fence: [
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
  ] as TileCoord[],
  /** Barrels / crates / boxes. */
  crate: [
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
  ] as TileCoord[],
} as const;
