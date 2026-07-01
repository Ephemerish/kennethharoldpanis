/**
 * Best-match autotiler.
 *
 * Given a boolean cell mask (e.g. "is this cell water?") and a set of tiles each
 * classified by shape (which edges/corners are filled), it picks, for every set
 * cell, the tile whose shape best matches that cell's neighbourhood. This yields
 * good coasts/edges without a hand-authored 47-blob lookup table, and degrades
 * gracefully when the tile set doesn't cover every possible configuration.
 *
 * Edge match dominates (a wrong edge is very visible); corners break ties.
 */

import type { LayerName, PlacedTile } from "./world";

export interface AutotileDesc {
  /** [col, row] on the sheet. */
  tile: readonly [number, number];
  /** [N, E, S, W] — 1 where the tile's fill reaches that edge. */
  edges: readonly number[];
  /** [NW, NE, SE, SW] — 1 where the tile fills that corner. */
  corners: readonly number[];
}

const EDGE_WEIGHT = 3;
const CORNER_WEIGHT = 1;

/**
 * @param mask       row-major cell mask (length cols*rows), 1 = filled. Used
 *                   for neighbour lookups so tiles pick coasts consistently.
 * @param tiles      classified tile set.
 * @param renderMask optional filter (same shape as `mask`): when supplied, a
 *                   tile is emitted only for cells set in BOTH `mask` and
 *                   `renderMask`. Lets a caller split one body of water into
 *                   sub-passes (e.g. pond tiles vs river tiles) without
 *                   introducing false coasts at the boundary between them.
 * @returns tiles to draw for every filled cell, in row-major order.
 */
export function autotileMask(
  mask: Uint8Array,
  cols: number,
  rows: number,
  tilePx: number,
  tiles: AutotileDesc[],
  layer: LayerName,
  interior?: readonly [number, number],
  renderMask?: Uint8Array,
): PlacedTile[] {
  // Out-of-bounds counts as filled, so a body running off the viewport clips
  // cleanly at the edge instead of drawing a false coastline along the border.
  const at = (x: number, y: number): number =>
    x >= 0 && x < cols && y >= 0 && y < rows ? mask[y * cols + x] : 1;

  const out: PlacedTile[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (!mask[i]) continue;
      if (renderMask && !renderMask[i]) continue;

      const n = at(x, y - 1);
      const e = at(x + 1, y);
      const s = at(x, y + 1);
      const w = at(x - 1, y);

      // Deep interior (surrounded on all four sides): use a clean solid tile so
      // inner water/terrain has no speckle, only coasts use the textured tiles.
      if (interior && n && e && s && w) {
        out.push({ col: interior[0], row: interior[1], x: x * tilePx, y: y * tilePx, layer });
        continue;
      }

      // A corner counts only when the diagonal AND both adjacent edges are set
      // (standard blob inner-corner rule), so coves read correctly.
      const nw = at(x - 1, y - 1) && n && w ? 1 : 0;
      const ne = at(x + 1, y - 1) && n && e ? 1 : 0;
      const se = at(x + 1, y + 1) && s && e ? 1 : 0;
      const sw = at(x - 1, y + 1) && s && w ? 1 : 0;

      let best = tiles[0];
      let bestScore = -Infinity;
      let bestFill = -1;
      for (const t of tiles) {
        const [tn, te, ts, tw] = t.edges;
        const [tnw, tne, tse, tsw] = t.corners;
        const score =
          (tn === n ? EDGE_WEIGHT : 0) +
          (te === e ? EDGE_WEIGHT : 0) +
          (ts === s ? EDGE_WEIGHT : 0) +
          (tw === w ? EDGE_WEIGHT : 0) +
          (tnw === nw ? CORNER_WEIGHT : 0) +
          (tne === ne ? CORNER_WEIGHT : 0) +
          (tse === se ? CORNER_WEIGHT : 0) +
          (tsw === sw ? CORNER_WEIGHT : 0);
        // Tie-break toward the fuller tile: for configurations the set doesn't
        // cover exactly (e.g. the template's missing top/bottom coasts), a fuller
        // tile gives a clean straight coast instead of a bumpy pipe edge.
        const fill = tn + te + ts + tw;
        if (score > bestScore || (score === bestScore && fill > bestFill)) {
          bestScore = score;
          bestFill = fill;
          best = t;
        }
      }

      out.push({
        col: best.tile[0],
        row: best.tile[1],
        x: x * tilePx,
        y: y * tilePx,
        layer,
      });
    }
  }

  return out;
}
