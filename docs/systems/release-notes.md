# Release notes

Standards: KHP §1.3, §3.5, §4.5, §6.5

## Purpose

A project with a live app (Pundo, Pidada) shows that app's release notes in a
drawer on its project page. The apps own their notes in their own repos; this
system mirrors them into one model and renders them. The project page around
the drawer is [Article engines](article-engines.md).

## Implementation

- `src/app/data/patch-notes/types.ts`: `CHANGE_CATEGORIES` (Keep a Changelog: Added, Changed, Deprecated, Removed, Fixed, Security, plus Highlights for old flat lists), `Release`, `ChangeGroup`, `AppReleases`.
- `src/app/data/patch-notes/releases.ts`: generated, committed mirror (`APP_RELEASES`). Do not edit by hand.
- `src/app/data/patch-notes/index.ts`: the public surface. Joins each mirror entry to its `App` in `src/app/data/apps.ts` by name, drops apps with no card or no releases. `getUpdatesByProject`, `displayVersion` ("v0.14.10"), `formatReleaseDate` (builds the day in UTC and formats it with `formatDate`), `releaseAnchor`.
- `scripts/sync-patch-notes.mjs` (`pnpm sync-notes`): reads `../budget/apps/web/src/lib/patch-notes.ts` (Pundo) and `../pidada/src/lib/core/patch-notes.ts` (Pidada), or the paths in `PUNDO_PATCH_NOTES` and `PIDADA_CHANGELOG`. Transpiles each with TypeScript, adapts each shape, maps Pundo labels to categories, validates, sorts newest first, and writes the mirror only if there are no problems.
- `src/app/pages/projects/[slug]/ProjectDetail.astro`: renders `ProjectUpdates` in the `overlay` slot when the project has updates.
- `src/app/pages/projects/[slug]/ProjectUpdates.astro`: an icon-only fixed trigger (`.release-tab`) at `top: 5rem` with `aria-label="Open <app> release notes"` and a "Release notes" tooltip on hover and focus; a native `<dialog>` drawer from the right with a `::backdrop` scrim. The drawer header shows the app name as a small uppercase label, "Release notes" and the latest version and date. Latest release first, earlier ones in a `<details>`. Closes by button, backdrop click or Escape; focus returns to the trigger. A page script wires each page's drawer once (`data-wired`).
- `src/app/pages/projects/[slug]/ReleaseEntry.astro`: the version as a brand `Chip`, the `<time>`, an optional title, and each category as a `Chip` (Added `success`, Changed `brand`, Fixed `warning`, Removed and Security `error`, Deprecated and Highlights `neutral`) over its items.
- `scripts/check-release-control.mjs`: run by `pnpm check:output`.

## Must stay true

1. Pages import only from `@app/data/patch-notes` (the index), never from `releases.ts` or the app repos.
2. Building the site never needs the app repos. Only `pnpm sync-notes` reads them.
3. The sync writes nothing when any problem is found: unknown Pundo label, bad version, a date that is not a real day, empty title, release with no notes, empty note, duplicate version, unreadable file. A new label is classified on purpose, not guessed.
4. Releases are newest first. Releases on the same day keep the app's order.
5. Versions display one way: with a leading "v".
6. The trigger is icon-only with an accessible name and a tooltip on hover and focus (KHP §3.5). `check-release-control.mjs` holds this for `pundo` and `pidada`.
7. The collapse-all button on the same page moves down to `8.5rem` when `[data-release-trigger]` exists, so the two floating tools never overlap.
8. Category names are words on chips, not colour alone (KHP §4.5).
9. The drawer's listeners are added once per page, so a view-transition visit does not open or close it twice.
10. A release date reads the same day whatever time zone the site is built in (KHP §6.5).

## Before changing

- Run `pnpm sync-notes` with both app repos present and read its summary.
- Open `/projects/pundo` and `/projects/pidada`: open the drawer by pointer and keyboard, close by Escape, button and backdrop, and check focus returns. Navigate away and back by view transition and try again. Check phone width and both themes.
- Related: [Content registries](content-registries.md) (`apps.ts`), [Article engines](article-engines.md), [Theme tokens](theme-tokens.md).

## Checks

- `pnpm check:output` runs `scripts/check-release-control.mjs` on the built pages for `pundo` and `pidada`: a trigger exists, is named "Open … release notes", has no visible text label inside it, and a dialog exists.
- The sync's own validation, when `pnpm sync-notes` runs.
- None for the index functions or the drawer's behaviour.

## Known limits

- `CHANGE_CATEGORIES` is written twice, in `types.ts` and in the sync script, kept in step by a comment.
- `check-release-control.mjs` hard-codes the two slugs.
- The `types.ts` header still names `ReleaseNotes.astro`; the drawer is now `ProjectUpdates.astro`.
- Pundo items that came from community feedback lose that link; the mirror keeps the text only.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm sync-notes` (if notes changed), `pnpm build` and `pnpm check:output` pass.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
