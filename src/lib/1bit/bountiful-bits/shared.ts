/**
 * Shared types for the Bountiful Bits atlases.
 *
 * The pack ships as separate 1-bit sheets (Nature, Civilized, ...), each a grid
 * of 10x10 px tiles. We use the transparent `no-background` variants so the
 * white sprites composite over whatever ground colour we choose (the pack has
 * NO ground/grass tile, the ground is expected to be a flat colour we supply).
 *
 * Every tile is white on alpha, so sprites can be re-tinted freely at draw time.
 *
 * There is one atlas module per sheet (see nature.ts, civilized.ts). Each atlas
 * is pure data + these types, no renderer dependency, so it can drive any
 * backend (PixiJS, canvas, etc.).
 */

/** A single tile position on a sheet: `[col, row]` in tile units. */
export type TileCoord = readonly [col: number, row: number];

/** A rectangular region of a sheet in tile units (for multi-tile objects). */
export interface TileRect {
  col: number;
  row: number;
  /** width in tiles */
  w: number;
  /** height in tiles */
  h: number;
}

/** Metadata describing one sheet image. */
export interface SheetMeta {
  /** Public URL (served from /public). */
  url: string;
  /** Grid width in tiles. */
  cols: number;
  /** Grid height in tiles. */
  rows: number;
  /** Tile edge length in px. */
  tileSize: number;
}

/** Pixel-space frame `{ x, y, w, h }` for a single tile on a sheet. */
export function tileFrame(sheet: SheetMeta, col: number, row: number) {
  return {
    x: col * sheet.tileSize,
    y: row * sheet.tileSize,
    w: sheet.tileSize,
    h: sheet.tileSize,
  };
}

/** Pixel-space frame for a multi-tile region on a sheet. */
export function rectFrame(sheet: SheetMeta, rect: TileRect) {
  return {
    x: rect.col * sheet.tileSize,
    y: rect.row * sheet.tileSize,
    w: rect.w * sheet.tileSize,
    h: rect.h * sheet.tileSize,
  };
}

/** Expand a TileRect into the list of `[col,row]` tiles it covers. */
export function rectTiles(rect: TileRect): TileCoord[] {
  const tiles: TileCoord[] = [];
  for (let r = 0; r < rect.h; r++) {
    for (let c = 0; c < rect.w; c++) {
      tiles.push([rect.col + c, rect.row + r]);
    }
  }
  return tiles;
}
