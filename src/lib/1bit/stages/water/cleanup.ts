/**
 * Post-carve cleanup for the water mask.
 */

import { NEI8 } from "../../grid";

/** Remove connected water components smaller than `minSize` (kills speckle). */
export function removeTinyComponents(
  water: Uint8Array,
  cols: number,
  rows: number,
  minSize: number,
): void {
  const n = cols * rows;
  const seen = new Uint8Array(n);
  const stack: number[] = [];
  for (let start = 0; start < n; start++) {
    if (!water[start] || seen[start]) continue;
    const comp: number[] = [];
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const i = stack.pop()!;
      comp.push(i);
      const cx = i % cols;
      const cy = (i / cols) | 0;
      for (const [dx, dy] of NEI8) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const j = ny * cols + nx;
        if (water[j] && !seen[j]) {
          seen[j] = 1;
          stack.push(j);
        }
      }
    }
    if (comp.length < minSize) for (const i of comp) water[i] = 0;
  }
}
