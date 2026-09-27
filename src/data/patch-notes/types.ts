/**
 * Release notes model, the one shape every app's updates are rendered from.
 *
 * Each app owns its patch notes in its own repo (Pundo and Pidada each keep a
 * file the app itself reads). Those files come in different shapes, so
 * `scripts/sync-patch-notes.mjs` mirrors them here in one shared model and
 * `src/pages` renders from that mirror. Pages never read the app files.
 */

/**
 * CHANGE_CATEGORIES, the Keep a Changelog vocabulary every release groups its
 * notes under. "Highlights" is the quiet fallback for the few older releases
 * that were written as one flat list instead of categories.
 */
export const CHANGE_CATEGORIES = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
  "Highlights",
] as const;

export type ChangeCategory = (typeof CHANGE_CATEGORIES)[number];

export interface ChangeGroup {
  category: ChangeCategory;
  items: string[];
}

export interface Release {
  /** Version exactly as the app publishes it, e.g. "0.14.10" or "v0.7.3". */
  version: string;
  /** Release day as an ISO date, YYYY-MM-DD. */
  date: string;
  /** Short headline for the release, when the app writes one. */
  title?: string;
  /** Notes grouped by category, in category order. */
  changes: ChangeGroup[];
}

export interface AppReleases {
  /** App name, matching `App.name` in src/data/apps.ts. */
  name: string;
  /** Project content slug (/projects/<slug>) when a project page exists. */
  projectSlug?: string;
  /** Releases, newest first. */
  releases: Release[];
}
