/**
 * The shape of the road network: which anchors exist and which pairs connect.
 *
 * Anchors are the town centres plus a few rural WAYPOINTS — open-country spots
 * the trails detour through, so the map keeps natural paths that wander the
 * wilds instead of only town-to-town highways.
 *
 * Edges are a connected tree over the anchors (Prim-style: each step links the
 * still-unconnected anchor nearest by straight-line distance to the network)
 * plus each anchor's nearest neighbours, so the network gains loops and reads
 * as a web of routes rather than a single branching tree. The straight line
 * only *chooses* the pairs; each trail itself is a least-cost route (see
 * ./pathfind.ts), so the network is connected with no redundant crossings.
 */

import type { Town, WorldCtx } from "../../world";

/**
 * Rejection-sample `count` open-ground cells for rural waypoints, spread out
 * by a minimum spacing and kept outside settlement footprints.
 */
export function pickWaypoints(ctx: WorldCtx, count: number, towns: Town[]): number[] {
  const { cols, rows, rng, blocked } = ctx;
  const waypoints: number[] = [];
  const minSpacing = Math.max(3, Math.min(cols, rows) / 6);
  const minSpacing2 = minSpacing * minSpacing;

  for (let tries = 0; waypoints.length < count && tries < count * 60; tries++) {
    // Keep off the 1-cell border so trails have room to curve inward.
    const cx = 1 + ((rng() * (cols - 2)) | 0);
    const cy = 1 + ((rng() * (rows - 2)) | 0);
    const i = cy * cols + cx;
    if (blocked[i]) continue; // skip water and nature

    // Stay outside settlements: waypoints exist to pull trails through the wild.
    let ok = true;
    for (const t of towns) {
      const buffer = t.radius + 2;
      if ((t.cx - cx) ** 2 + (t.cy - cy) ** 2 < buffer * buffer) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    for (const w of waypoints) {
      const wx = w % cols;
      const wy = (w / cols) | 0;
      if ((wx - cx) ** 2 + (wy - cy) ** 2 < minSpacing2) {
        ok = false;
        break;
      }
    }
    if (ok) waypoints.push(i);
  }
  return waypoints;
}

/**
 * Anchor-index pairs to connect: a spanning-tree backbone (so every anchor is
 * reachable) plus each anchor's `extra` nearest neighbours (so the network has
 * loops). Returned undirected and de-duplicated.
 */
export function networkEdges(anchors: number[], cols: number, extra: number): [number, number][] {
  const n = anchors.length;
  const xs = anchors.map((a) => a % cols);
  const ys = anchors.map((a) => (a / cols) | 0);
  const d2 = (i: number, j: number) => (xs[i] - xs[j]) ** 2 + (ys[i] - ys[j]) ** 2;

  const seen = new Set<number>();
  const edges: [number, number][] = [];
  const add = (i: number, j: number) => {
    if (i === j) return;
    const a = Math.min(i, j);
    const b = Math.max(i, j);
    const key = a * n + b;
    if (!seen.has(key)) {
      seen.add(key);
      edges.push([a, b]);
    }
  };

  // Prim minimum spanning tree over straight-line distance (backbone).
  const inTree = new Uint8Array(n);
  inTree[0] = 1;
  for (let e = 1; e < n; e++) {
    let bi = -1;
    let bj = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!inTree[i]) continue;
      for (let j = 0; j < n; j++) {
        if (inTree[j]) continue;
        const d = d2(i, j);
        if (d < best) {
          best = d;
          bi = i;
          bj = j;
        }
      }
    }
    if (bj < 0) break;
    inTree[bj] = 1;
    add(bi, bj);
  }

  // Extra loops: link each anchor to its nearest neighbours.
  const idx = Array.from({ length: n }, (_, j) => j);
  for (let i = 0; i < n; i++) {
    const near = idx.filter((j) => j !== i).sort((p, q) => d2(i, p) - d2(i, q));
    for (let m = 0; m < Math.min(extra, near.length); m++) add(i, near[m]);
  }

  return edges;
}
