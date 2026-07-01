/**
 * The generation pipeline: ordered stages, run sequentially.
 *
 * The renderer builds each stage in turn (each mutates the shared world and
 * returns tiles to draw) and reveals its tiles before moving to the next, so the
 * world assembles in front of the visitor: water first, then nature. Roads and
 * civilization are the next phases to add here.
 */

import type { Stage } from "../world";
import { waterStage } from "./water";
import { natureStage } from "./nature";

export const PIPELINE: Stage[] = [
  waterStage,
  natureStage,
  // TODO phase 3: roadsStage (dirt paths + Civilized roads)
  // TODO phase 4: civilizationStage (houses, wells, structures build-list)
];

export { waterStage, natureStage };
