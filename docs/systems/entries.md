# Entries

Standards: KHP §4.4, §4.5, §5.3, §5.8, §6.5, §6.6, §7.5, §7.6, §1.3

## Purpose

Blog posts and projects are one kind of thing on lists: an entry with a date,
a cover, a title and tags. This system draws their cards and covers, shows
their tags and tech, sorts lists, and names a project's status. The article
page itself is [Article engines](article-engines.md). Which entries a tag or
tech page lists, and the roles and certifications beside them, is the
taxonomy in [Content registries](content-registries.md).

## Implementation

- `src/app/features/entries/EntryCard.astro`: the one card for posts and projects, `kind` `blog` or `project`.
  - `variant="default"` (grids): `bg-card-gradient`, `shadow-elegant`, `motion-lift`; on hover a `neutral-0` background, a `brand-300` border and `shadow-floating`. The cover, a read-time pill (posts) or status pill (projects) over it, the title, the date in `<time datetime>`, a project's description and "Code" link, tags, and a "Read post" or "View project" line. The title link has `stretched-link`. The pills and the "Code" link are `z-raised`, under the top bar. The pills are `pointer-events-none`.
  - `variant="featured"`: a dark photo overlay with `motion-lift` and a `brand-500` border on hover. The whole card is one `<a>`. A black gradient over the cover, white text, a `brand-700` lead pill, a project's status pill, title, date, read time, a project's institution and description, up to four tags then "+N more", and the call to action. No link inside. The lead pill says "Featured" for a project marked `featured`, "Latest post" for a post, and is left out for any other project.
  - Status words and colours come from `PROJECT_STATUS` in `model.ts`.
- `src/app/features/entries/Cover.astro`: decides the cover from the entry's `engine`. A live-cover engine always paints a server-drawn still of its strips first (`data-pretext-still`, drawn from the `--art-*` tokens). `PretextCover` then hydrates over it with `client:visible` and `showTitle={false}`, since the card shows the title. Every other entry renders a backdrop image under the real image, `object-contain` on black, both with `motion-zoom`.
- `src/app/features/entries/EntryCollectionGrid.astro`: one, two or three columns of default cards. Used by `TaxonomyResults` on tag and tech pages.
- `src/app/features/entries/Tags.astro`: tags on a card as plain chips with a small brand square. Not links.
- `src/app/features/entries/TechChips.astro`: tech names with logos, linking to `/tech/<slug>`; `linked={false}` inside another link; `size` `sm` or `md`.
- `src/app/features/entries/model.ts`: `AnyEntry`, `entryDate` (post `pubDate`; project `endDate ?? startDate`), `newestFirst`, `PROJECT_STATUS` (label and classes for `completed`, `in-progress`, `planned`), `sortProjects` (featured first, then newest by end, else start, date) and `sortPosts` (newest first).
- `src/app/features/entries/cover-image.mjs`: `coverBackdrop(image)` maps an image name to `/images/cover-backdrops/<name>.webp`.
- `scripts/generate-cover-backdrops.mjs`: runs in `pnpm build`. Reads each content file's `image` and writes a small blurred WebP with `sharp`. Fails the build when a content image does not exist, except for a post with `engine: pretext`, which needs none.
- Users: `src/app/pages/home/ProjectsSection.astro` (`sortProjects`; the first as a featured card, then a grid) and `BlogSection.astro` (`sortPosts`; the newest as a featured card, then a grid), `src/app/pages/projects/` (`sortProjects`; `FeaturedProjects`, `ProjectsGrid`), `src/app/pages/blogs/` (`sortPosts`; `BlogsGrid`), the project page (`PROJECT_STATUS`), and tag and tech pages through `TaxonomyResults`.

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

## Before changing

- Look at the home page, `/projects`, `/blogs`, one tag page and one tech page, at phone and desktop width, in both themes, and with reduced motion.
- Check a project with a code link: the card opens the project, the "Code" link opens the repo.
- Scroll a card under the sticky top bar and check nothing on it draws over the bar.
- After adding an image, run `pnpm build` or `node scripts/generate-cover-backdrops.mjs` so its backdrop exists.
- Related: [Article engines](article-engines.md), [Content registries](content-registries.md), [Theme tokens](theme-tokens.md).

## Checks

- `pnpm check:output` runs `scripts/check-home-performance.mjs` on the built home page: no `client:load` island, the pretext still is there, the `PretextCover` island (if any) is `client:visible`, no `blur-2xl` or `backdrop-blur` classes, the marquee copy is `inert`, and the HTML is under 120 KB.
- The backdrop script fails the build on a missing content image.
- None for the card markup or sorting.

## Known limits

- `generate-cover-backdrops.mjs` reads frontmatter with a regex, not a YAML parser. Backdrop files are committed in `public/images/cover-backdrops/`; one whose image was removed is not deleted.
- A featured blog card always says "Latest post"; it is true only because the home page's newest post is the one caller.
- `EntryCollectionGrid.astro` declares its own entry type instead of using `AnyEntry`.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm build` and `pnpm check:output` pass.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
