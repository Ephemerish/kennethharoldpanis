/**
 * App release notes, ready to render.
 *
 * This is the public surface for release drawers in the project articles.
 * Pages import from here only: the mirror in ./releases.ts
 * (generated from the apps' own patch notes by `pnpm sync-notes`) and the
 * model in ./types.ts stay behind it.
 */
import type { App } from "../apps";
import { apps } from "../apps";
import { formatDate } from "@app/calc/format";
import type { AppReleases, Release } from "./types";
import { APP_RELEASES } from "./releases";

export type {
  AppReleases,
  ChangeCategory,
  ChangeGroup,
  Release,
} from "./types";
export { CHANGE_CATEGORIES } from "./types";

/**
 * AppUpdates, one app joined with everything the page needs about it: its
 * card details from src/app/data/apps.ts, its project page when one exists, and
 * its releases, newest first.
 */
export interface AppUpdates {
  app: App;
  /** Project content slug ("/projects/<slug>") when a project page exists. */
  projectSlug?: string;
  releases: Release[];
  /** The newest release. */
  latest: Release;
}

function toAppUpdates(source: AppReleases): AppUpdates | undefined {
  const app = apps.find((candidate) => candidate.name === source.name);
  // An app without a card or without releases has nothing to show yet.
  if (!app || source.releases.length === 0) return undefined;
  return {
    app,
    projectSlug: source.projectSlug,
    releases: source.releases,
    latest: source.releases[0],
  };
}

const all = APP_RELEASES.map(toAppUpdates).filter(
  (updates): updates is AppUpdates => updates !== undefined
);
const byProject = new Map(
  all
    .filter((updates): updates is AppUpdates & { projectSlug: string } =>
      Boolean(updates.projectSlug)
    )
    .map((updates) => [updates.projectSlug, updates] as const)
);

/** One app's updates, by project slug ("pundo"), or undefined when it has none. */
export function getUpdatesByProject(slug: string): AppUpdates | undefined {
  return byProject.get(slug);
}

/** Versions display the same way whatever the app writes: "v0.14.10". */
export function displayVersion(version: string): string {
  return version.startsWith("v") ? version : `v${version}`;
}

/** A release's day formatted for reading, e.g. "September 26, 2026". */
export function formatReleaseDate(release: Release): string {
  // A calendar day: built and formatted in UTC, so it reads the same
  // whatever time zone the site is built in (formatDate formats in UTC).
  const [year, month, day] = release.date.split("-").map(Number);
  return formatDate(new Date(Date.UTC(year, month - 1, day)));
}

/** Anchor for one release in its project's drawer. */
export function releaseAnchor(name: string, version: string): string {
  return `${toSlug(name)}-${toSlug(displayVersion(version))}`;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
