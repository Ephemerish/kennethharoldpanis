/**
 * Stage 3: settlements & roads.
 *
 * Founds the map's settlements and lays the routes that connect them, so the
 * world reads as inhabited — a city with paved streets, outlying towns and
 * hamlets, and dirt footpaths wandering the wilds between them — before the
 * civilization stage erects buildings.
 *
 *   1. TOWNS (./towns.ts): settlement sites (open buildable land, near water),
 *      spaced across the map; best site = the city, then towns, then hamlets.
 *      Founded during the NATURE stage so their land was kept clear of trees;
 *      read from `ctx.towns` here and by the civilization stage.
 *   2. PLAZAS & STREETS (./render.ts, ./streets.ts): cities and towns get a
 *      3x3 town square at their centre and a block grid of streets clipped to
 *      their footprint — long connected paved lines the buildings will face.
 *   3. NETWORK (./network.ts): anchors = town centres + rural waypoints;
 *      connect them with a spanning-tree backbone plus nearest-neighbour
 *      loops. `roadDensity` scales both settlement and waypoint counts.
 *   4. ROUTES (./pathfind.ts): each edge becomes a least-cost 4-connected
 *      path — forests costly, existing road cheap (branches merge), a noise
 *      field making trails meander. Water carries a steep bridge premium, so
 *      routes ford thin rivers on a cell or two of bridge but detour around
 *      anything wider.
 *   5. RENDER (./render.ts): in-town road cells become paved streets, open
 *      country becomes autotiled dirt trails, and water crossings become
 *      plank bridges.
 *
 * Road cells are marked `blocked` so civilization builds beside roads, never
 * on them.
 */

import type { PlacedTile, Stage, WorldCtx } from "../../world";
import { planTowns } from "./towns";
import { layStreets } from "./streets";
import { networkEdges, pickWaypoints } from "./network";
import { buildWanderField, routePath } from "./pathfind";
import { renderRoads, stampPlaza } from "./render";

// Beyond the spanning-tree backbone, wire each anchor to this many nearest
// neighbours so the network gains loops and reads as a web of routes rather
// than a single branching tree.
const EXTRA_NEIGHBORS = 2;

export const roadStage: Stage = {
  name: "road",
  build(ctx: WorldCtx): PlacedTile[] {
    const { cols, rows, blocked, road, tuning } = ctx;
    const out: PlacedTile[] = [];
    const density = Math.max(0, Math.min(1, tuning.roadDensity));

    // Settlements were founded before nature grew (see ../nature) so their
    // land is clear; plan them here only if the nature stage didn't run.
    // Cities and towns get their plaza and street grid BEFORE the trails are
    // routed, so incoming roads treat the streets as existing (cheap) road and
    // follow the grid in to the plaza.
    const towns = ctx.towns.length > 0 ? ctx.towns : planTowns(ctx);
    const plaza = new Uint8Array(cols * rows);
    for (const town of towns) {
      if (town.tier !== "hamlet") stampPlaza(ctx, out, town, plaza);
      layStreets(ctx, town);
    }

    // Anchors: every settlement centre plus a few wild-country waypoints.
    // Waypoints are recorded on the world so the civilization stage can put a
    // point of interest at each — trails lead somewhere, not into thin air.
    const waypointCount = Math.round(2 + density * 5);
    const waypoints = pickWaypoints(ctx, waypointCount, towns);
    ctx.waypoints.push(...waypoints);
    const anchors = [...towns.map((t) => t.cy * cols + t.cx), ...waypoints];
    if (anchors.length < 2) return out;

    const wander = buildWanderField(ctx);
    for (const [a, b] of networkEdges(anchors, cols, EXTRA_NEIGHBORS)) {
      const path = routePath(ctx, road, wander, anchors[a], anchors[b]);
      if (path) {
        for (const c of path) {
          road[c] = 1;
          blocked[c] = 1;
        }
      }
    }

    renderRoads(ctx, out, plaza);
    return out;
  },
};
