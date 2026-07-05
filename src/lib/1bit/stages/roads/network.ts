/**
 * Rural WAYPOINTS — open-country spots that dirt trails lead to, so the map
 * keeps natural footpaths that wander the wilds instead of only the highway
 * web. Each waypoint later gets a point of interest (shrine, camp, ...) from
 * the civilization stage, and each is joined to the road network by a
 * least-cost trail (see ./pathfind.ts).
 */

import type { Town, WorldCtx } from "../../world";

/**
 * Rejection-sample `count` open-ground cells for rural waypoints, spread out
 * by a minimum spacing and kept outside settlement footprints.
 */
export function pickWaypoints(ctx: WorldCtx, count: number, towns: Town[]): number[] {
  const { cols, rows, rng, blocked } = ctx;
  const waypoints: number[] = [];
  const minSpacing = Math.max(3, Math.min(cols, rows) / 6);
  const minSpacing2 = minSpacing * minSpacing;

  for (let tries = 0; waypoints.length < count && tries < count * 60; tries++) {
    // Keep off the 1-cell border so trails have room to curve inward.
    const cx = 1 + ((rng() * (cols - 2)) | 0);
    const cy = 1 + ((rng() * (rows - 2)) | 0);
    const i = cy * cols + cx;
    if (blocked[i]) continue; // skip water and nature

    // Stay outside settlements: waypoints exist to pull trails through the wild.
    let ok = true;
    for (const t of towns) {
      const buffer = t.radius + 2;
      if ((t.cx - cx) ** 2 + (t.cy - cy) ** 2 < buffer * buffer) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    for (const w of waypoints) {
      const wx = w % cols;
      const wy = (w / cols) | 0;
      if ((wx - cx) ** 2 + (wy - cy) ** 2 < minSpacing2) {
        ok = false;
        break;
      }
    }
    if (ok) waypoints.push(i);
  }
  return waypoints;
}

