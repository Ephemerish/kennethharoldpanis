# Content registries

Standards: KHP §7.1, §1.3, §1.5, §2.5, §6.6, §10.3, §10.4

## Purpose

Content names things from fixed lists: tags, technologies and article
engines. Projects, posts, roles and certifications all carry tags and tech;
together they are the taxonomy. The schema and the types check every name
against the lists, a script checks that every listed tag and technology is
attached to real work, and one collector feeds the tag pages, the tech pages,
the sitemap and search. All of it lives in `src/data/`, beside the site's
identity (`site.ts`) and its tunables (`settings.ts`): code reads the folder
and renders nothing in it. Cards and covers are [Entries](entries.md);
articles are [Article engines](article-engines.md).

## Implementation

- `src/content.config.ts`: two collections, `blog` and `projects`, each loaded by Astro's `glob` loader from `src/data/content/blog/` and `src/data/content/projects/` (`**/*.md`). An entry's slug is its `entry.id`; its body renders with `render(entry)` from `astro:content`.
  - `tags`: a `z.enum` of `getAllTagSlugs()`, at least one.
  - `tech`: strings matched case-insensitively to `getAllTechNames()`, at least one. An unknown name fails with "Unknown tech: …. Register it in src/data/taxonomy/technologies.ts."
  - Blog: `title`, `pubDate`, `author`, optional `image`, optional `description`, `engine` (`z.enum(ENGINE_KEYS)`, default `prose`). A refine fails a post with no `image` unless its engine draws a live cover ("Add an image: only a live-cover engine can go without one.").
  - Project: `title`, `description`, `image`, optional `gallery`, `featured` (default false), `status` (`completed`, `in-progress`, `planned`), `startDate`, optional `endDate`, optional `links.live` and `links.code`, optional `overview` (materials, key features, challenges, team, academic).
- `src/data/taxonomy/technologies.ts`: `technologies`, an `as const satisfies readonly Technology[]` array (name, logo `imagePath`, optional `imagePathDark` for a logo drawn in black or white, URL); no category: tech is one flat list everywhere (KHP §1.7); the `TechName` type; `techSlug`; `getTechByName`, `getTechBySlug`, `getAllTechNames`. The home page's marquee lists the tech used in real work (`usedInWork`), in file order, split into two rows.
- `src/data/taxonomy/tags.ts`: `tags`, an `as const satisfies readonly Tag[]` array (slug and label); seven today, each a theme that groups work across tools; the `TagSlug` type; `getTagBySlug`, `getTagLabel`, `getAllTagSlugs`.
- `src/data/model.ts`: `Listed`, the fields everything listed shares (`slug`, `title`, `description`, `image`, `tags`, `tech`); the field names are in docs/GLOSSARY.md.
- `src/data/bio/experience.ts`: `timeline` (roles and schools, newest first), each a `TimelineEntry` extending `Listed`: `org`, `startDate` and `endDate` as years (no `endDate` while still held), `image` (the organisation's logo; without one, `Logo` shows initials), optional `href` (the project or post it produced; `/bio` adds that entry's tech to the role's). Helpers: `isCurrent` (no `endDate`), `currentRole`, `yearsLabel`. A role's tech is what he used there, taken from his commits; a school's is its curriculum's.
- `src/data/bio/certifications.ts`: `certifications`, each a `Certification` extending `Listed`: `shortTitle` (the home hero's chip), `issuer`, optional `issuedDate`, `credentialUrl`, `image` (the issuer's badge, required). `tech` is what the exam covers. The list's order is the order on the home page and `/bio`.
- `src/data/bio/resume.ts`: `resumeAvailable` (false today) and `resumePdfPath`.
- `src/data/apps/apps.ts`: live apps (name, tagline, logo, URL) for the Apps menu and the release notes join. `src/data/apps/patch-notes/` is [Release notes](release-notes.md).
- `src/data/contact/subjects.ts`: the contact subjects ([Contact](contact.md)).
- `src/data/site.ts`: the site's name, URL, description, email, default share image, `socials`, `navLinks` and `isCurrent` ([Frame and navigation](frame-and-navigation.md), [Head and SEO](head-and-seo.md)).
- `src/data/settings.ts`: `lists` (`homeProjects` 3, `homePosts` 6, `postsPerPage` 6), `contactLimits` (name 120, email 254, message 5000) and `performanceBudget` ([Testing](testing.md), KHP §7.7).
- `@data/*` in `tsconfig.json` points to `src/data/*`.
- `src/app/features/taxonomy/collect.ts`: `loadTaxonomy()` returns `entries` (projects and posts, newest first), `bio` (roles, then certifications), `tagSlugs` and `techSlugs` (every one something carries), and `withTag(slug)` and `withTech(slug)`. Helpers: `tagsOf`, `techOf`, and `hrefOf` (`/projects/<slug>`, `/blogs/<slug>`, or `/bio#<slug>` for a role or certification).
- `countLabel` in `collect.ts`: what a list holds by kind ("2 projects, 1 role and 1 certification"; a timeline entry tagged `education` is a school). Tag and tech page subtitles use it.
- `usedInWork` in `collect.ts`: true when a project, post or role carries a tech. The one rule for the home rows and for "Built with" against "Certified in".
- `src/app/features/taxonomy/TaxonomyResults.astro`: the projects and posts as an `EntryGrid`, then a "From my bio" section of `BioRecordCard`s.
- `src/app/features/taxonomy/BioRecordCard.astro`: a hoverable `Card` linking to `/bio#<slug>`: the organisation's logo or the certification's badge, "Role", "School" or "Certification", the title, the org or issuer, and the years or issued date.
- `src/app/features/taxonomy/TagLinks.astro`: tags as links to `/tags/<slug>`. Used by `ArticleLayout`, `RoleItem` and `CertificationCard`.
- `src/pages/tags/[slug].astro` and `src/pages/tech/[slug].astro`: one page for each slug in `tagSlugs` or `techSlugs`, rendering `TagPage` or `TechPage`. A tech page's title is "Built with X" when `usedInWork`, else "Certified in X" (KHP §1.1); its subtitle is `countLabel`; then "Visit website" and `TaxonomyResults`. `src/pages/sitemap.xml.ts` and `src/pages/search.json.ts` read `loadTaxonomy` too.
- `/bio`: `RoleItem` (an `AccordionItem`) and `CertificationCard` carry `id={slug}` with `scroll-mt-24`, and show their tech with `TechChips` and their tags with `TagLinks`. `techUsed` in `src/app/pages/bio/model.ts` joins a role's own tech with the tech of the entry its `href` names.
- `scripts/check-taxonomy.mjs`: the first step of `pnpm build`, and `pnpm check:taxonomy`. Runs with `node --experimental-strip-types`, so it imports the registries and bio data from `src/data/` themselves, not a copy, and reads the frontmatter under `src/data/content/`. Fails when a registered tag or technology is attached to nothing; when a tag groups fewer than 2 items or is named like a technology; when an item carries more than 3 tags; when a project or post has no tag, or a role or certification has neither a tag nor a tech; when anything names an unregistered tag or tech; when a technology's logo file is missing; or when two roles or certifications share a slug.
- `scripts/check-assets.mjs` (`pnpm check:assets`, part of `pnpm verify`): decodes every technology logo and counts the pixels that stand out from a white tile (light) and a `#0e0e0e` tile (dark, using `imagePathDark` when set). Fails under 50% visible in either theme, and when a certification badge or organisation logo file is missing. Where each downloaded asset came from is in `public/images/SOURCES.md`.

## Must stay true

1. An unknown or missing tag or tech fails: the schema for content, the `TagSlug` and `TechName` types for bio data (`astro check`), and `check-taxonomy.mjs` for both (KHP §7.1).
2. Every registered tag and technology traces to real work: some project, post, role or certification carries it (KHP §10.4).
3. A technology is a named tool with a logo; a tag is a theme that groups 2 or more items and never repeats a technology's name. An item carries at most 3 tags. Every project and post has a tag; every role and certification has a tag or a tech, so it shows on a tag or tech page.
4. One collector, `loadTaxonomy`, feeds the tag pages, the tech pages, the sitemap and search. A page exists exactly for each tag and tech something carries, and the four never disagree.
5. Each fact has one home (KHP §1.3): a tag's label, a tech's logo and URL, an app's URL. Pages read them; they do not repeat them.
6. `techSlug` is the one way to turn a tech name into a URL. The sitemap, search index, tech pages, chips and marquee all use it.
7. A role's or certification's `slug` is unique and is its card's `id` on `/bio`, so `/bio#<slug>` from search, the home hero and tag pages lands on it.
8. `engines.ts` stays free of imports, because `src/content.config.ts` imports it.
9. An app's `name` in `apps.ts` matches its name in the release notes mirror, or its notes are dropped.
10. `resumeAvailable` gates the resume page's content, its sitemap entry and its `noindex` together.
11. A number someone may tune (a list size, a limit, a budget) is in `settings.ts`, read by every page, endpoint and test that uses it (KHP §1.3).
12. Nothing under `src/data/` renders. It holds facts, content and numbers; components live in `src/app/` and `lib/khp-ui/`.
13. Every technology logo is visible on the light and the dark tile (`check-assets.mjs`). A logo drawn in black or white has an `imagePathDark` that every renderer passes on: `TechChips`, `TechTile` and search.
14. A tech page never says "Built with" for tech only a certification covers, and the home rows never show it (`usedInWork`, one rule for both); a role's tech is what he used there, never the company's whole stack.
15. Tech and tags are the only ways things are sorted on screen; tech is a flat row of chips everywhere (KHP §1.7).

## Before changing

- Add a tag or tech to its registry before using it, and attach it to the work it belongs to in the same change. Remove one only when nothing carries it.
- Give a new role or certification a unique `slug` and a tag or a tech. Before adding a tag, name the second item it groups and check that no technology already says it; if it is a tool, make it a technology instead.
- A new logo: download the official mark into `public/images/tech-logos/`, add `imagePathDark` if it is drawn in black or white, record its source in `public/images/SOURCES.md`, and run `pnpm check:assets`.
- Run `pnpm check:taxonomy`, `pnpm check` and `pnpm build`, and read their output.
- Open a tag page with both entries and bio records (`/tags/web-app`), one with bio records only (`/tags/education`), and follow a "From my bio" card to its anchor on `/bio`.
- Related: [Entries](entries.md), [Article engines](article-engines.md), [Search](search.md), [Release notes](release-notes.md), [Head and SEO](head-and-seo.md).

## Checks

- Astro's content schema during `pnpm check` and `pnpm build`.
- The `TagSlug` and `TechName` types during `pnpm check`.
- `scripts/check-taxonomy.mjs` before every build, and by `pnpm check:taxonomy`.
- `scripts/check-assets.mjs` by `pnpm check:assets` and `pnpm verify`.
- `scripts/generate-cover-backdrops.mjs` fails the build when a content `image` is missing from `public/images/`, except for a live-cover post.
- `pnpm test:e2e` loads every tag and tech page in the sitemap at both widths, crawls their links, and checks that `/bio#<slug>` lands on its card ([Testing](testing.md)).
- None for the "From my bio" cards' contents.

## Known limits

- `check-taxonomy.mjs` reads content frontmatter with a regex. It needs `tags` and `tech` written on one line (`[..., ...]`) and reports a list it cannot read.
- The types allow a role or certification with no tag and no tech; only `check-taxonomy.mjs` catches it.
- `check-assets.mjs` measures contrast against a flat tile. It can't judge whether a logo is the right one or recognisable.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm check` and `pnpm build` pass, the taxonomy check included.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
