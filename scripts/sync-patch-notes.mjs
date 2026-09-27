#!/usr/bin/env node
/**
 * sync-patch-notes.mjs — pull each app's release notes into the website.
 *
 * The apps own their patch notes: each app repo keeps a file that the app
 * itself reads (its "what's new" modal, its version marker). Those files come
 * in two different shapes, so this script reads them, normalizes both into
 * the shared model in src/data/patch-notes/types.ts, checks the result, and
 * writes the mirror in src/data/patch-notes/releases.ts that the site renders.
 *
 * Usage:
 *   pnpm sync-notes
 *
 * Sources default to the app repos sitting next to this one. If they live
 * elsewhere, point the PUNDO_PATCH_NOTES / PIDADA_CHANGELOG environment
 * variables at the files. The mirror is committed, so building the site never
 * needs the app repos — only refreshing the mirror does.
 *
 * To ship an update on the website: add the release to the app's own patch
 * notes, then run `pnpm sync-notes` and deploy.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// TypeScript is already a dependency; use it to turn the apps' TS data files
// into something this plain Node script can read.
const require = createRequire(import.meta.url);
const ts = require("typescript");

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = resolve(SCRIPTS_DIR, "..");
const OUTPUT_FILE = resolve(SITE_ROOT, "src/data/patch-notes/releases.ts");

/**
 * Keep in step with CHANGE_CATEGORIES in src/data/patch-notes/types.ts, the
 * shared model the mirror is written against.
 */
const CHANGE_CATEGORIES = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
  "Highlights",
];

/**
 * How each app's own wording maps onto the shared categories. An unknown
 * label fails the sync so new wording is classified on purpose, not guessed.
 */
const PUNDO_CATEGORIES = {
  "New Features": "Added",
  Improvements: "Changed",
  Adjustments: "Changed",
  "Bug Fixes": "Fixed",
};

/** Each app: where its notes live, and how to read them. */
const SOURCES = [
  {
    name: "Pundo",
    projectSlug: "pundo",
    env: "PUNDO_PATCH_NOTES",
    defaultPath: resolve(SITE_ROOT, "../budget/apps/web/src/lib/patch-notes.ts"),
    read: (exports) => exports.patchNotes,
    adapt: adaptPundo,
  },
  {
    name: "Pidada",
    projectSlug: "pidada",
    env: "PIDADA_CHANGELOG",
    defaultPath: resolve(SITE_ROOT, "../pidada/src/lib/core/patch-notes.ts"),
    read: (exports) => exports.CHANGELOG,
    adapt: adaptPidada,
  },
];

/** Problems collected while reading; any of them stops the write. */
const problems = [];
function problem(message) {
  problems.push(message);
}

// ---------------------------------------------------------------------------
// Reading the app files
// ---------------------------------------------------------------------------

/**
 * Load a TS data file and return its exports. The file is transpiled and run
 * in isolation, so it must be a self-contained data module (no imports).
 */
function loadModule(filePath) {
  let source;
  try {
    source = readFileSync(filePath, "utf8");
  } catch {
    return { exports: null };
  }
  const transpiled = ts.transpileModule(source, {
    fileName: filePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  for (const diagnostic of transpiled.diagnostics ?? []) {
    problem(`Could not read ${filePath}: ${diagnostic.messageText}`);
  }
  const module = { exports: {} };
  const refuseImports = () => {
    throw new Error("the patch notes file must not import other modules");
  };
  try {
    new Function("module", "exports", "require", transpiled.outputText)(
      module,
      module.exports,
      refuseImports
    );
  } catch (error) {
    problem(`Could not read ${filePath}: ${error.message}`);
    return { exports: null };
  }
  return { exports: module.exports };
}

// ---------------------------------------------------------------------------
// Adapters: each app's shape -> the shared Release model
// ---------------------------------------------------------------------------

/** Pundo: { version, date, title, highlights: (string | { label, items })[] }. */
function adaptPundo(entry) {
  const groups = [];
  for (const highlight of entry.highlights ?? []) {
    // Old releases list plain strings instead of labelled groups.
    if (typeof highlight === "string") {
      groups.push({ category: "Highlights", items: [highlight] });
      continue;
    }
    let category = PUNDO_CATEGORIES[highlight.label];
    if (!category) {
      problem(
        `Pundo ${entry.version}: unknown highlight label "${highlight.label}". ` +
          `Add it to PUNDO_CATEGORIES in scripts/sync-patch-notes.mjs.`
      );
      category = "Highlights";
    }
    // Items are strings, or { text, community, feedbackId } for notes that
    // came out of community feedback. The shared model keeps the text only.
    const items = (highlight.items ?? []).map((item) =>
      typeof item === "string" ? item : item.text
    );
    groups.push({ category, items });
  }
  return { version: entry.version, date: entry.date, title: entry.title, changes: regroup(groups) };
}

/** Pidada: { version, date, changes: Partial<Record<Category, string[]>> }. */
function adaptPidada(entry) {
  const groups = CHANGE_CATEGORIES.filter((category) =>
    entry.changes?.[category]?.length
  ).map((category) => ({ category, items: [...entry.changes[category]] }));
  return { version: entry.version, date: entry.date, changes: regroup(groups) };
}

/** Merge same-category groups and put them in the shared category order. */
function regroup(groups) {
  const merged = new Map();
  for (const group of groups) {
    merged.set(group.category, [...(merged.get(group.category) ?? []), ...group.items]);
  }
  return [...merged.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort((a, b) => CHANGE_CATEGORIES.indexOf(a.category) - CHANGE_CATEGORIES.indexOf(b.category));
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

/** Pad a YYYY-M-D date to ISO, or return null when it is not a real day. */
function normalizeDate(raw) {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw ?? "");
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function validateRelease(release, context) {
  if (!/^v?\d+\.\d+\.\d+$/.test(release.version ?? "")) {
    problem(`${context}: version "${release.version}" is not one like "0.14.10" or "v0.7.3".`);
  }
  const date = normalizeDate(release.date);
  if (!date) {
    problem(`${context}: date "${release.date}" is not a real day (YYYY-MM-DD).`);
  } else {
    release.date = date;
  }
  if (release.title !== undefined && release.title.trim() === "") {
    problem(`${context}: has an empty title. Write one or leave it out.`);
  }
  if (release.changes.length === 0) {
    problem(`${context}: has no notes. Every release needs at least one.`);
  }
  for (const group of release.changes) {
    if (!CHANGE_CATEGORIES.includes(group.category)) {
      problem(`${context}: unknown category "${group.category}".`);
    }
    for (const item of group.items) {
      if (typeof item !== "string" || item.trim() === "") {
        problem(`${context}: has an empty note under "${group.category}".`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function renderMirror(apps) {
  const data = JSON.stringify(apps, null, 2);
  return `/**
 * Generated by \`pnpm sync-notes\` (scripts/sync-patch-notes.mjs). Do not edit.
 *
 * This mirrors the apps' own release notes in the shared model from ./types.ts.
 * To refresh it: add the release to the app's patch notes and run
 * \`pnpm sync-notes\` again.
 */
import type { AppReleases } from "./types";

export const APP_RELEASES: AppReleases[] = ${data};
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const apps = [];

for (const source of SOURCES) {
  const filePath = process.env[source.env] ?? source.defaultPath;
  const { exports } = loadModule(filePath);
  if (!exports) {
    problem(
      `Could not read ${source.name} release notes at ${filePath}. ` +
        `Set ${source.env} to the app's patch notes file if the repo lives elsewhere.`
    );
    continue;
  }

  const entries = source.read(exports);
  if (!Array.isArray(entries) || entries.length === 0) {
    problem(`${source.name}: ${filePath} did not give a non-empty list of releases.`);
    continue;
  }

  const seen = new Set();
  const releases = entries.flatMap((entry, index) => {
    const context = `${source.name} release #${index + 1} (${entry?.version ?? "no version"})`;
    let release;
    try {
      release = source.adapt(entry);
    } catch (error) {
      problem(`${context}: could not be read (${error.message}).`);
      return [];
    }
    validateRelease(release, context);
    if (seen.has(release.version)) {
      problem(`${source.name}: version ${release.version} appears twice.`);
    }
    seen.add(release.version);
    return [release];
  });

  // Newest first. The sort is stable, so releases sharing a day keep the order
  // the app published them in.
  releases.sort((a, b) => b.date.localeCompare(a.date));
  apps.push({ name: source.name, projectSlug: source.projectSlug, releases });
}

if (problems.length > 0) {
  console.error(`\nPatch notes sync failed with ${problems.length} problem(s):\n`);
  for (const message of problems) console.error(`  • ${message}`);
  console.error(`\nNothing was written. Fix the above and run pnpm sync-notes again.\n`);
  process.exit(1);
}

writeFileSync(OUTPUT_FILE, renderMirror(apps), "utf8");

console.log(`\nWrote ${OUTPUT_FILE}`);
for (const app of apps) {
  const newest = app.releases[0];
  const oldest = app.releases[app.releases.length - 1];
  console.log(
    `  ${app.name.padEnd(8)} ${String(app.releases.length).padStart(3)} releases ` +
      `(${oldest.version} ${oldest.date} → ${newest.version} ${newest.date})`
  );
}
console.log(`\nDeploy the site to show them.\n`);
