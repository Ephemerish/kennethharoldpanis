/**
 * Turning the road mask into tiles — with the sheet's REAL street assets.
 *
 *   - PAVED ROAD: streets, and every highway stretch that still has its
 *     pavement, render from the SOLID street kit (see CIVILIZED_STREETS):
 *     seamless middles along straights, rounded caps at dead ends and
 *     wherever the pavement gives out. Junctions are COMPOSED from the strip
 *     pieces — a corner is two end caps meeting, a T is a through-strip with
 *     a stub capping into it, a crossroads is the two through-strips overlaid
 *     — so every intersection type looks like what it is; there is no stamped
 *     junction square.
 *   - WEAR: the highway is a backend concept — outside settlement aprons a
 *     noise field wears stretches of it down to bare dirt, and the farther
 *     from a city/town the more of it is worn away. A remote "highway" is
 *     mostly footpath with surviving slabs of pavement; the caps at each
 *     paved stub sell the transition.
 *   - DIRT: trails and worn highway autotile with the speckled DIRT template
 *     against the FULL road mask, so dirt flows into pavement without false
 *     coastlines.
 *   - BRIDGES: road cells over water render as planks (horizontal) or the
 *     runged walkway (vertical), whatever the road class.
 */

import {
  CIVILIZED_PROPS,
  CIVILIZED_STREETS,
  DIRT_SOLID_TILE,
  NATURE_DIRT_TILES,
  type TileCoord,
} from "../../bountiful-bits";
import { autotileMask } from "../../autotile";
import { fbm2D } from "../../noise";
import { pick, randSeed } from "../../rng";
import { ROAD_HIGHWAY, ROAD_STREET, type PlacedTile, type WorldCtx } from "../../world";

/** Cells beyond a city/town footprint that always keep their pavement, so
 *  every settlement approach reads paved. */
const PAVED_APRON = 2;
/** Wear-noise lattice period (cells) — patches a handful of cells long. */
const WEAR_FREQ = 0.12;
/** Distance (cells past the apron) at which wear pressure saturates. */
const WEAR_RANGE = 10;
/** Combined wear score above this loses the pavement. */
const WEAR_CUT = 0.55;

/**
 * The street tiles for a paved cell, from its paved 4-neighbourhood. Always
 * the solid skin. Junctions overlay two strip pieces (the tiles are white on
 * alpha, so overlaps union cleanly):
 *   corner = the two arriving strips' end caps tucked into each other,
 *   T      = the through strip with the stub's end cap joining it,
 *   cross  = both through strips.
 */
function streetTiles(n: number, e: number, s: number, w: number, alt: boolean): TileCoord[] {
  const kit = CIVILIZED_STREETS.solid;
  const v = alt ? kit.vAlt : kit.v;
  const h = alt ? kit.hAlt : kit.h;

  const deg = n + e + s + w;
  if (deg === 4) return [v.mid, h.mid]; // crossroads
  if (deg === 3) {
    if (!n) return [h.mid, v.capN]; // stub from the south caps into the through road
    if (!s) return [h.mid, v.capS];
    if (!e) return [v.mid, h.capE];
    return [v.mid, h.capW];
  }
  if (n && s) return [v.mid];
  if (e && w) return [h.mid];
  if (deg === 2) {
    // Corner: the strip from each side ends here; their caps overlap into an L.
    if (n && e) return [v.capS, h.capW];
    if (n && w) return [v.capS, h.capE];
    if (s && e) return [v.capN, h.capW];
    return [v.capN, h.capE];
  }
  // Dead ends: close the strip with the cap facing away from the road.
  if (e) return [h.capW];
  if (w) return [h.capE];
  if (s) return [v.capN];
  if (n) return [v.capS];
  return [h.capW, h.capE]; // isolated slab (rare): a one-cell capsule
}

/**
 * Render every road cell: plank bridges over water, street tiles where
 * pavement stands, autotiled dirt for trails and worn-away highway.
 */
export function renderRoads(ctx: WorldCtx, out: PlacedTile[]): void {
  const { cols, rows, tilePx, rng, road, water, towns } = ctx;
  const n = cols * rows;

  // --- wear: does this highway cell still have its pavement? ---------------
  const wearNoise = fbm2D(randSeed(rng), 2, 0.5);
  const settlements = towns.filter((t) => t.tier !== "hamlet");
  const worn = (cx: number, cy: number): boolean => {
    let past = Infinity;
    for (const t of settlements) {
      const d = Math.hypot(cx - t.cx, cy - t.cy) - t.radius;
      if (d < past) past = d;
    }
    if (past <= PAVED_APRON) return false; // approaches stay paved
    const pressure = Math.min((past - PAVED_APRON) / WEAR_RANGE, 1);
    // Far from civilization nearly all pavement is gone (worn unless the
    // noise dips under ~0.08); at mid distance roughly half survives.
    return wearNoise(cx * WEAR_FREQ, cy * WEAR_FREQ) * 0.65 + pressure * 0.5 > WEAR_CUT;
  };

  // --- classify every road cell --------------------------------------------
  const road01 = new Uint8Array(n); // normalized full mask for the autotiler
  const paved = new Uint8Array(n); // street-kit cells
  const dirt = new Uint8Array(n); // trails + worn highway
  const bridges: number[] = [];

  for (let i = 0; i < n; i++) {
    if (!road[i]) continue;
    road01[i] = 1;
    if (water[i]) {
      bridges.push(i);
      continue;
    }
    const cx = i % cols;
    const cy = (i / cols) | 0;
    if (road[i] === ROAD_STREET || (road[i] === ROAD_HIGHWAY && !worn(cx, cy))) paved[i] = 1;
    else dirt[i] = 1;
  }

  // --- dirt trails ----------------------------------------------------------
  // Autotiled against the FULL road mask (renderMask = dirt) so the dirt runs
  // seamlessly into pavement and bridges instead of drawing a false coast.
  out.push(...autotileMask(road01, cols, rows, tilePx, NATURE_DIRT_TILES, "road", DIRT_SOLID_TILE, dirt));

  // --- paved streets --------------------------------------------------------
  // Out of bounds counts as paved so a highway running off the map keeps its
  // middle tile to the edge instead of capping in-frame.
  const pavedAt = (x: number, y: number): number =>
    x >= 0 && x < cols && y >= 0 && y < rows ? paved[y * cols + x] : 1;

  for (let i = 0; i < n; i++) {
    if (!paved[i]) continue;
    const cx = i % cols;
    const cy = (i / cols) | 0;
    const alt = ((cx * 31 + cy * 17) & 3) === 0; // sprinkle the alt dash phase
    for (const [col, row] of streetTiles(
      pavedAt(cx, cy - 1),
      pavedAt(cx + 1, cy),
      pavedAt(cx, cy + 1),
      pavedAt(cx - 1, cy),
      alt,
    )) {
      out.push({ col, row, x: cx * tilePx, y: cy * tilePx, layer: "road", sheet: "civilized" });
    }
  }

  // --- bridges ---------------------------------------------------------------
  // The crossing direction comes from where the road continues — horizontal
  // crossings get plank boardwalk tiles, vertical ones the runged ladder tile
  // (rails + rungs read as a walkway from above). Drawn over the water tile,
  // whose texture shows through the gaps.
  for (const i of bridges) {
    const cx = i % cols;
    const cy = (i / cols) | 0;
    const horizontal = (cx > 0 && road[i - 1] > 0) || (cx < cols - 1 && road[i + 1] > 0);
    const tile: TileCoord = horizontal ? pick(rng, CIVILIZED_PROPS.bridge) : CIVILIZED_PROPS.ladder[0];
    out.push({
      col: tile[0],
      row: tile[1],
      x: cx * tilePx,
      y: cy * tilePx,
      layer: "road",
      sheet: "civilized",
    });
  }
}
