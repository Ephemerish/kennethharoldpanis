/**
 * Town founding: pick where settlements go before nature grows or any road is
 * laid.
 *
 * Founding runs FIRST (the nature stage calls it before planting anything) so
 * every later stage agrees on where the settlements are; the wild still grows
 * over their land, and streets/buildings clear it as they come. Candidate
 * sites are random open cells scored like a settler would score them — dry
 * buildable land around (openness) and fresh water nearby — then greedily
 * accepted best-first with footprint-aware spacing so settlements spread
 * across the map. The best site becomes the map's one CITY, the next few
 * become TOWNS (paved lanes, buildings, farmland), and the rest are HAMLETS
 * (a trail junction with a couple of buildings).
 *
 * The city is the map's centrepiece, so its site is held to a higher bar: the
 * whole footprint must sit on the map and on mostly dry land, never clipped by
 * an edge or drowned in a bay.
 */

import type { Town, TownTier, WorldCtx } from "../../world";

/** Openness is measured over this radius around the candidate centre. */
const OPENNESS_RADIUS = 3;
/** Water within this range counts toward the site score. */
const WATER_SEARCH_RADIUS = 6;

/** Settlement footprint radius (cells) per tier; the city scales with the map.
 *  The city sprawls: its footprint is a proper district filled by the street
 *  grid, an order of magnitude more area than a town. */
function radiusFor(tier: TownTier, cols: number, rows: number): number {
  if (tier === "city") return Math.max(8, Math.min(16, Math.round(Math.min(cols, rows) / 3.5)));
  return tier === "town" ? 6 : 3;
}

/** First pick is the city, the next three are towns, the rest hamlets. */
function tierFor(order: number): TownTier {
  if (order === 0) return "city";
  return order <= 3 ? "town" : "hamlet";
}

/**
 * Score a candidate centre, or -Infinity if unbuildable (needs a clear 3x3
 * core to seed from). Openness dominates; water proximity is a strong bonus.
 */
function siteScore(ctx: WorldCtx, cx: number, cy: number): number {
  const { cols, rows, water, blocked } = ctx;

  // The core (3x3 around the centre) must be fully in-bounds and clear.
  if (cx < 1 || cy < 1 || cx > cols - 2 || cy > rows - 2) return -Infinity;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (blocked[(cy + dy) * cols + (cx + dx)]) return -Infinity;
    }
  }

  // Openness: fraction of unblocked cells in the neighbourhood (room to build).
  let open = 0;
  let total = 0;
  for (let dy = -OPENNESS_RADIUS; dy <= OPENNESS_RADIUS; dy++) {
    for (let dx = -OPENNESS_RADIUS; dx <= OPENNESS_RADIUS; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      total++;
      if (!blocked[ny * cols + nx]) open++;
    }
  }

  // Water proximity: closer fresh water scores higher (settlements hug shores).
  let waterDist = Infinity;
  for (let dy = -WATER_SEARCH_RADIUS; dy <= WATER_SEARCH_RADIUS; dy++) {
    for (let dx = -WATER_SEARCH_RADIUS; dx <= WATER_SEARCH_RADIUS; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      if (!water[ny * cols + nx]) continue;
      const d = Math.max(Math.abs(dx), Math.abs(dy));
      if (d < waterDist) waterDist = d;
    }
  }
  const waterBonus =
    waterDist <= WATER_SEARCH_RADIUS ? ((WATER_SEARCH_RADIUS + 1 - waterDist) / WATER_SEARCH_RADIUS) * 1.5 : 0;

  return (open / total) * 2 + waterBonus;
}

/**
 * Is (cx,cy) fit to be the CITY centre? The whole footprint must sit on the
 * map, and at most a sliver of it may be water — the city hugs a shore, it
 * doesn't drown in the bay or get clipped by the map edge.
 */
function cityFits(ctx: WorldCtx, cx: number, cy: number, r: number): boolean {
  const { cols, rows, water } = ctx;
  if (cx < r || cy < r || cx > cols - 1 - r || cy > rows - 1 - r) return false;
  let wet = 0;
  let total = 0;
  const r2 = r * r;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r2) continue;
      total++;
      if (water[(cy + dy) * cols + (cx + dx)]) wet++;
    }
  }
  return wet <= total * 0.12;
}

/**
 * Found up to `3 + roadDensity*3` settlements (3..6) and record them on
 * `ctx.towns`. Returns them best-site-first (index 0 is the city).
 */
export function planTowns(ctx: WorldCtx): Town[] {
  const { cols, rows, rng, tuning } = ctx;
  const density = Math.max(0, Math.min(1, tuning.roadDensity));
  const count = 3 + Math.round(density * 3);

  // Score a pool of random candidates...
  const candidates: { cx: number; cy: number; score: number }[] = [];
  const tries = count * 30;
  for (let t = 0; t < tries; t++) {
    const cx = 2 + ((rng() * (cols - 4)) | 0);
    const cy = 2 + ((rng() * (rows - 4)) | 0);
    const score = siteScore(ctx, cx, cy);
    if (score > -Infinity) candidates.push({ cx, cy, score });
  }
  candidates.sort((a, b) => b.score - a.score);

  // ...then accept best-first. Spacing is footprint-aware: two settlements
  // must keep a farm-belt's worth of open country between their circles, so
  // the sprawling city can never fuse with a neighbouring town.
  const towns: Town[] = [];
  const cityRadius = radiusFor("city", cols, rows);
  const accept = (c: { cx: number; cy: number }, tier: TownTier): boolean => {
    const radius = radiusFor(tier, cols, rows);
    for (const t of towns) {
      const gap = t.radius + radius + 4;
      if ((t.cx - c.cx) ** 2 + (t.cy - c.cy) ** 2 < gap * gap) return false;
    }
    towns.push({ cx: c.cx, cy: c.cy, radius, tier });
    return true;
  };

  // The city first: best-scored site whose full footprint fits. If no site on
  // the map can seat the whole footprint (tiny or waterlogged maps), fall back
  // to the best site anyway — a clipped city beats no city.
  const citySite = candidates.find((c) => cityFits(ctx, c.cx, c.cy, cityRadius)) ?? candidates[0];
  if (citySite) accept(citySite, "city");

  for (const c of candidates) {
    if (towns.length >= count) break;
    if (c === citySite) continue;
    accept(c, tierFor(towns.length));
  }

  ctx.towns.push(...towns);
  return towns;
}
