# 7. Content, metadata and assets

## At a glance

- Tags and technologies come from registries, and each one is attached to real work (§7.1).
- Every page's head comes from `Head.astro` (§7.2).
- The sitemap and robots file are generated (§7.3).
- Every image has a purpose-written `alt` or is decorative; a missing content image fails the build (§7.5).
- The home page keeps to its performance budget (§7.6).

## 7.1 Content and the taxonomy

Posts are `src/content/blog/*.md`, projects `src/content/projects/*.md`; the schema is `src/content/config.ts`. Experience, certifications, apps and the resume flag are data files in `src/app/data/`.

Tags (`tags.ts`) and technologies (`technologies.ts`) are the taxonomy. Projects, posts, roles and certifications all carry them:

- Every project and post has at least one tag and one technology from the registries; the schema fails the build on an unknown one. A post may leave out its image only when its engine draws a live cover.
- Every role in `experience.ts` and certification in `certifications.ts` has a `slug` (its card's anchor on `/bio`), tags, and optional tech. They name them through the `TagSlug` and `TechName` types, so a typo fails `astro check`.
- Every registered tag and technology is attached to at least one project, post, role or certification, and everything has at least one tag. `scripts/check-taxonomy.mjs` fails the build otherwise.
- One collector, `loadTaxonomy` in `src/app/features/taxonomy/collect.ts`, feeds the tag pages, the tech pages, the sitemap and search, so they never disagree about what exists.

Add to the registry first, then attach it to the work it belongs to. *Why:* a tag or technology with nothing behind it is a skill the site claims but does not show (§10.4). The rule used to check only projects and posts, so a tag or tech named by a role or certification went unchecked, and an unused tag was never caught.

## 7.2 Head and metadata

`src/app/layout/Head.astro` writes every page's head from the props `MainLayout` passes: the title as given, the description (default `site.description`), a canonical URL, Open Graph and Twitter cards, the share image (default `site.image`, `/images/me/me.jpg`), `/favicon.ico`, the sitemap link and Outfit. Each page passes its full title in the form "Projects - Kenneth Harold Panis", plus its description. An article passes its own title, and `ArticleLayout` adds the site name ("Soo I tried pretext - Kenneth Harold Panis"); it passes its cover as the image, or the default when it has none. A page that shouldn't be indexed passes `noindex`: the 404 page, and `/bio/resume` while the resume is unpublished.

## 7.3 Sitemap and robots

`/sitemap.xml` lists every public page from the collections, the registries and `loadTaxonomy`, so a tag or tech page is listed when anything carries it; `/robots.txt` points to it and keeps crawlers out of `/api/`. A new route is added to the sitemap in the same change.

## 7.4 Brand assets

Removed: the owner's visual style keeps the original `favicon.ico` and his photo as the share image; there is no generated brand mark or icon set.

## 7.5 Images

- Covers and gallery images live in `public/images/`. Each cover gets a tiny blurred backdrop (`generate-cover-backdrops.mjs`, run by `pnpm build`), so a cover of any shape fills its frame. The build fails when a content image is missing, except for a post whose engine draws a live cover.
- `alt` says what the image shows. An image that repeats nearby text, or is decoration, has `alt=""`.
- Images below the fold load lazily; the featured card's cover loads eagerly.

## 7.6 The home page's performance budget

The home page is the first page most readers load, so it has a budget. `scripts/check-home-performance.mjs` (`pnpm check:output`) checks it on the built HTML:

- No island hydrates with `client:load`. The top bar waits for idle.
- The pretext post's card paints its still strips (`data-pretext-still`) at once; the live `PretextCover` hydrates over them with `client:visible`.
- No CSS blur classes (`blur-2xl`, `backdrop-blur`); a blur repaints on every scroll frame.
- The marquee's second copy is `inert`, so it is not tabbed to or read out twice.
- The HTML stays under 120 KB.

The same script checks that the pretext article keeps its live cover. `/blogs`, tag and tech pages use the same still-then-live card. *Why:* this rule used to keep the home page idle by turning its live cover off. The owner wants the site to move, so the rule now limits what motion costs instead of banning it (§5.8).

## Checklist

- [ ] New tags and technologies are in their registries and attached to real work; roles and certifications have a `slug` and tags; `pnpm check:taxonomy` passes (§7.1).
- [ ] The page passes its full title and description; articles pass their cover (§7.2).
- [ ] The sitemap includes the new route (§7.3).
- [ ] Every image exists and has the right `alt` (§7.5).
- [ ] The home page keeps its budget; `pnpm check:output` passes (§7.6).
