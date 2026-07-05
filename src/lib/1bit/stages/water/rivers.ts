/**
 * River marking and thinning on top of the drainage tree.
 *
 * A river cell is kept only if its drainage path actually terminates in a
 * lake/sea; rivers that would dead-end on dry land are discarded so every
 * river connects to a body of water. Thinning then removes 2x2 "fat spots"
 * and orphaned cells so channels stay strictly 1 cell wide.
 */

import { NEI4 } from "../../grid";
import type { FlowField } from "./flow";

/**
 * Mark high-flow cells whose drainage reaches a lake/sea as river. Writes
 * `water` and `riverMask` in place.
 */
export function markRivers(
  h: Float32Array,
  { flow, maxFlow, downhill }: FlowField,
  pondMask: Uint8Array,
  water: Uint8Array,
  riverMask: Uint8Array,
  riverAmount: number,
): void {
  const n = h.length;

  // Precompute: does this cell's downhill trace reach a lake/sea cell? Sweep
  // low->high so each cell sees its already-resolved downstream neighbour.
  const terminates = new Uint8Array(n);
  const orderLowFirst = Array.from({ length: n }, (_, i) => i).sort((a, b) => h[a] - h[b]);
  for (const i of orderLowFirst) {
    if (pondMask[i]) {
      terminates[i] = 1;
      continue;
    }
    const d = downhill[i];
    if (d < 0) terminates[i] = 0;
    else if (pondMask[d]) terminates[i] = 1;
    else terminates[i] = terminates[d];
  }

  // Rivers: mark 1-cell-wide (no disc widening — the D4 tree is already a
  // strictly 1-wide, 4-connected branching network). Higher `riverAmount` ->
  // lower threshold -> more/branchier rivers (at the default 0.7 this lands
  // near the hand-tuned 0.5 * maxFlow). Only keep cells whose drainage
  // actually terminates in a lake so every river connects to a body of water.
  const clamped = Math.max(0, Math.min(1, riverAmount));
  const threshold = maxFlow * (0.55 - 0.1 * clamped);
  for (let i = 0; i < n; i++) {
    if (pondMask[i]) continue;
    if (flow[i] < threshold) continue;
    if (!terminates[i]) continue;
    water[i] = 1;
    riverMask[i] = 1;
  }
}

/**
 * Two independent parallel branches running in adjacent columns/rows can still
 * produce a 2x2 all-river block — a visible "fat spot" in the channel.
 * Iteratively kill any 2x2 by removing its lowest-flow cell (weakest
 * tributary), then cascade-prune any river cell that ends up with no
 * 4-adjacent water (would render as an isolated island). Rivers can still bend
 * and Y-merge; only true 2x2 fills are removed.
 */
export function thinRivers(
  water: Uint8Array,
  riverMask: Uint8Array,
  flow: Float32Array,
  cols: number,
  rows: number,
): void {
  let broke = true;
  while (broke) {
    broke = false;
    for (let cy = 0; cy < rows - 1; cy++) {
      for (let cx = 0; cx < cols - 1; cx++) {
        const i00 = cy * cols + cx;
        const i01 = i00 + 1;
        const i10 = i00 + cols;
        const i11 = i10 + 1;
        if (!riverMask[i00] || !riverMask[i01] || !riverMask[i10] || !riverMask[i11]) continue;
        let victim = i00;
        let vFlow = flow[i00];
        if (flow[i01] < vFlow) {
          victim = i01;
          vFlow = flow[i01];
        }
        if (flow[i10] < vFlow) {
          victim = i10;
          vFlow = flow[i10];
        }
        if (flow[i11] < vFlow) {
          victim = i11;
        }
        riverMask[victim] = 0;
        water[victim] = 0;
        broke = true;
      }
    }
  }

  let pruned = true;
  while (pruned) {
    pruned = false;
    for (let i = 0; i < cols * rows; i++) {
      if (!riverMask[i]) continue;
      const cx = i % cols;
      const cy = (i / cols) | 0;
      let hasWater = false;
      for (const [dx, dy] of NEI4) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        if (water[ny * cols + nx]) {
          hasWater = true;
          break;
        }
      }
      if (!hasWater) {
        riverMask[i] = 0;
        water[i] = 0;
        pruned = true;
      }
    }
  }
}
