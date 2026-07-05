/**
 * Footprint placement helpers shared by the civilization passes.
 */

import type { TileRect } from "../../bountiful-bits";
import { NEI4 } from "../../grid";
import type { Rng } from "../../rng";
import type { PlacedTile, WorldCtx } from "../../world";

/** Does `rect`, seated with its top-left at (cx,cy), fit over clear ground? */
export function fits(ctx: WorldCtx, cx: number, cy: number, rect: TileRect): boolean {
  const { cols, rows, blocked } = ctx;
  if (cx < 0 || cy < 0 || cx + rect.w > cols || cy + rect.h > rows) return false;
  for (let r = 0; r < rect.h; r++) {
    for (let c = 0; c < rect.w; c++) {
      if (blocked[(cy + r) * cols + (cx + c)]) return false;
    }
  }
  return true;
}

/** Seat `rect` at (cx,cy): mark its footprint blocked and emit its tiles. */
export function place(ctx: WorldCtx, out: PlacedTile[], cx: number, cy: number, rect: TileRect): void {
  const { cols, tilePx, blocked } = ctx;
  for (let r = 0; r < rect.h; r++) {
    for (let c = 0; c < rect.w; c++) {
      blocked[(cy + r) * cols + (cx + c)] = 1;
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

/** Open cells that are 4-adjacent to a road — the roadside build spots. */
export function roadsideCells(ctx: WorldCtx): number[] {
  const { cols, rows, blocked, road } = ctx;
  const cells: number[] = [];
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cy * cols + cx;
      if (blocked[i]) continue; // occupied (water, nature, or a road cell)
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
