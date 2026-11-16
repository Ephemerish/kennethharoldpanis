# 7. Content, metadata and assets

## At a glance

- Tags and technologies come from registries, and each one is attached to real work (§7.1).
- Every page's head comes from `Head.astro` (§7.2).
- The sitemap and robots file are generated (§7.3).
- Every image has a purpose-written `alt` or is decorative; a missing content image fails the build (§7.5).
- The home page keeps to its performance budget (§7.6).
- Every page and interaction keeps to the site's performance budget, and files are served compressed and cached (§7.7).

## 7.1 Content and the taxonomy

Everything that is content or data lives in `src/data/` (§8.1). Posts are `src/data/content/blog/*.md`, projects `src/data/content/projects/*.md`, loaded by the glob loaders in `src/content.config.ts`, which also holds their schema. An entry's slug is its `entry.id`, and its body renders with `render(entry)`. Experience, certifications and the resume flag are in `src/data/bio/`, the live apps in `src/data/apps/`.

Tags (`src/data/taxonomy/tags.ts`) and technologies (`src/data/taxonomy/technologies.ts`) are the taxonomy. Projects, posts, roles and certifications all carry them. The two never overlap:

- **A technology is a named tool with a logo** (React, AWS, FinOps, LoRa). It answers "what did he use?". Anything with a name, a logo and a website is a technology, never a tag.
- **A tag is a theme that groups work across tools** (Web App, Side Project, Thesis). It answers "what kind of work is this?". A tag earns its place only by grouping: it is carried by at least 2 items, its label and slug never repeat a technology's name, and an item carries at most 3 tags.
- Every project and post has at least one tag and one technology; the schema fails the build on an unknown one. A post may leave out its image only when its engine draws a live cover.
- Every role and certification has a `slug` (its anchor on `/bio`) and at least one tag or one technology. A certification usually needs only tech: the AWS one is AWS. They name them through the `TagSlug` and `TechName` types, so a typo fails `astro check`.
- Every registered tag and technology is attached to something. `scripts/check-taxonomy.mjs` fails the build on a tag or tech nothing carries, a tag fewer than 2 things carry, a tag named like a tech, or an item with more than 3 tags.
- Every technology logo is visible on a light and a dark tile. A logo drawn in black or white gets an `imagePathDark` variant; `scripts/check-assets.mjs` (`pnpm check:assets`) measures each one and fails under 50% visible pixels.
- One collector, `loadTaxonomy` in `src/app/features/taxonomy/collect.ts`, feeds the tag pages, the tech pages, the sitemap and search, so they never disagree about what exists.

Add to the registry first, then attach it to the work it belongs to. *Why:* a tag or technology with nothing behind it is a skill the site claims but does not show (§10.4). The registry once had 26 tags, most of them carried by one item or repeating a tech (a "cloud" tag beside AWS and Google Cloud, a "finops" tag beside the FinOps certification), so a tag page showed one thing or the same thing as a tech page. The grouping rule keeps only tags that answer a question tech can't. A logo drawn in black was invisible on the dark theme until the asset check measured it. The rule used to check only projects and posts, so a tag or tech named by a role or certification went unchecked, and an unused tag was never caught.

## 7.2 Head and metadata

`src/app/layout/Head.astro` writes every page's head from the props `MainLayout` passes: the title as given, the description (default `site.description`), a canonical URL, Open Graph and Twitter cards, the share image (default `site.image`, `/images/me/me.jpg`), `/favicon.ico`, the sitemap link and Outfit. Each page passes its full title in the form "Projects - Kenneth Harold Panis", plus its description. An article passes its own title, and `ArticleLayout` adds the site name ("Soo I tried pretext - Kenneth Harold Panis"); it passes its cover as the image, or the default when it has none. A page that shouldn't be indexed passes `noindex`: the 404 page, and `/bio/resume` while the resume is unpublished.

## 7.3 Sitemap and robots

`/sitemap.xml` lists every public page from the collections, the registries and `loadTaxonomy`, so a tag or tech page is listed when anything carries it; `/robots.txt` points to it and keeps crawlers out of `/api/`. A new route is added to the sitemap in the same change.

## 7.4 Brand assets

Removed: the owner's visual style keeps the original `favicon.ico` and his photo as the share image; there is no generated brand mark or icon set.

## 7.5 Images

- Covers and gallery images live in `public/images/`. Each cover gets a tiny blurred backdrop (`generate-cover-backdrops.mjs`, run by `pnpm build`), so a cover of any shape fills its frame. The build fails when a content image is missing, except for a post whose engine draws a live cover.
- `alt` says what the image shows. An image that repeats nearby text, or is decoration, has `alt=""`.
- Every image is `Image` from `@ui`, lazy by default. An image above the fold passes `priority`, which loads it eagerly with `fetchpriority="high"`: the hero photo, an article's cover, the featured card's cover, and the covers in the first row of the `/blogs` grid and the tag and tech page grids (`FIRST_ROW`, 3, in `src/app/features/entries/model.ts`). *Why:* the first row is on screen when the page opens, so a lazy cover there delays the page's Largest Contentful Paint (§7.7).

## 7.6 The home page's performance budget

The home page is the first page most readers load, so it has a budget. `scripts/check-home-performance.mjs` (`pnpm check:output`) checks it on the built HTML:

- No island hydrates with `client:load`. The top bar waits for idle.
- The pretext post's card paints its still strips (`data-pretext-still`) at once; the live `PretextCover` hydrates over them with `client:visible`.
- No CSS blur classes (`blur-2xl`, `backdrop-blur`); a blur repaints on every scroll frame.
- The marquee's second copy is `inert`, so it is not tabbed to or read out twice.
- The HTML stays under 120 KB.

The same script checks that the pretext article keeps its live cover. `/blogs`, tag and tech pages use the same still-then-live card. *Why:* this rule used to keep the home page idle by turning its live cover off. The owner wants the site to move, so the rule now limits what motion costs instead of banning it (§5.8).

## 7.7 The performance budget

Every page must feel fast on a mid-range phone. The budget is in `performanceBudget` in `src/data/settings.ts`, its one home (§1.3):

| Measure | Budget |
| ------- | ------ |
| Largest Contentful Paint | 2500 ms |
| Cumulative Layout Shift | 0.1 |
| Total Blocking Time while loading | 200 ms |
| Interaction to Next Paint | 200 ms |
| JavaScript before any input, on the wire | 200 KB |
| One page's HTML, on the wire | 150 KB |
| Scroll frames over 50 ms | at most 5% |
| Scroll frame time, 95th percentile | 34 ms |

The page-load numbers are Google's "good" Core Web Vitals. `pnpm test:perf` (`tests/perf/performance.spec.ts`) measures 11 representative pages and 6 interactions against it in Chrome, with the CPU slowed 4x and a 4G network ([testing](../systems/testing.md)). A miss fails with the numbers.

- **Compressed and cached.** `pnpm build` ends with `scripts/compress-assets.mjs`, which writes a Brotli (`.br`) and a gzip (`.gz`) copy of every text file of 1 KB or more in `dist/client`. `server.mjs` sends the smallest copy the browser accepts. Hashed files under `/_astro/` are cached for a year as `immutable`; HTML is `must-revalidate`; other files are cached for a day. It answers `304` when `If-Modified-Since` matches.
- **First row eager.** Covers above the fold load first (§7.5).
- **No CSS blur filters.** A `blur-*` or `backdrop-blur` class repaints on every scroll frame. A soft halo is `soft-glow` from `theme.css`, a radial gradient that costs nothing to scroll.
- **Motion on its budget** (§5.8), and the home page's own checks (§7.6).

*Why:* the site served every file uncompressed. The home page's HTML was 89 KB on the wire; Brotli brings it to 11 KB. The PageHeader glow and the certification card halo were CSS blurs, which made scrolling heavy. A budget with a test makes "fast" a number a change can break, not a feeling.

## Checklist

- [ ] New tags and technologies are in their registries and attached to real work; a tag groups 2 or more and repeats no tech; roles and certifications have a `slug` and a tag or tech; a new logo is visible in both themes; `pnpm check:taxonomy` and `pnpm check:assets` pass (§7.1).
- [ ] The page passes its full title and description; articles pass their cover (§7.2).
- [ ] The sitemap includes the new route (§7.3).
- [ ] Every image exists and has the right `alt` (§7.5).
- [ ] The home page keeps its budget; `pnpm check:output` passes (§7.6).
- [ ] `pnpm test:perf` passes; above-the-fold images pass `priority`; no CSS blur (§7.7).
