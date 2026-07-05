/**
 * Highway growth — the arterial road network, grown FROM THE CITY CENTRE.
 *
 * Adapted from j9liu/roadgen (itself after Parish & Müller): highways are
 * marched by turtles that obey
 *
 *   GLOBAL GOALS — at every segment boundary a turtle samples the population
 *   field along rays (straight / left / right), weights each sample by 1/d,
 *   and steers toward the heaviest ray. Since settlements ARE the population
 *   peaks, highways thread themselves from the city through the towns without
 *   ever being told a destination. A straight-ahead bonus keeps runs long, and
 *   a net-rotation budget (roadgen's 180° rule) stops a turtle curling into a
 *   circle around a population hotspot.
 *
 *   LOCAL CONSTRAINTS — checked cell by cell: leaving the map ends the road
 *   (it reads as continuing beyond the world); stepping onto existing road
 *   merges and terminates (an intersection, roadgen's snap); running 1 cell
 *   parallel to another road touches it and terminates (snap-to-edge); water
 *   is probed ahead and crossed on a short bridge or steered around.
 *
 * Turtles seed from the city (4 ways) AND from every town (2 ways), and an
 * interconnection pass then guarantees a route between every city/town pair —
 * the map reads as a web of highways between settlements, not hub-and-spoke.
 * connectSettlements()/connectHamlets() are the safety nets for anything the
 * organic growth left roadless.
 */

import { chance } from "../../rng";
import { ROAD_HIGHWAY, ROAD_TRAIL, type Town, type WorldCtx } from "../../world";
import { routeToRoad, type WanderField } from "./pathfind";

/** Cells marched between steering (and branching) decisions. */
const SEGMENT = 6;
/** How far ahead (cells) a steering ray samples population. */
const RAY = 14;
/** Multiplier favouring straight-ahead at a steer, so runs stay long. */
const STRAIGHT_BONUS = 1.3;
/** Max water cells a highway will bridge; wider water turns it aside. */
const BRIDGE_MAX = 3;
/** |net turns| a turtle may accumulate (2 = 180°, roadgen's curl guard). */
const TURN_BUDGET = 2;
/** Population under which a branch will not spawn. */
const BRANCH_POP = 0.22;
/** Minimum cells between branch points on one turtle. */
const BRANCH_GAP = SEGMENT * 2;

/** Cardinal directions: E, S, W, N (index math relies on the order). */
const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
] as const;

interface Turtle {
  x: number;
  y: number;
  dir: number; // index into DIRS
  steps: number;
  sinceSteer: number;
  sinceBranch: number;
  netTurn: number; // +1 per right turn, -1 per left
  /** Cells during which the merge/parallel constraints are suspended, so a
   *  fresh turtle can leave its own settlement (and the roads other turtles
   *  laid across it) without instantly "merging" back into them. */
  immunity: number;
}

/**
 * Sum of population along a ray from (x,y) in direction d, each sample
 * weighted by 1/distance (roadgen's ray weight). Rays stop at the map edge.
 */
function rayWeight(ctx: WorldCtx, pop: Float32Array, x: number, y: number, dir: number): number {
  const [dx, dy] = DIRS[dir];
  let w = 0;
  for (let k = 1; k <= RAY; k++) {
    const nx = x + dx * k;
    const ny = y + dy * k;
    if (!ctx.inBounds(nx, ny)) break;
    w += pop[ny * ctx.cols + nx] / k;
  }
  return w;
}

/** Mark one cell as highway (idempotent over existing road). */
function lay(ctx: WorldCtx, x: number, y: number): void {
  const i = y * ctx.cols + x;
  if (!ctx.road[i]) ctx.road[i] = ROAD_HIGHWAY;
  ctx.blocked[i] = 1;
}

/**
 * March one turtle until it dies. Marks highway cells (and bridge cells over
 * water) as it goes; may push branch turtles onto `queue`.
 */
function march(ctx: WorldCtx, pop: Float32Array, turtle: Turtle, queue: Turtle[], maxTurtles: number): void {
  const { cols, rng, road, water } = ctx;
  const maxSteps = cols + ctx.rows;

  for (;;) {
    if (turtle.steps++ > maxSteps) return;

    // --- steer (global goals) at segment boundaries -----------------------
    if (turtle.sinceSteer >= SEGMENT) {
      turtle.sinceSteer = 0;
      let bestTurn = 0;
      let bestW = rayWeight(ctx, pop, turtle.x, turtle.y, turtle.dir) * STRAIGHT_BONUS;
      for (const turn of [-1, 1]) {
        if (Math.abs(turtle.netTurn + turn) > TURN_BUDGET) continue; // curl guard
        const w = rayWeight(ctx, pop, turtle.x, turtle.y, (turtle.dir + turn + 4) & 3);
        if (w > bestW) {
          bestW = w;
          bestTurn = turn;
        }
      }
      if (bestTurn !== 0) {
        turtle.netTurn += bestTurn;
        turtle.dir = (turtle.dir + bestTurn + 4) & 3;
      }

      // --- branch (global goals): fertile ground sprouts a perpendicular ---
      if (
        queue.length < maxTurtles &&
        turtle.sinceBranch >= BRANCH_GAP &&
        pop[turtle.y * cols + turtle.x] > BRANCH_POP &&
        chance(rng, 0.5)
      ) {
        const left = (turtle.dir + 3) & 3;
        const right = (turtle.dir + 1) & 3;
        const side =
          rayWeight(ctx, pop, turtle.x, turtle.y, left) >=
          rayWeight(ctx, pop, turtle.x, turtle.y, right)
            ? left
            : right;
        queue.push({
          x: turtle.x,
          y: turtle.y,
          dir: side,
          steps: 0,
          sinceSteer: 0,
          sinceBranch: 0,
          netTurn: 0,
          immunity: 2,
        });
        turtle.sinceBranch = 0;
      }
    }

    // --- advance one cell under local constraints -------------------------
    const [dx, dy] = DIRS[turtle.dir];
    let nx = turtle.x + dx;
    let ny = turtle.y + dy;

    if (!ctx.inBounds(nx, ny)) return; // exits the world — a road to elsewhere

    // Water: probe ahead; short crossings become bridges, wide water steers.
    if (water[ny * cols + nx]) {
      let landAt = -1;
      for (let k = 2; k <= BRIDGE_MAX + 1; k++) {
        const px = turtle.x + dx * k;
        const py = turtle.y + dy * k;
        if (!ctx.inBounds(px, py)) break;
        if (!water[py * cols + px]) {
          landAt = k;
          break;
        }
      }
      if (landAt > 0) {
        for (let k = 1; k < landAt; k++) lay(ctx, turtle.x + dx * k, turtle.y + dy * k);
        nx = turtle.x + dx * landAt;
        ny = turtle.y + dy * landAt;
      } else {
        // Turn along the shore toward whichever side is dry, random first try.
        let turned = false;
        for (const turn of chance(rng, 0.5) ? [-1, 1] : [1, -1]) {
          if (Math.abs(turtle.netTurn + turn) > TURN_BUDGET) continue;
          const dir = (turtle.dir + turn + 4) & 3;
          const [tx, ty] = DIRS[dir];
          if (ctx.inBounds(turtle.x + tx, turtle.y + ty) && !water[(turtle.y + ty) * cols + turtle.x + tx]) {
            turtle.netTurn += turn;
            turtle.dir = dir;
            turtle.sinceSteer = 0;
            turned = true;
            break;
          }
        }
        if (!turned) return; // boxed in by water
        continue;
      }
    }

    const ni = ny * cols + nx;

    if (turtle.immunity <= 0) {
      // Merge: stepping onto existing road is an intersection — snap and stop.
      if (road[ni]) {
        turtle.x = nx;
        turtle.y = ny;
        return;
      }
      // Parallel guard: about to hug another road 1 cell away — touch it and
      // stop (roadgen's snap-to-edge), rather than running alongside forever.
      const [px, py] = DIRS[(turtle.dir + 1) & 3];
      const sideA = ctx.inBounds(nx + px, ny + py) && road[(ny + py) * cols + nx + px];
      const sideB = ctx.inBounds(nx - px, ny - py) && road[(ny - py) * cols + nx - px];
      if (sideA || sideB) {
        lay(ctx, nx, ny);
        return;
      }
    }

    lay(ctx, nx, ny);
    turtle.x = nx;
    turtle.y = ny;
    turtle.sinceSteer++;
    turtle.sinceBranch++;
    if (turtle.immunity > 0) turtle.immunity--;
  }
}

/**
 * Grow the highway network: four seed turtles out of the city centre (one per
 * cardinal direction), two out of every town (along their best-population
 * rays), plus whatever branches they all sprout. `roadDensity` scales how
 * many turtles may run in total.
 */
export function growHighways(ctx: WorldCtx, pop: Float32Array, towns: Town[]): void {
  const density = Math.max(0, Math.min(1, ctx.tuning.roadDensity));
  const maxTurtles = 10 + Math.round(density * 8);

  const queue: Turtle[] = [];
  const seed = (t: Town, dir: number): void => {
    queue.push({
      x: t.cx,
      y: t.cy,
      dir,
      steps: 0,
      sinceSteer: 0,
      sinceBranch: 0,
      netTurn: 0,
      // Long enough to leave the settlement's own land (and the roads other
      // turtles laid across it) without merge-terminating on it.
      immunity: t.radius + 2,
    });
  };

  for (const t of towns) {
    if (t.tier === "city") {
      for (let dir = 0; dir < 4; dir++) seed(t, dir);
    } else if (t.tier === "town") {
      // The two heaviest rays: towns reach toward their neighbours, which is
      // what webs the settlements together instead of hub-and-spoke.
      const dirs = [0, 1, 2, 3]
        .map((dir) => ({ dir, w: rayWeight(ctx, pop, t.cx, t.cy, dir) }))
        .sort((a, b) => b.w - a.w);
      seed(t, dirs[0].dir);
      seed(t, dirs[1].dir);
    }
  }

  for (let t = 0; t < queue.length; t++) march(ctx, pop, queue[t], queue, maxTurtles);
}

/**
 * Interconnection guarantee: every pair of city/town settlements gets a
 * route. The route reuses existing road at a fraction of the open-country
 * step cost, so pairs the turtles already webbed together add little or
 * nothing new — but a pair whose network route would be a huge detour gets a
 * fresh highway shortcut, and no settlement pair is ever unlinked.
 */
export function interconnectTowns(ctx: WorldCtx, towns: Town[], wander: WanderField): void {
  const { cols, road, blocked } = ctx;
  const hubs = towns.filter((t) => t.tier !== "hamlet");

  for (let a = 0; a < hubs.length; a++) {
    for (let b = a + 1; b < hubs.length; b++) {
      const target = hubs[b];
      const r2 = target.radius * target.radius;
      const nearTarget = (j: number): boolean => {
        const x = j % cols;
        const y = (j / cols) | 0;
        return (x - target.cx) ** 2 + (y - target.cy) ** 2 <= r2;
      };
      const path = routeToRoad(
        ctx,
        wander,
        hubs[a].cy * cols + hubs[a].cx,
        (j) => road[j] > 0 && nearTarget(j),
      );
      if (!path) continue;
      for (const c of path) {
        if (!road[c]) road[c] = ROAD_HIGHWAY;
        blocked[c] = 1;
      }
    }
  }
}

/** Any road inside the settlement's footprint (or, for a hamlet, close by)? */
function reached(ctx: WorldCtx, t: Town): boolean {
  const { cols, road } = ctx;
  const r = t.tier === "hamlet" ? 2 : t.radius;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const x = t.cx + dx;
      const y = t.cy + dy;
      if (!ctx.inBounds(x, y)) continue;
      if (road[y * cols + x]) return true;
    }
  }
  return false;
}

/** Lay a least-cost connector from the settlement centre to any road. */
function connectOne(ctx: WorldCtx, t: Town, wander: WanderField, cls: number): void {
  const { cols, road, blocked } = ctx;
  const path = routeToRoad(ctx, wander, t.cy * cols + t.cx, (j) => road[j] > 0);
  if (!path) return;
  for (const c of path) {
    if (!road[c]) road[c] = cls;
    blocked[c] = 1;
  }
}

/**
 * Safety net for cities/towns the organic growth left roadless (a turtle can
 * die on a peninsula): give them a HIGHWAY connector so the interconnection
 * pass always has something to route to.
 */
export function connectSettlements(ctx: WorldCtx, towns: Town[], wander: WanderField): void {
  for (const t of towns) {
    if (t.tier === "hamlet") continue;
    if (!reached(ctx, t)) connectOne(ctx, t, wander, ROAD_HIGHWAY);
  }
}

/** Hamlets join last, with humble dirt lanes onto the finished web. */
export function connectHamlets(ctx: WorldCtx, towns: Town[], wander: WanderField): void {
  for (const t of towns) {
    if (t.tier !== "hamlet") continue;
    if (!reached(ctx, t)) connectOne(ctx, t, wander, ROAD_TRAIL);
  }
}
