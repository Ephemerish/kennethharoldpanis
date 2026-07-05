/**
 * Streets: the paved lanes INSIDE a city or town, grown off the arterials.
 *
 * The layout is deliberately EUROPEAN, not an American grid: there is no town
 * square and no global grid lines. Lanes spawn perpendicular off whatever
 * road already runs through the settlement (the highways, then each other),
 * at irregular intervals, and march irregular distances — some merge into
 * the next street (a through lane), some stop short (a dead-end court), and
 * blocks come out 2-4 cells and uneven. Several passes deepen the web, so
 * density falls off from the arterials the way old towns thin toward their
 * edges.
 *
 * Streets are cut through the overgrowth: a wild tree on the line is cleared
 * (the renderer replaces its tile). Water still ends a lane, and a lane never
 * runs directly alongside another road — roadgen's snap rule, which is what
 * keeps the blocks fat enough to build in.
 *
 * Street cells are marked ROAD_STREET and `blocked`. Hamlets get no lanes —
 * theirs stay dirt.
 */

import { chance } from "../../rng";
import { ROAD_STREET, type Town, type WorldCtx } from "../../world";

/** Chance an eligible road cell sprouts a perpendicular lane, per axis. */
const SPAWN_CHANCE: Record<string, number> = { city: 0.42, town: 0.38, hamlet: 0 };
/** Growth passes: lanes off arterials, then lanes off lanes, ... */
const PASSES: Record<string, number> = { city: 3, town: 2, hamlet: 0 };
/** Chance per cell that a marching lane simply stops (dead-end court). */
const EARLY_STOP = 0.06;
/** Lanes shorter than this that didn't merge into road are rolled back. */
const MIN_LEN = 2;

export function growStreets(ctx: WorldCtx, town: Town): void {
  const spawnChance = SPAWN_CHANCE[town.tier];
  const passes = PASSES[town.tier];
  if (!spawnChance || !passes) return;

  const { cols, rng, road, water, blocked } = ctx;
  const r2 = town.radius * town.radius;

  const inFoot = (x: number, y: number): boolean =>
    ctx.inBounds(x, y) && (x - town.cx) ** 2 + (y - town.cy) ** 2 <= r2;

  /** Any road within `spread` cells laterally of (x,y), perpendicular to
   *  (dx,dy)? Keeps parallel lanes at least `spread` apart (fat blocks). */
  const lateralRoad = (x: number, y: number, dx: number, dy: number, spread: number): boolean => {
    for (let k = 1; k <= spread; k++) {
      const ax = x - dy * k;
      const ay = y - dx * k;
      const bx = x + dy * k;
      const by = y + dx * k;
      if (ctx.inBounds(ax, ay) && road[ay * cols + ax]) return true;
      if (ctx.inBounds(bx, by) && road[by * cols + bx]) return true;
    }
    return false;
  };

  /**
   * March a lane from beside (sx,sy) in direction (dx,dy). Stops on merge
   * (ending 4-adjacent to road = a junction), at the footprint edge, water,
   * a parallel road too close, a random early stop, or its length cap.
   * Too-short dead ends are rolled back (roadgen discards short edges).
   */
  const march = (sx: number, sy: number, dx: number, dy: number): number[] => {
    const laid: { i: number; wasBlocked: number }[] = [];
    const maxLen = 3 + Math.round(rng() * town.radius);
    let x = sx + dx;
    let y = sy + dy;
    let merged = false;
    while (inFoot(x, y) && laid.length < maxLen) {
      const i = y * cols + x;
      if (water[i]) break;
      if (road[i]) {
        merged = true;
        break;
      }
      if (lateralRoad(x, y, dx, dy, 2)) break;
      if (laid.length >= MIN_LEN && chance(rng, EARLY_STOP)) break;
      laid.push({ i, wasBlocked: blocked[i] });
      road[i] = ROAD_STREET; // clears any wild tree here (renderer replaces it)
      blocked[i] = 1;
      x += dx;
      y += dy;
    }
    if (!merged && laid.length < MIN_LEN) {
      for (const { i, wasBlocked } of laid) {
        road[i] = 0;
        blocked[i] = wasBlocked;
      }
      return [];
    }
    return laid.map((c) => c.i);
  };

  /** Sprout perpendicular lanes off the given road cells. */
  const spawnFrom = (sources: number[]): number[] => {
    const out: number[] = [];
    for (const i of sources) {
      const x = i % cols;
      const y = (i / cols) | 0;
      // Vertical lane: only where no parallel road already runs nearby.
      if (chance(rng, spawnChance) && !lateralRoad(x, y - 1, 0, 1, 2) && !lateralRoad(x, y + 1, 0, 1, 2)) {
        out.push(...march(x, y, 0, -1), ...march(x, y, 0, 1));
      }
      // Horizontal lane.
      if (chance(rng, spawnChance) && !lateralRoad(x - 1, y, 1, 0, 2) && !lateralRoad(x + 1, y, 1, 0, 2)) {
        out.push(...march(x, y, -1, 0), ...march(x, y, 1, 0));
      }
    }
    return out;
  };

  // First sources: every road cell already inside the footprint (the
  // arterials the highway pass laid through or into the settlement).
  let sources: number[] = [];
  for (let dy = -town.radius; dy <= town.radius; dy++) {
    for (let dx = -town.radius; dx <= town.radius; dx++) {
      if (dx * dx + dy * dy > r2) continue;
      const x = town.cx + dx;
      const y = town.cy + dy;
      if (!ctx.inBounds(x, y)) continue;
      if (road[y * cols + x]) sources.push(y * cols + x);
    }
  }

  for (let pass = 0; pass < passes && sources.length > 0; pass++) {
    sources = spawnFrom(sources);
  }
}
