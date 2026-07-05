/**
 * What gets built where: per-tier building lists, props, and budgets.
 *
 * Built on the verified Civilized atlas: the city can raise the four 3x3
 * facades (halls/gatehouses) and, rarely, the 1x9 windmill tower; towns keep
 * to a hall plus market tents and statues; hamlets get little more than tents
 * and storage. Street decor is notice boards / urns / cook pots; the country
 * between settlements gets shaped signposts and the odd graveyard. Budgets
 * are per settlement and further scaled by `roadDensity` in the stage.
 */

import {
  CIVILIZED_BUILDINGS,
  CIVILIZED_LANDMARKS,
  CIVILIZED_PROPS,
  CIVILIZED_SIGNS,
  CIVILIZED_STATUES,
  type TileCoord,
  type TileRect,
} from "../../bountiful-bits";
import type { TownTier } from "../../world";

export interface WeightedBuilding {
  rect: TileRect;
  weight: number;
}

/** Wrap a single-tile coordinate as a 1x1 rect for the placement helpers. */
function rect1([col, row]: TileCoord): TileRect {
  return { col, row, w: 1, h: 1 };
}

/** Structures each settlement tier may raise; big landmarks stay rare. */
export const BUILDINGS_BY_TIER: Record<TownTier, WeightedBuilding[]> = {
  city: [
    { rect: CIVILIZED_BUILDINGS.hallA, weight: 5 },
    { rect: CIVILIZED_BUILDINGS.hallB, weight: 5 },
    { rect: CIVILIZED_BUILDINGS.gatehouseA, weight: 3 },
    { rect: CIVILIZED_BUILDINGS.gatehouseB, weight: 3 },
    { rect: rect1(CIVILIZED_PROPS.tent[0]), weight: 3 },
    { rect: rect1(CIVILIZED_PROPS.tent[1]), weight: 3 },
    { rect: CIVILIZED_STATUES.large, weight: 2 },
    { rect: CIVILIZED_LANDMARKS.shrine, weight: 2 },
    { rect: CIVILIZED_LANDMARKS.windmill, weight: 1 },
  ],
  town: [
    { rect: CIVILIZED_BUILDINGS.hallB, weight: 2 },
    { rect: rect1(CIVILIZED_PROPS.tent[0]), weight: 5 },
    { rect: rect1(CIVILIZED_PROPS.tent[1]), weight: 5 },
    { rect: CIVILIZED_STATUES.small, weight: 2 },
    { rect: CIVILIZED_LANDMARKS.shrine, weight: 2 },
    { rect: rect1(CIVILIZED_PROPS.cookPot[0]), weight: 2 },
  ],
  hamlet: [
    { rect: rect1(CIVILIZED_PROPS.tent[0]), weight: 4 },
    { rect: rect1(CIVILIZED_PROPS.cookPot[0]), weight: 2 },
    { rect: rect1(CIVILIZED_PROPS.chest[0]), weight: 1 },
  ],
};

/** Street decor filling leftover roadside spots inside settlements. */
export const STREET_PROPS: TileRect[] = [
  ...CIVILIZED_PROPS.noticeBoard.map(rect1),
  ...CIVILIZED_PROPS.urn.map(rect1),
  ...CIVILIZED_PROPS.basin.map(rect1),
  rect1(CIVILIZED_PROPS.flag[0]),
];

/** Wayside signs along rural trails: stacked totems and small round signs. */
export const RURAL_SIGNS: TileRect[] = [...CIVILIZED_SIGNS.totems, ...CIVILIZED_SIGNS.roundSmall];

/** Grave markers for rural graveyards. */
export const GRAVE_TILES: TileRect[] = [
  ...CIVILIZED_PROPS.gravestone.map(rect1),
  ...CIVILIZED_PROPS.graveCross.map(rect1),
];

/** Statue placed at the heart of some parks. */
export const PARK_STATUE: TileRect = CIVILIZED_STATUES.small;

/** Building placements per settlement, before the density multiplier. The
 *  city budget assumes the full cleared street grid: enough pieces to pack the
 *  central blocks solid and thin out toward the sprawl's ragged edge. */
export const BUILD_BUDGET: Record<TownTier, number> = { city: 70, town: 14, hamlet: 3 };

/** Parks per settlement (green pockets; see ./parks.ts). */
export const PARK_COUNT: Record<TownTier, number> = { city: 4, town: 1, hamlet: 0 };

/** Street-prop placements per settlement. */
export const STREET_PROP_BUDGET: Record<TownTier, number> = { city: 18, town: 5, hamlet: 1 };

/** Fenced crop fields per settlement — hamlets are farmsteads. */
export const FARM_COUNT: Record<TownTier, number> = { city: 1, town: 1, hamlet: 2 };
