# Entries

Standards: KHP §4.4, §4.5, §4.9, §4.10, §5.3, §5.8, §6.5, §6.6, §7.5, §7.6, §7.7, §1.3

## Purpose

Blog posts and projects are one kind of thing on lists: an entry with a date,
a cover, a title and tags. This system draws their cards and covers, shows
their tags and tech, sorts lists, and names a project's status. The article
page itself is [Article engines](article-engines.md). Which entries a tag or
tech page lists, and the roles and certifications beside them, is the
taxonomy in [Content registries](content-registries.md).

## Implementation

- `src/app/features/entries/model.ts`: `AnyEntry`, `asProjects` and `asPosts` (a collection's entries as `AnyEntry`), `entryDate`, `newestFirst`, `sortProjects` (featured first, then newest by end, else start, date), `sortPosts` (newest first), `PROJECT_STATUS` (label and `StatusPill` variant for `completed`, `in-progress`, `planned`), `FIRST_ROW` (3), and `toCard(item)`, which turns a project or a post into `CardData`: `href`, `title`, `image`, `engine`, `date`, `summary` (a project's or post's `description`), `tags`, `status` (projects), `readTime` (posts) and `action` ("View project" or "Read post").
- `src/app/features/entries/EntryCard.astro`: the one card for a project or a post (KHP §4.10). A `Card` with `href` and `hoverable`, so the whole card is one link. The `Cover`, a project's status pill over it, the title (two lines at most), the date in `<time datetime>` and a post's read time, the summary (three lines at most), the tags as plain `tag` chips, and the action line. Reads `CardData` only; never branches on the kind.
- `src/app/features/entries/EntryGrid.astro`: every list of projects and posts. A `Grid` (`cols="cards"`: one, two, then three columns) of `EntryCard`s in a list; the first `FIRST_ROW` load their covers first. Used by the home page's projects (`lists.homeProjects`) and posts (`lists.homePosts`), `/projects` (all, featured first), `/blogs` (a page of posts), and tag and tech pages through `TaxonomyResults`.
- `src/app/features/entries/Cover.astro`: 16:9. A live-cover engine (pretext) paints a server-drawn still of its strips (`data-pretext-still`, from the `--art-*` tokens), and `PretextCover` hydrates over it with `client:visible`. Any other entry shows its image whole (`contain`) over its prepared blurred backdrop. The cover's images have empty `alt`: the card's title names the card.
- `src/app/features/entries/TechChips.astro`: tech as `outline` chips with their logo, linking to `/tech/<slug>`; `linked={false}` inside another link.
- `src/app/features/entries/cover-image.mjs`: `coverBackdrop(image)` maps an image name to `/images/cover-backdrops/<name>.webp`.
- `scripts/generate-cover-backdrops.mjs`: runs in `pnpm build`. Writes a small blurred WebP of each content image with `sharp`; fails the build when a content image is missing, except for a live-cover post.

## Must stay true

1. One card and one grid for projects and posts, everywhere they are listed. Featured projects and the newest post come first; they are not drawn differently (KHP §4.10).
2. A card is one link with nothing clickable inside it: tags are plain chips, a project's code link is on its page (KHP §4.4).
3. The card reads `CardData` from `toCard`; only `toCard` knows the kinds, and only `Cover` knows the engines.
4. A project's status is in words, from `PROJECT_STATUS`, which the card and the project page both read (KHP §4.5, §1.3).
5. Dates use `formatDate`, with `isoDay` in `<time datetime>` (KHP §6.5).
6. A live cover paints its still first and hydrates only when visible. The home page keeps its budget (KHP §7.6); `scripts/check-home-performance.mjs` holds this.
7. The backdrop is a small prepared image, not a CSS blur; `coverBackdrop` is shared by the script and the pages.
8. Lists sort through `sortProjects` and `sortPosts`, so every list orders the same way.
9. The first row of every grid loads its covers first; the rest are lazy (KHP §7.5, §7.7).

## Before changing

- Look at the home page, `/projects`, `/blogs`, one tag page and one tech page, at phone and desktop width, in both themes, and with reduced motion.
- Scroll a card under the sticky top bar and check nothing on it draws over the bar.
- After adding an image, run `pnpm build` or `node scripts/generate-cover-backdrops.mjs` so its backdrop exists.
- Related: [Article engines](article-engines.md), [Content registries](content-registries.md), [Theme tokens](theme-tokens.md).

## Checks

- `pnpm check:output` runs `scripts/check-home-performance.mjs` on the built home page: no `client:load` island, the pretext still is there, the `PretextCover` island (if any) is `client:visible`, no `blur-2xl` or `backdrop-blur` classes, and the HTML is under 120 KB.
- The backdrop script fails the build on a missing content image.
- `pnpm test:e2e` loads every list page at both widths and checks `alt` on every image, no sideways scroll and that every card link resolves; it also checks the pretext cover hydrates when scrolled into view. `pnpm test:perf` measures LCP on `/`, `/projects`, `/blogs` and a tag and a tech page ([Testing](testing.md)).
- None for sorting.

## Known limits

- `generate-cover-backdrops.mjs` reads frontmatter with a regex, not a YAML parser. Backdrop files are committed in `public/images/cover-backdrops/`; one whose image was removed is not deleted.
- On the home page every grid's first row is marked to load first, though the posts sit below the fold.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm build` and `pnpm check:output` pass.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
