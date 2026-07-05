/**
 * Footprint placement helpers shared by the civilization passes.
 *
 * Civilization is the top of the overlap hierarchy: a structure may be seated
 * over WILD NATURE (the settlers cleared it — the renderer replaces the old
 * tile with the new one), but never over water, a road, or another structure.
 */

import type { TileRect } from "../../bountiful-bits";
import { NEI4 } from "../../grid";
import type { Rng } from "../../rng";
import type { PlacedTile, WorldCtx } from "../../world";

/** May civilization claim this cell (clearing any wild nature on it)? */
export function claimable(ctx: WorldCtx, i: number): boolean {
  return !ctx.water[i] && !ctx.road[i] && !ctx.structure[i];
}

/** Does `rect`, seated with its top-left at (cx,cy), fit on claimable land? */
export function fits(ctx: WorldCtx, cx: number, cy: number, rect: TileRect): boolean {
  const { cols, rows } = ctx;
  if (cx < 0 || cy < 0 || cx + rect.w > cols || cy + rect.h > rows) return false;
  for (let r = 0; r < rect.h; r++) {
    for (let c = 0; c < rect.w; c++) {
      if (!claimable(ctx, (cy + r) * cols + (cx + c))) return false;
    }
  }
  return true;
}

/** Seat `rect` at (cx,cy): claim its footprint and emit its tiles. */
export function place(ctx: WorldCtx, out: PlacedTile[], cx: number, cy: number, rect: TileRect): void {
  const { cols, tilePx, blocked, structure } = ctx;
  for (let r = 0; r < rect.h; r++) {
    for (let c = 0; c < rect.w; c++) {
      const i = (cy + r) * cols + (cx + c);
      blocked[i] = 1;
      structure[i] = 1;
      out.push({
        col: rect.col + c,
        row: rect.row + r,
        x: (cx + c) * tilePx,
        y: (cy + r) * tilePx,
        layer: "civ",
        sheet: "civilized",
      });
    }
  }
}

/** Claimable cells 4-adjacent to a road — the roadside build spots. */
export function roadsideCells(ctx: WorldCtx): number[] {
  const { cols, rows, road } = ctx;
  const cells: number[] = [];
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cy * cols + cx;
      if (!claimable(ctx, i)) continue;
      for (const [dx, dy] of NEI4) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        if (road[ny * cols + nx]) {
          cells.push(i);
          break;
        }
      }
    }
  }
  return cells;
}

/** In-place Fisher-Yates using the world RNG (keeps layout deterministic). */
export function shuffle(rng: Rng, arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
