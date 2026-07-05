/**
 * Least-cost CONNECTORS: how a settlement or waypoint joins the road network.
 *
 * Highways are grown organically (see ./highways.ts); this module is the
 * complement — given a start cell, Dijkstra expands outward until it touches
 * ANY existing road cell (goal = predicate, not a point), then the path back
 * is laid down. That is how hamlet lanes, waypoint trails and missed-town
 * connectors always merge into the network instead of running to a
 * coordinate.
 *
 * Costs: water is VERY expensive (a route fords it only when the crossing is
 * a cell or two — those cells render as bridges — and long detours always
 * beat swimming a lake), nature costs extra (paths prefer clearings but may
 * cut through sparse woods). 4-connectivity keeps each road strictly 1 cell
 * wide, matching how rivers stay thin.
 *
 * A smooth noise field ("wander") is added to per-cell step cost so the
 * least-cost route prefers some corridors over others — trails wind like worn
 * footpaths instead of running dead-straight between endpoints.
 */

import { NEI4 } from "../../grid";
import { fbm2D } from "../../noise";
import { randSeed } from "../../rng";
import type { WorldCtx } from "../../world";

const NATURE_COST = 8; // extra cost to enter a nature-occupied cell (route around)
const ROAD_REUSE_COST = 0.25; // cost to reuse existing road (< 1 -> branches merge)
// Cost to enter water: one bridge cell trades against a ~7-cell detour, so a
// road spans a thin river rather than hugging it for half the map, while a
// 3+-cell crossing (lakes, seas) still loses to any sane land route.
const BRIDGE_COST = 7;

const WANDER_FREQ = 0.09; // lattice period ~11 cells -> gentle, map-scale curves
const WANDER_COST = 1.6; // strength of the meander (relative to the base step of 1)

/** Binary min-heap over (cost, cell) pairs, for Dijkstra's frontier. */
class MinHeap {
  private cost: number[] = [];
  private node: number[] = [];

  get size(): number {
    return this.node.length;
  }

  push(cost: number, node: number): void {
    const { cost: cs, node: ns } = this;
    cs.push(cost);
    ns.push(node);
    let i = ns.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (cs[p] <= cs[i]) break;
      [cs[p], cs[i]] = [cs[i], cs[p]];
      [ns[p], ns[i]] = [ns[i], ns[p]];
      i = p;
    }
  }

  pop(): [cost: number, node: number] {
    const { cost: cs, node: ns } = this;
    const topCost = cs[0];
    const topNode = ns[0];
    const lastCost = cs.pop()!;
    const lastNode = ns.pop()!;
    const n = ns.length;
    if (n > 0) {
      cs[0] = lastCost;
      ns[0] = lastNode;
      let i = 0;
      for (;;) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && cs[l] < cs[s]) s = l;
        if (r < n && cs[r] < cs[s]) s = r;
        if (s === i) break;
        [cs[s], cs[i]] = [cs[i], cs[s]];
        [ns[s], ns[i]] = [ns[i], ns[s]];
        i = s;
      }
    }
    return [topCost, topNode];
  }
}

/** Precomputed meander field, passed to every routing call. */
export type WanderField = Float32Array;

/**
 * Smooth per-cell meander field (one octave-pair of fbm), sampled once so
 * Dijkstra doesn't re-evaluate noise on every relaxation.
 */
export function buildWanderField(ctx: WorldCtx): WanderField {
  const { cols, rows, rng } = ctx;
  const noise = fbm2D(randSeed(rng), 2, 0.5);
  const wander = new Float32Array(cols * rows);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      wander[cy * cols + cx] = noise(cx * WANDER_FREQ, cy * WANDER_FREQ);
    }
  }
  return wander;
}

/**
 * Least-cost route from `start` to the nearest cell satisfying `isGoal`
 * (typically "any existing road"). Water costs a bridge premium; nature is
 * costly; the smooth `wander` field nudges the route to curve; and
 * already-laid road is cheap so late connectors coalesce onto earlier ones.
 * Returns the cells of the path (inclusive of both ends), or null if no goal
 * is reachable.
 */
export function routeToRoad(
  ctx: WorldCtx,
  wander: WanderField,
  start: number,
  isGoal: (cell: number) => boolean,
): number[] | null {
  const { cols, rows, water, blocked, road } = ctx;
  const n = cols * rows;
  // Float64 (not Float32): the heap stores full-precision double costs, so `dist`
  // must too. With Float32 the stored value is rounded, and the stale-entry
  // check (`d > dist[i]`) then rejects the freshest pop for fractional costs —
  // collapsing the search. (Integer costs happen to be exact in f32; the wander
  // field makes costs fractional, which is what exposed this.)
  const dist = new Float64Array(n).fill(Infinity);
  const prev = new Int32Array(n).fill(-1);
  const heap = new MinHeap();

  dist[start] = 0;
  heap.push(0, start);
  let goal = -1;

  while (heap.size) {
    const [d, i] = heap.pop();
    if (d > dist[i]) continue; // stale heap entry
    if (isGoal(i)) {
      goal = i;
      break;
    }
    const cx = i % cols;
    const cy = (i / cols) | 0;
    for (const [dx, dy] of NEI4) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      const j = ny * cols + nx;
      // Reused road stays flat-cheap (no wander) so branches prefer to merge;
      // water is bridgeable but ruinously expensive per cell; a blocked-but-dry
      // cell is nature (or a structure footprint) and costs a detour premium.
      const step = road[j]
        ? ROAD_REUSE_COST
        : water[j]
          ? BRIDGE_COST
          : (blocked[j] ? 1 + NATURE_COST : 1) + wander[j] * WANDER_COST;
      const nd = d + step;
      if (nd < dist[j]) {
        dist[j] = nd;
        prev[j] = i;
        heap.push(nd, j);
      }
    }
  }

  if (goal < 0) return null;
  const path: number[] = [];
  for (let c = goal; c !== -1; c = prev[c]) path.push(c);
  return path;
}
