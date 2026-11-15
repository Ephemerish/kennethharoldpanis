# Content registries

Standards: KHP §7.1, §1.3, §1.5, §2.5, §6.6, §10.3, §10.4

## Purpose

Content names things from fixed lists: tags, technologies and article
engines. Projects, posts, roles and certifications all carry tags and tech;
together they are the taxonomy. The schema and the types check every name
against the lists, a script checks that every listed tag and technology is
attached to real work, and one collector feeds the tag pages, the tech pages,
the sitemap and search. The same folder holds the hand-kept bio data, the
resume flag and the live apps. Cards and covers are [Entries](entries.md);
articles are [Article engines](article-engines.md).

## Implementation

- `src/content/config.ts`: two collections, `blog` (`src/content/blog/`) and `projects` (`src/content/projects/`).
  - `tags`: a `z.enum` of `getAllTagSlugs()`, at least one.
  - `tech`: strings matched case-insensitively to `getAllTechNames()`, at least one. An unknown name fails with "Unknown tech: …. Register it in src/app/data/technologies.ts."
  - Blog: `title`, `pubDate`, `author`, optional `image`, optional `description`, `engine` (`z.enum(ENGINE_KEYS)`, default `prose`). A refine fails a post with no `image` unless its engine draws a live cover ("Add an image: only a live-cover engine can go without one.").
  - Project: `title`, `description`, `image`, optional `gallery`, `featured` (default false), `status` (`completed`, `in-progress`, `planned`), `startDate`, optional `endDate`, optional `links.live` and `links.code`, optional `overview` (materials, key features, challenges, team, academic).
- `src/app/data/technologies.ts`: `technologies`, an `as const satisfies readonly Technology[]` array (name, logo, category, URL); the `TechName` type; `techSlug`; `getTechByName`, `getTechBySlug`, `getAllTechNames`. The home page's technology marquee lists them in file order, split into two rows.
- `src/app/data/tags.ts`: `tags`, an `as const satisfies readonly Tag[]` array (slug, label, group `domain`, `type` or `topic`); the `TagSlug` type; `getTagBySlug`, `getTagLabel`, `getAllTagSlugs`.
- `src/app/data/experience.ts`: `timeline` for `/bio`: `slug` (the card's anchor), title, org, start and end as written ("2024", "current"), body, `tags: TagSlug[]`, optional `tech: TechName[]`, an icon, optional `href` (the project or post it produced; its card links there). Helpers: `isCurrent`, `currentRole` (the hero, contact card and home description read it), `yearsLabel`.
- `src/app/data/certifications.ts`: `certifications` for `/bio`: `slug`, title, `shortTitle` (the home hero's chip), issuer, optional issued date, `credentialUrl`, badge image, summary, `focusAreas`, `tags: TagSlug[]`, optional `tech: TechName[]`, an icon, `accent` (`brand` or `dark`, for the `IconBadge`), `chipVariant` (`brand` or `neutral`, for the focus-area chips), optional `highlighted` (the "Featured" pill, sorted first) and `status` (an in-progress certification).
- `src/app/data/resume.ts`: `resumeAvailable` (false today) and `resumePdfPath`.
- `src/app/data/apps.ts`: live apps (name, tagline, logo, URL) for the Apps menu and the release notes join.
- `src/app/features/taxonomy/collect.ts`: `loadTaxonomy()` returns `entries` (projects and posts, newest first), `bio` (roles, then certifications), `tagSlugs` and `techSlugs` (every one something carries), and `withTag(slug)` and `withTech(slug)`. Helpers: `tagsOf`, `techOf`, and `hrefOf` (`/projects/<slug>`, `/blogs/<slug>`, or `/bio#<slug>` for a role or certification).
- `src/app/features/taxonomy/TaxonomyResults.astro`: the projects and posts as an `EntryCollectionGrid`, then a "From my bio" section of `BioRecordCard`s.
- `src/app/features/taxonomy/BioRecordCard.astro`: a hoverable `Card` linking to `/bio#<slug>`: "Experience" or "Certification", the title, the org or issuer, and the years or issued date.
- `src/app/features/taxonomy/TagLinks.astro`: tags as links to `/tags/<slug>`. Used by `ArticleLayout`, `TimelineEntryCard` and `CertificationCard`.
- `src/pages/tags/[slug].astro` and `src/pages/tech/[slug].astro`: one page for each slug in `tagSlugs` or `techSlugs`, rendering `TagPage` or `TechPage` (a header with the count of everything listed, a tech's "Visit website" link, then `TaxonomyResults`). `src/pages/sitemap.xml.ts` and `src/pages/search.json.ts` read `loadTaxonomy` too.
- `/bio`: `TimelineEntryCard` and `CertificationCard` carry `id={slug}` with `scroll-mt-24`, and show their tags with `TagLinks`.
- `scripts/check-taxonomy.mjs`: the first step of `pnpm build`, and `pnpm check:taxonomy`. Runs with `node --experimental-strip-types`, so it imports the registries and bio data themselves, not a copy. Fails when a registered tag or technology is attached to nothing; when a project, post, role or certification names an unregistered tag or tech, or has no tag; when a technology's logo file is missing; or when two roles or certifications share a slug.

## Must stay true

1. An unknown or missing tag or tech fails: the schema for content, the `TagSlug` and `TechName` types for bio data (`astro check`), and `check-taxonomy.mjs` for both (KHP §7.1).
2. Every registered tag and technology traces to real work: some project, post, role or certification carries it (KHP §10.4).
3. Every project, post, role and certification has at least one tag, so a role or certification shows on the tag pages it belongs to.
4. One collector, `loadTaxonomy`, feeds the tag pages, the tech pages, the sitemap and search. A page exists exactly for each tag and tech something carries, and the four never disagree.
5. Each fact has one home (KHP §1.3): a tag's label, a tech's logo and URL, an app's URL. Pages read them; they do not repeat them.
6. `techSlug` is the one way to turn a tech name into a URL. The sitemap, search index, tech pages, chips and marquee all use it.
7. A role's or certification's `slug` is unique and is its card's `id` on `/bio`, so `/bio#<slug>` from search, the home hero and tag pages lands on it.
8. `engines.ts` stays free of imports, because `config.ts` imports it.
9. An app's `name` in `apps.ts` matches its name in the release notes mirror, or its notes are dropped.
10. `resumeAvailable` gates the resume page's content, its sitemap entry and its `noindex` together.

## Before changing

- Add a tag or tech to its registry before using it, and attach it to the work it belongs to in the same change. Remove one only when nothing carries it.
- Give a new role or certification a unique `slug` and at least one tag.
- Run `pnpm check:taxonomy`, `pnpm check` and `pnpm build`, and read their output.
- Open a tag page with both entries and bio records (`/tags/web-app`), one with bio records only (`/tags/cloud`), and follow a "From my bio" card to its anchor on `/bio`.
- Related: [Entries](entries.md), [Article engines](article-engines.md), [Search](search.md), [Release notes](release-notes.md), [Head and SEO](head-and-seo.md).

## Checks

- Astro's content schema during `pnpm check` and `pnpm build`.
- The `TagSlug` and `TechName` types during `pnpm check`.
- `scripts/check-taxonomy.mjs` before every build, and by `pnpm check:taxonomy`.
- `scripts/generate-cover-backdrops.mjs` fails the build when a content `image` is missing from `public/images/`, except for a live-cover post.
- None for the tag and tech pages, the "From my bio" cards or the anchors on `/bio`.

## Known limits

- `check-taxonomy.mjs` reads content frontmatter with a regex. It needs `tags` and `tech` written on one line (`[..., ...]`) and reports a list it cannot read.
- The `TagSlug[]` type allows an empty list; only `check-taxonomy.mjs` catches a role or certification with no tag.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm check` and `pnpm build` pass, the taxonomy check included.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
