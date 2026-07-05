/**
 * The generation pipeline: ordered stages, run sequentially.
 *
 * One FOLDER per stage — each folder's index.ts exports the Stage and its
 * supporting logic lives in sibling modules (heightfield/rivers for water,
 * towns/population/highways/streets/render for roads, ...).
 *
 * The renderer builds each stage in turn (each mutates the shared world and
 * returns tiles to draw) and reveals its tiles before moving to the next, so
 * the world assembles in front of the visitor: water first, then wild nature,
 * then the settlements and the roads that join them — paved streets in town,
 * dirt footpaths through the country — and finally the buildings and parks
 * that fill the settlements in.
 */

import type { Stage } from "../world";
import { waterStage } from "./water";
import { natureStage } from "./nature";
import { roadStage } from "./roads";
import { civilizationStage } from "./civilization";

export const PIPELINE: Stage[] = [
  waterStage,
  natureStage,
  roadStage,
  civilizationStage,
];

export { waterStage, natureStage, roadStage, civilizationStage };
