/**
 * App release notes, ready to render.
 *
 * This is the public surface for everything that shows what shipped recently
 * in the apps. Pages import from here only: the mirror in ./releases.ts
 * (generated from the apps' own patch notes by `pnpm sync-notes`) and the
 * model in ./types.ts stay behind it.
 */
import type { App } from "../apps";
import { apps } from "../apps";
import { formatDate } from "@/lib/utils";
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
 * card details from src/data/apps.ts, its project page when one exists, and
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
const byName = new Map(all.map((updates) => [updates.app.name, updates] as const));
const byProject = new Map(
  all
    .filter((updates): updates is AppUpdates & { projectSlug: string } =>
      Boolean(updates.projectSlug)
    )
    .map((updates) => [updates.projectSlug, updates] as const)
);

/** Every app with release notes, in the order the mirror lists them. */
export function getAppsWithUpdates(): AppUpdates[] {
  return all;
}

/** One app's updates, by app name ("Pundo"), or undefined when it has none. */
export function getAppUpdates(name: string): AppUpdates | undefined {
  return byName.get(name);
}

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
  // Parsed as a local day so the date never rolls back one day in timezones
  // behind UTC (ISO date strings parse as UTC midnight).
  const [year, month, day] = release.date.split("-").map(Number);
  return formatDate(new Date(year, month - 1, day));
}

/** Anchor for one app's releases on /updates, e.g. "#pundo". */
export function appAnchor(name: string): string {
  return toSlug(name);
}

/** Anchor for one release on /updates, e.g. "#pundo-v0-14-10". */
export function releaseAnchor(name: string, version: string): string {
  return `${toSlug(name)}-${toSlug(displayVersion(version))}`;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
