/**
 * Shared grid neighbourhoods for the row-major cell grids used by every stage.
 *
 * Offsets are `[dx, dy]` pairs.
 */

/**
 * 4-neighbourhood (N/W/E/S). Used wherever a feature must stay strictly 1 cell
 * wide (rivers, trails): a diagonal step would need a bridge cell and render as
 * a 2-wide staircase under the autotiler.
 */
export const NEI4 = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1],
] as const;

/** 8-neighbourhood, for flood fills / component analysis. */
export const NEI8 = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;
