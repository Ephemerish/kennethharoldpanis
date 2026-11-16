# Entries

Standards: KHP §4.4, §4.5, §4.9, §5.3, §5.8, §6.5, §6.6, §7.5, §7.6, §7.7, §1.3

## Purpose

Blog posts and projects are one kind of thing on lists: an entry with a date,
a cover, a title and tags. This system draws their cards and covers, shows
their tags and tech, sorts lists, and names a project's status. The article
page itself is [Article engines](article-engines.md). Which entries a tag or
tech page lists, and the roles and certifications beside them, is the
taxonomy in [Content registries](content-registries.md).

## Implementation

- `src/app/features/entries/EntryCard.astro`: the one card for posts and projects, `kind` `blog` or `project`, built from `@ui` components (`Stack`, `Heading`, `Link`, `IconText`, `StatusPill`, `Chip`). `priority` loads its cover eagerly.
  - `variant="default"` (grids): `bg-card-gradient`, `shadow-elegant`, `motion-lift`; on hover a `neutral-0` background, a `brand-300` border and `shadow-floating`. The cover, a read-time pill (posts) or status pill (projects) over it, the title, the date in `<time datetime>`, a project's description and "Code" link, tags, and a "Read post" or "View project" line. The title is a `Link` with `stretched`. The pills and the "Code" link are `z-raised`, under the top bar. The pills are `pointer-events-none`.
  - `variant="featured"`: a dark photo overlay with `motion-lift` and a `brand-500` border on hover. The whole card is one `<a>`. A black gradient over the cover, white text, a `brand-700` lead pill and a project's status pill (`StatusPill` `size="lg"`), title, date, read time, a project's institution and description, up to four tags then "+N more" (`Chip` `variant="overlay"`), and the call to action. Its cover always loads eagerly. No link inside. The lead pill says "Featured" for a project marked `featured`, "Latest post" for a post, and is left out for any other project.
  - Status words and pill variants come from `PROJECT_STATUS` in `model.ts`.
- `src/app/features/entries/Cover.astro`: decides the cover from the entry's `engine`. A live-cover engine always paints a server-drawn still of its strips first (`data-pretext-still`, drawn from the `--art-*` tokens). `PretextCover` then hydrates over it with `client:visible` and `showTitle={false}`, since the card shows the title. Every other entry renders a backdrop image under the real image, `object-contain` on black, both `Image` with `motion-zoom`. `loading="eager"` passes `priority` to both.
- `src/app/features/entries/EntryCollectionGrid.astro`: a `Grid` (`cols="cards"`: one, two, then three columns) of default cards; the first `FIRST_ROW` get `priority`. Used by `TaxonomyResults` on tag and tech pages.
- `src/app/features/entries/Tags.astro`: tags on a card as `Chip` `variant="tag"` with `dot`. Not links.
- `src/app/features/entries/TechChips.astro`: tech names as `Chip` `variant="outline"` with their logo (or the dot when there is none), linking to `/tech/<slug>`; `linked={false}` inside another link; `size` `sm` or `md`.
- `src/app/features/entries/model.ts`: `AnyEntry`, `entryDate` (post `pubDate`; project `endDate ?? startDate`), `newestFirst`, `PROJECT_STATUS` (label and `StatusPill` variant for `completed`, `in-progress`, `planned`), `sortProjects` (featured first, then newest by end, else start, date), `sortPosts` (newest first) and `FIRST_ROW` (3, the cards above the fold in a grid).
- `src/app/features/entries/cover-image.mjs`: `coverBackdrop(image)` maps an image name to `/images/cover-backdrops/<name>.webp`.
- `scripts/generate-cover-backdrops.mjs`: runs in `pnpm build`. Reads each content file's `image` and writes a small blurred WebP with `sharp`. Fails the build when a content image does not exist, except for a post with `engine: pretext`, which needs none.
- Users: `src/app/pages/home/ProjectsSection.astro` (`sortProjects`; the first as a featured card, then a grid of `lists.homeProjects - 1`) and `BlogSection.astro` (`sortPosts`; the newest as a featured card, then a grid of `lists.homePosts`), `src/app/pages/projects/` (`sortProjects`; `FeaturedProjects`, `ProjectsGrid`), `src/app/pages/blogs/` (`sortPosts`; `BlogsGrid`, first row `priority`), the project page (`PROJECT_STATUS`), and tag and tech pages through `TaxonomyResults`.

## Must stay true

1. A grid card has one main link, the title, stretched over the card. The "Code" link is a real separate link raised above it, at `z-raised`, so it never draws over the top bar. Tags on a card are not links (KHP §4.4).
2. A featured card is one link with no link inside it.
3. A project's status is shown in words, never by colour alone, and comes from `PROJECT_STATUS`, which the card and the project page both read (KHP §4.5, §1.3).
4. Dates use `formatDate` from `src/app/calc/format.ts`, with `isoDay` in `<time datetime>` (KHP §6.5).
5. Only `Cover.astro` branches on the engine. Cards never check the engine themselves.
6. A live cover paints its still first and hydrates only when visible, on every list page. The home page keeps its budget (KHP §7.6); `scripts/check-home-performance.mjs` holds this.
7. The backdrop is a small prepared image, not a CSS blur. `coverBackdrop` is shared by the script and the pages, so both build the same file name.
8. A pill never claims what the data doesn't say: "Featured" only for `featured: true`, and only the newest post is shown as a featured blog card, so "Latest post" is true (KHP §6.6).
9. Lists sort through `sortProjects` and `sortPosts`, so every list orders the same way.
10. Tech names resolve through `getTechByName`; a chip links to a `/tech` page that exists, because a page is built for every technology something carries.
11. A featured card's cover, and the covers in the first row of the `/blogs` grid and the tag and tech grids (`FIRST_ROW`), load eagerly; every other cover is lazy, including the home page grids and the projects grid under the featured cards, which sit below the fold (KHP §7.5, §7.7).

## Before changing

- Look at the home page, `/projects`, `/blogs`, one tag page and one tech page, at phone and desktop width, in both themes, and with reduced motion.
- Check a project with a code link: the card opens the project, the "Code" link opens the repo.
- Scroll a card under the sticky top bar and check nothing on it draws over the bar.
- After adding an image, run `pnpm build` or `node scripts/generate-cover-backdrops.mjs` so its backdrop exists.
- Related: [Article engines](article-engines.md), [Content registries](content-registries.md), [Theme tokens](theme-tokens.md).

## Checks

- `pnpm check:output` runs `scripts/check-home-performance.mjs` on the built home page: no `client:load` island, the pretext still is there, the `PretextCover` island (if any) is `client:visible`, no `blur-2xl` or `backdrop-blur` classes, the marquee copy is `inert`, and the HTML is under 120 KB.
- The backdrop script fails the build on a missing content image.
- `pnpm test:e2e` loads every list page at both widths and checks `alt` on every image, no sideways scroll and that every card link resolves; it also checks the pretext cover hydrates when scrolled into view. `pnpm test:perf` measures LCP on `/`, `/projects`, `/blogs` and a tag and a tech page ([Testing](testing.md)).
- None for sorting.

## Known limits

- `generate-cover-backdrops.mjs` reads frontmatter with a regex, not a YAML parser. Backdrop files are committed in `public/images/cover-backdrops/`; one whose image was removed is not deleted.
- A featured blog card always says "Latest post"; it is true only because the home page's newest post is the one caller.
- `EntryCollectionGrid.astro` declares its own entry type instead of using `AnyEntry`.
- The home page's grids and `ProjectsGrid` on `/projects` pass no `priority`, so their first rows load lazily.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm build` and `pnpm check:output` pass.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
