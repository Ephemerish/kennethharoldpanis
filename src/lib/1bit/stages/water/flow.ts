/**
 * Flow accumulation over the height field.
 *
 * Each cell drains to its lowest 4-neighbour; processing cells high->low, one
 * unit of "rain" per cell flows downhill and accumulates. Because every cell
 * has exactly one downhill target, the set of high-flow cells is naturally a
 * 1-cell-wide branching tree — real river geometry.
 *
 * 4-connectivity (not D8) so downhill paths are inherently 4-connected —
 * rivers rendered from this tree are guaranteed strictly 1 cell wide (a
 * diagonal step would otherwise produce a 2-wide staircase under the
 * autotiler).
 */

import { NEI4 } from "../../grid";

export interface FlowField {
  /** accumulated flow per cell (>= 1). */
  flow: Float32Array;
  maxFlow: number;
  /** each cell's downhill drain target index, or -1 for a local minimum. */
  downhill: Int32Array;
}

export function accumulateFlow(h: Float32Array, cols: number, rows: number): FlowField {
  const n = cols * rows;
  const downhill = new Int32Array(n).fill(-1);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cy * cols + cx;
      let lowest = h[i];
      let target = -1;
      for (const [dx, dy] of NEI4) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const j = ny * cols + nx;
        if (h[j] < lowest) {
          lowest = h[j];
          target = j;
        }
      }
      downhill[i] = target;
    }
  }

  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => h[b] - h[a]);
  const flow = new Float32Array(n).fill(1);
  let maxFlow = 1;
  for (const i of order) {
    const d = downhill[i];
    if (d >= 0) {
      flow[d] += flow[i];
      if (flow[d] > maxFlow) maxFlow = flow[d];
    }
  }
  return { flow, maxFlow, downhill };
}
