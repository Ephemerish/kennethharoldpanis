/**
 * Stage 3: settlements & roads.
 *
 * Founds the map's settlements and grows the route hierarchy that connects
 * them, so the world reads as inhabited before the civilization stage erects
 * buildings. The road logic follows j9liu/roadgen (after Parish & Müller's
 * "Procedural Modeling of Cities"), adapted to this 4-connected tile grid:
 *
 *   1. TOWNS (./towns.ts): settlement sites (open buildable land, near
 *      water), spaced across the map; best site = the CITY — the root of the
 *      road network — then towns, then hamlets. Founded during the NATURE
 *      stage; the wild overgrows their land and the roads clear it.
 *   2. POPULATION (./population.ts): a density field peaked at every
 *      settlement — the global goal highway turtles steer by.
 *   3. HIGHWAYS (./highways.ts): turtles march out of the CITY CENTRE (and
 *      out of every town), steering toward population so they thread through
 *      settlements, branching on fertile ground, snapping onto roads they
 *      meet, bridging thin water. An interconnection pass then guarantees a
 *      route between every city/town pair — a WEB of highways, not a hub and
 *      spokes — and hamlets join with dirt lanes.
 *   4. STREETS (./streets.ts): inside cities and towns, lanes sprout off the
 *      arterials at irregular intervals and lengths — a European tangle of
 *      through-lanes and dead-end courts, no square and no uniform grid.
 *   5. WAYPOINTS (./network.ts): a few wild-country spots get dirt trails
 *      that wander to the nearest road, so footpaths lead somewhere.
 *   6. RENDER (./render.ts): paved cells use the sheet's solid street kit,
 *      with corners/Ts/crossroads composed from strip caps and middles;
 *      outside settlement aprons the highway wears down to autotiled dirt
 *      footpath, more the farther out it runs; water crossings become plank
 *      bridges.
 *
 * Road cells are marked `blocked` so civilization builds beside roads, never
 * on them.
 */

import { ROAD_TRAIL, type PlacedTile, type Stage, type WorldCtx } from "../../world";
import { planTowns } from "./towns";
import { growStreets } from "./streets";
import { pickWaypoints } from "./network";
import { buildWanderField, routeToRoad } from "./pathfind";
import { buildPopulationField } from "./population";
import { connectHamlets, connectSettlements, growHighways, interconnectTowns } from "./highways";
import { renderRoads } from "./render";

export const roadStage: Stage = {
  name: "road",
  build(ctx: WorldCtx): PlacedTile[] {
    const { blocked, road, tuning } = ctx;
    const out: PlacedTile[] = [];
    const density = Math.max(0, Math.min(1, tuning.roadDensity));

    // Settlements were founded before nature grew (see ../nature) so every
    // stage agrees on them; plan them here only if the nature stage didn't run.
    const towns = ctx.towns.length > 0 ? ctx.towns : planTowns(ctx);
    if (towns.length === 0) return out;

    // Highways: organic growth from the city and towns toward population,
    // a safety net for any town left roadless, then the pairwise
    // interconnection guarantee, and finally the hamlets' dirt lanes.
    const pop = buildPopulationField(ctx, towns);
    const wander = buildWanderField(ctx);
    growHighways(ctx, pop, towns);
    connectSettlements(ctx, towns, wander);
    interconnectTowns(ctx, towns, wander);
    connectHamlets(ctx, towns, wander);

    // Streets branch off the arterials inside each city/town footprint.
    for (const town of towns) growStreets(ctx, town);

    // Rural waypoints: recorded on the world so the civilization stage can
    // put a point of interest at each — trails lead somewhere, not into thin
    // air. Each gets a dirt trail that merges into the network.
    const waypointCount = Math.round(2 + density * 5);
    const waypoints = pickWaypoints(ctx, waypointCount, towns);
    ctx.waypoints.push(...waypoints);
    for (const w of waypoints) {
      const path = routeToRoad(ctx, wander, w, (j) => road[j] > 0);
      if (!path) continue;
      for (const c of path) {
        if (!road[c]) road[c] = ROAD_TRAIL;
        blocked[c] = 1;
      }
    }

    renderRoads(ctx, out);
    return out;
  },
};
