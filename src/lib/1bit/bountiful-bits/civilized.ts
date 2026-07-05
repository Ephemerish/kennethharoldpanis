/**
 * Atlas for the Bountiful Bits "Civilized" sheet (Civilized-no-bg.png, 24x18
 * tiles of 10x10 px). Every region below was verified visually against a
 * labelled 12x blow-up of the sheet (2026-07); coordinates are exact.
 *
 * Sheet map (cols x rows, content starts at col 1 / row 1):
 *
 *   cols 1-8,  rows 1-2   DOORS: square-top (row 1) and arched (row 2) fronts
 *   cols 1-8,  rows 3-6   INTERIOR: shelves (3-4), counters (5), chests (6)
 *   cols 1-5,  rows 8-15  INTERIOR: furniture (tables, hutch, wardrobe, ...)
 *   col  7,    rows 8-16  WINDMILL: a 1x9 tower landmark (blades at row 11)
 *   cols 10-14,rows 1-9   VILLAGE PROPS: boards, chests, pots, fences,
 *                         gravestones, urns, boats, tents, flag, bridge, ...
 *   cols 9-14, rows 11-14 SIGNS & STATUES: shaped signposts + two statues
 *   cols 16-18/20-22, rows 1-6  BUILDINGS: four 3x3 facades (halls/gatehouses)
 *   cols 16-21,row 8      PAVING: six single-tile ground fill swatches
 *   cols 15-23,rows 11-16 ROADS: two styles of plaza + capsule segments
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

/* ------------------------------------------------------------------ */
/* Buildings & landmarks                                               */
/* ------------------------------------------------------------------ */

/**
 * Four self-contained 3x3 building facades (top-right of the sheet).
 * The A pair (cols 16-18) has clean stone walls and lattice windows; the B
 * pair (cols 20-22) is rough patched brick. "hall" = crenellated roof over
 * windowed walls with a central arched door; "gatehouse" = heavy wall courses
 * pierced by one big arch.
 */
export const CIVILIZED_BUILDINGS: Record<string, TileRect> = {
  /** Stone hall: crenellations, lattice windows, arched entrance. */
  hallA: { col: 16, row: 1, w: 3, h: 3 },
  /** Stone gatehouse: heavy coursed wall with a single big arch. */
  gatehouseA: { col: 16, row: 4, w: 3, h: 3 },
  /** Brick hall (patched, rustic skin of hallA). */
  hallB: { col: 20, row: 1, w: 3, h: 3 },
  /** Brick gatehouse (patched, rustic skin of gatehouseA). */
  gatehouseB: { col: 20, row: 4, w: 3, h: 3 },
};

/** Tall unique landmarks. */
export const CIVILIZED_LANDMARKS: Record<string, TileRect> = {
  /** Windmill / watch tower, 1x9: battlement cap, windowed head, cross of
   *  blades (row 11), then a tapering dotted shaft to a footed base. */
  windmill: { col: 7, row: 8, w: 1, h: 9 },
  /** Roofed shrine / covered well: pillared canopy over a plinth (1x2). */
  shrine: { col: 10, row: 1, w: 1, h: 2 },
};

/** Statues (head + robed body on a plinth), park & plaza centrepieces. */
export const CIVILIZED_STATUES: Record<string, TileRect> = {
  /** Large statue, fills its 1x2 frame. */
  large: { col: 9, row: 11, w: 1, h: 2 },
  /** Small statue on a base, more air around it. */
  small: { col: 10, row: 11, w: 1, h: 2 },
};

/* ------------------------------------------------------------------ */
/* Roads, plazas & paving                                              */
/* ------------------------------------------------------------------ */

/**
 * Road pieces, two visual styles. Segments are CAPSULES (rounded end caps
 * with a dashed centre line), so they read as discrete stamped strips, not
 * seamlessly tileable roadway — use paving/dirt autotiles for continuous
 * streets and these for decoration. Each style also has a 3x3 plaza square.
 *
 *   outline — line-drawn: hollow border, dashed inner frame, four rosettes.
 *             Reads as an ornamental garden square / mosaic court.
 *   solid   — filled slab with dark seams and four inset panels.
 *             Reads as a paved town square; the better default plaza.
 */
export const CIVILIZED_ROADS: Record<
  "outline" | "solid",
  {
    plaza: TileRect;
    vertical: TileRect;
    verticalAlt: TileRect;
    horizontal: TileRect;
    horizontalAlt: TileRect;
  }
> = {
  outline: {
    plaza: { col: 15, row: 11, w: 3, h: 3 },
    vertical: { col: 18, row: 11, w: 1, h: 3 },
    verticalAlt: { col: 22, row: 11, w: 1, h: 3 },
    horizontal: { col: 19, row: 11, w: 3, h: 1 },
    horizontalAlt: { col: 19, row: 13, w: 3, h: 1 },
  },
  solid: {
    plaza: { col: 15, row: 14, w: 3, h: 3 },
    vertical: { col: 18, row: 14, w: 1, h: 3 },
    verticalAlt: { col: 22, row: 14, w: 1, h: 3 },
    horizontal: { col: 19, row: 14, w: 3, h: 1 },
    horizontalAlt: { col: 19, row: 16, w: 3, h: 1 },
  },
};

/** Single-tile ground fill swatches (row 8), for paved streets/floors. */
export const CIVILIZED_PAVING: Record<string, TileCoord> = {
  /** Fine checkerboard. */
  checker: [16, 8],
  /** Large slabs with checker infill. */
  slabMix: [17, 8],
  /** Running-bond brick courses. */
  brick: [18, 8],
  /** Big irregular flagstones. */
  flagstone: [19, 8],
  /** Diagonal hatching. */
  diagonal: [20, 8],
  /** Horizontal planks / boards. */
  planks: [21, 8],
};

/** The paving swatches as a list (for random picks). */
export const CIVILIZED_PAVING_TILES: TileCoord[] = Object.values(CIVILIZED_PAVING);

/* ------------------------------------------------------------------ */
/* Signs                                                               */
/* ------------------------------------------------------------------ */

/**
 * Shaped signposts (cols 9-14, rows 11-14). The 1x1 entries are round signs
 * (large ones free-standing, small ones on a stub post); the 1x2 entries are
 * stacked sign totems (a shape sign mounted over a boxed sign on one post).
 */
export const CIVILIZED_SIGNS = {
  /** Large round signs: slashed circle, barred circle. */
  roundLarge: [
    { col: 11, row: 11, w: 1, h: 1 },
    { col: 13, row: 11, w: 1, h: 1 },
  ] as TileRect[],
  /** Small round signs on a post: slashed, barred. */
  roundSmall: [
    { col: 12, row: 11, w: 1, h: 1 },
    { col: 14, row: 11, w: 1, h: 1 },
  ] as TileRect[],
  /** Stacked totems: diamond/square combos on one post (1x2 each). */
  totems: [
    { col: 9, row: 13, w: 1, h: 2 },
    { col: 10, row: 13, w: 1, h: 2 },
    { col: 11, row: 13, w: 1, h: 2 },
    { col: 12, row: 13, w: 1, h: 2 },
  ] as TileRect[],
} as const;

/* ------------------------------------------------------------------ */
/* Village props (outdoor decor)                                       */
/* ------------------------------------------------------------------ */

/**
 * Outdoor props from the mid columns (10-14). All 1x1 unless noted. These are
 * what make settlements read as lived-in: stalls, storage, graves, fences.
 */
export const CIVILIZED_PROPS = {
  /** Notice boards: wavy-text marquee on two legs / on one post. */
  noticeBoard: [
    [11, 1],
    [11, 2],
  ] as TileCoord[],
  /** Treasure chests: strapped shut, lid open. */
  chest: [
    [12, 1],
    [12, 2],
  ] as TileCoord[],
  /** Cook pots: cauldron with wavy brew, big open pot. */
  cookPot: [
    [13, 1],
    [13, 2],
  ] as TileCoord[],
  /** Picket fence rows (horizontal rail segments). */
  fence: [
    [14, 1],
    [14, 2],
  ] as TileCoord[],
  /** Gravestones on burial mounds: cross-front and skull-front stones. */
  gravestone: [
    [10, 3],
    [11, 3],
    [10, 4],
    [11, 4],
  ] as TileCoord[],
  /** Plain grave crosses on mounds. */
  graveCross: [
    [12, 3],
    [12, 4],
  ] as TileCoord[],
  /** Decorated urns / planters on pedestals. */
  urn: [
    [10, 5],
    [11, 5],
    [10, 6],
    [11, 6],
  ] as TileCoord[],
  /** Lidded bowls / basins. */
  basin: [
    [12, 5],
    [12, 6],
  ] as TileCoord[],
  /** Boats: single-sail dinghy, canoe. */
  boat: [
    [13, 6],
    [14, 6],
  ] as TileCoord[],
  /** Wooden ladder (vertical). */
  ladder: [[10, 7]] as TileCoord[],
  /** Barred gate / portcullis. */
  gate: [[11, 7]] as TileCoord[],
  /** Coiled rope / knot. */
  ropeCoil: [[12, 7]] as TileCoord[],
  /** Market tents / stall awnings (checkered canvas over posts). */
  tent: [
    [12, 8],
    [13, 8],
  ] as TileCoord[],
  /** Pennant flag on a pole. */
  flag: [[14, 8]] as TileCoord[],
  /** Stair steps (ascending bars / staircase profile). */
  stairs: [
    [13, 5],
    [14, 5],
  ] as TileCoord[],
  /** Plank bridge / boardwalk segments (horizontal). */
  bridge: [
    [10, 8],
    [11, 8],
  ] as TileCoord[],
  /** Barrel with a bung dot (1x2 with its stand). */
  barrel: { col: 10, row: 9, w: 1, h: 2 } as TileRect,
  /** Roof apex pair, 2x1 (peak of a tent/house roof). */
  roofApex: { col: 13, row: 7, w: 2, h: 1 } as TileRect,
} as const;

/* ------------------------------------------------------------------ */
/* Doors & interiors (indoor scenes; rarely useful on the map)         */
/* ------------------------------------------------------------------ */

/**
 * Door fronts, 1x1 each: row 1 square-top, row 2 arched-top. Variants left to
 * right: panel, slotted window, letterbox, lattice, wavy glass, ajar, open
 * frame; col 8 is an ornament (rose window on row 1, boarded-up on row 2).
 */
export const CIVILIZED_DOORS = {
  square: [
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [7, 1],
  ] as TileCoord[],
  arched: [
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
  ] as TileCoord[],
  roseWindow: [8, 1] as TileCoord,
  boarded: [8, 2] as TileCoord,
} as const;

/**
 * Interior furniture (best-effort names; verified shapes, indoor use).
 * Grouped coarsely — the outdoor generator doesn't use these, but they're
 * catalogued so future indoor/close-up scenes can.
 */
export const CIVILIZED_INTERIOR = {
  /** Stocked wall shelves (bottles, tools, bowls, hooks). */
  shelves: [
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
  ] as TileCoord[],
  /** Counters / sideboards (stacked slab fronts). */
  counters: [
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 5],
    [7, 5],
  ] as TileCoord[],
  /** Chests, boxes and woven baskets. */
  chests: [
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 6],
    [6, 6],
    [7, 6],
    [8, 6],
  ] as TileCoord[],
  /** Banquet table, 3 tiles wide. */
  longTable: { col: 1, row: 8, w: 3, h: 1 } as TileRect,
  /** Dresser/hutch with stocked top, 2x3. */
  hutch: { col: 1, row: 9, w: 2, h: 3 } as TileRect,
  /** Tall wardrobe / standing cabinet, 1x3. */
  wardrobe: { col: 5, row: 9, w: 1, h: 3 } as TileRect,
  /** Round pedestal table. */
  pedestalTable: [1, 12] as TileCoord,
  /** Wall clock (round face). */
  clock: [3, 13] as TileCoord,
  /** Brazier / slatted bin. */
  bin: [4, 13] as TileCoord,
  /** Stove / furnace with vent. */
  stove: [5, 13] as TileCoord,
  /** Table lamp. */
  lamp: [5, 12] as TileCoord,
  /** Upright piano / organ (wavy keys). */
  piano: [5, 15] as TileCoord,
} as const;
