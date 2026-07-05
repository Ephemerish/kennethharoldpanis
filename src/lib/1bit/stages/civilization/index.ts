/**
 * Stage 4: civilization.
 *
 * Builds up the settlements the road stage founded (`ctx.towns`), so the map
 * reads as a lived-in region — a dense city, smaller towns, wayside hamlets —
 * instead of buildings scattered wherever a trail happens to run:
 *
 *   1. BUILDINGS: for each settlement, take the open cells that border a road
 *      inside its footprint and fill them plaza-outward (nearest the centre
 *      first, with jitter so the edge stays ragged) with weighted-random
 *      structures from the tier's catalog (./catalog.ts) — the city can raise
 *      the 3x3 halls and, rarely, the windmill tower; hamlets get little more
 *      than market tents. A structure's whole footprint must fit over clear
 *      ground. Budgets scale with tier and `roadDensity`.
 *   2. PARKS (./parks.ts): cities and towns keep deliberate green pockets —
 *      groves of trees/flowers, sometimes around a statue — on the nature
 *      layer inside the footprint.
 *   3. FARMS & BOATS (./farms.ts): fenced crop fields ring the outskirts
 *      (hamlets get two — they're farmsteads), and waterside settlements get
 *      boats moored on the nearby shore.
 *   4. STREET DECOR: notice boards, urns, basins and flags fill leftover
 *      street-side spots in settlements.
 *   5. RURAL DRESSING (./rural.ts): every trail waypoint becomes a point of
 *      interest (shrine, statue, graveyard or camp), with sparse shaped
 *      signposts along the paths between them.
 *
 * Every placed footprint is marked `blocked` so pieces never overlap.
 */

import { pick, pickWeighted } from "../../rng";
import type { PlacedTile, Stage, WorldCtx } from "../../world";
import {
  BUILD_BUDGET,
  BUILDINGS_BY_TIER,
  FARM_COUNT,
  PARK_COUNT,
  STREET_PROP_BUDGET,
  STREET_PROPS,
} from "./catalog";
import { fits, place, roadsideCells, shuffle } from "./placement";
import { placePark } from "./parks";
import { placeBoats, placeFarm } from "./farms";
import { decorateWaypoints, placeSigns } from "./rural";

/** Softens the plaza-outward fill so buildings don't ring the centre. */
const SITE_JITTER = 3;

export const civilizationStage: Stage = {
  name: "civ",
  build(ctx: WorldCtx): PlacedTile[] {
    const { cols, rng, blocked, tuning, towns } = ctx;
    const out: PlacedTile[] = [];

    const sites = shuffle(rng, roadsideCells(ctx));
    if (sites.length === 0) return out; // no roads -> no settlement

    const densityScale = 0.6 + 0.8 * Math.max(0, Math.min(1, tuning.roadDensity));

    for (const town of towns) {
      // This settlement's build spots, packed toward the plaza.
      const r2 = town.radius * town.radius;
      const local = sites
        .filter((i) => {
          const dx = (i % cols) - town.cx;
          const dy = ((i / cols) | 0) - town.cy;
          return dx * dx + dy * dy <= r2;
        })
        .map((i) => {
          const dx = (i % cols) - town.cx;
          const dy = ((i / cols) | 0) - town.cy;
          return { i, rank: Math.sqrt(dx * dx + dy * dy) + rng() * SITE_JITTER };
        })
        .sort((a, b) => a.rank - b.rank)
        .map((s) => s.i);

      // Buildings first, so landmarks claim space before greenery and props.
      const catalog = BUILDINGS_BY_TIER[town.tier];
      let budget = Math.max(1, Math.round(BUILD_BUDGET[town.tier] * densityScale));
      for (const site of local) {
        if (budget <= 0) break;
        const cx = site % cols;
        const cy = (site / cols) | 0;
        // A few weighted tries so a too-big pick doesn't waste the whole site.
        for (let attempt = 0; attempt < 3; attempt++) {
          const b = pickWeighted(rng, catalog, (s) => s.weight);
          if (!b) break;
          if (fits(ctx, cx, cy, b.rect)) {
            place(ctx, out, cx, cy, b.rect);
            budget--;
            break;
          }
        }
      }

      for (let p = 0; p < PARK_COUNT[town.tier]; p++) placePark(ctx, out, town);
      for (let f = 0; f < FARM_COUNT[town.tier]; f++) placeFarm(ctx, out, town);
      placeBoats(ctx, out, town);

      // Street decor on the spots buildings and parks left open.
      let props = STREET_PROP_BUDGET[town.tier];
      for (const site of local) {
        if (props <= 0) break;
        if (blocked[site]) continue;
        if (rng() > 0.5) continue; // skip some spots so decor spaces out
        const cx = site % cols;
        const cy = (site / cols) | 0;
        const prop = pick(rng, STREET_PROPS);
        if (fits(ctx, cx, cy, prop)) {
          place(ctx, out, cx, cy, prop);
          props--;
        }
      }
    }

    decorateWaypoints(ctx, out);
    placeSigns(ctx, out, sites);

    return out;
  },
};
