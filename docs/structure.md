# Where code goes

How the site's code is organised, so anyone can find a thing from the URL it shows up on, and knows where new code goes. Adapted from Ebb's `docs/structure.md` (KHP §8.1). The rule in short: **code lives as close as it can to what uses it, and moves up only when a second user appears.**

## The folders

```
src/
  pages/            Astro routes: one thin file per URL (getStaticPaths, props, the page). Nothing else.
    api/            The server's endpoints: one file per endpoint.
  app/
    pages/          One folder per route, named and nested as its URL. A page's own code.
    features/       A use case two or more pages need: its UI and logic together (entries, taxonomy, article, search, analytics).
    shared/         The brand icons (GitHub, LinkedIn, envelope) and the email link: the only raw HTML in Astro templates outside lib/khp-ui.
    layout/         The frame around every page: head, theme script and toggle, top bar, footer, the article layout.
    calc/           Pure functions, no rendering (dates, reading time).
    api/            What the browser calls, and the server's clients (nanostores, Supabase).
  data/             Everything that is content, data or a tunable. Code reads it; it renders nothing.
    site.ts         The site's name, URL, description, email, default share image, socials, navLinks, isCurrent.
    settings.ts     lists (home and blog page sizes), contactLimits, performanceBudget.
    content/        blog/*.md and projects/*.md, loaded by src/content.config.ts.
    bio/            experience.ts, certifications.ts, resume.ts.
    taxonomy/       technologies.ts, tags.ts.
    apps/           apps.ts and patch-notes/ (the mirrored release notes).
    contact/        subjects.ts.
  content.config.ts The content collections: glob loaders over src/data/content, and their schema.
lib/khp-ui/         The theme and generic components. Knows nothing about projects, posts or this site's words.
  tokens/           theme.css and prose.css.
  components/       layout/, type/, media/, surface/, form/, overlay/ (see lib/khp-ui/AGENTS.md).
  utils/            cn.
  index.ts          The barrel every Astro file imports from (@ui).
tests/
  unit/             Node tests (pnpm test).
  e2e/              Playwright: every page and every feature (pnpm test:e2e).
  perf/             Playwright: the performance budget (pnpm test:perf).
  support/          The route list from the built sitemap, and the vitals helpers.
public/             Static files: images, the favicon, cover backdrops.
scripts/            Build checks and generators, run by package.json scripts.
server.mjs          The production server: static files precompressed and cached, the rest to Astro.
playwright.config.ts The browser tests' config.
docs/               Standards, this guide, and the system contracts.
```

Contact has no feature folder: its form is one page's code (`app/pages/contact/`), its subjects are data (`data/contact/subjects.ts`), and its endpoint is `pages/api/contact.ts`.

## Pages mirror routes

| URL | Route file | Page folder | Entry |
| --- | ---------- | ----------- | ----- |
| `/` | `pages/index.astro` | `app/pages/home/` | `Home.astro` |
| `/projects` | `pages/projects/index.astro` | `app/pages/projects/` | `Projects.astro` |
| `/projects/[slug]` | `pages/projects/[slug].astro` | `app/pages/projects/[slug]/` | `ProjectDetail.astro` |
| `/blogs`, `/blogs/page/[page]` | `pages/blogs/index.astro`, `pages/blogs/page/[page].astro` | `app/pages/blogs/` | `Blogs.astro` |
| `/blogs/[slug]` | `pages/blogs/[slug].astro` | `app/pages/blogs/[slug]/` | `BlogPost.astro` |
| `/bio` | `pages/bio/index.astro` | `app/pages/bio/` | `Bio.astro` |
| `/bio/resume` | `pages/bio/resume.astro` | `app/pages/bio/resume/` | `Resume.astro` |
| `/contact` | `pages/contact/index.astro` | `app/pages/contact/` | `Contact.astro` |
| `/tags/[slug]` | `pages/tags/[slug].astro` | `app/pages/tags/[slug]/` | `TagPage.astro` |
| `/tech/[slug]` | `pages/tech/[slug].astro` | `app/pages/tech/[slug]/` | `TechPage.astro` |
| 404 | `pages/404.astro` | `app/pages/not-found/` | `NotFound.astro` |

- Folder names are the URL segments as written, `[param]` kept. `/` is `home`.
- A sub-page is a sub-folder of its parent page.
- The entry file is named after the page in PascalCase and is the only page file the route imports. One exception: the sitemap and `pages/blogs/page/[page].astro` read the paging helpers in `app/pages/blogs/model.ts`.
- A route's `getStaticPaths` may read data: projects and posts from the collections (the slug is `entry.id`), tag and tech pages from `loadTaxonomy` in `app/features/taxonomy/collect.ts`.
- A new route means a new route file **and** a new page folder, in the same change, and a sitemap entry (KHP §7.3).
- Generated endpoints (`search.json.ts`, `sitemap.xml.ts`, `robots.txt.ts`) are route files that read from `app/`. Search and the sitemap read `loadTaxonomy`, like the tag and tech routes.

## Where a piece of code goes

First look in [systems.md](systems.md): if a system already does the job, use or extend it. Then put it at the lowest place that covers every user:

1. **One page** → that page's folder (`app/pages/projects/[slug]/ProjectUpdates.astro`).
2. **A page and its sub-pages** → the parent page's folder.
3. **Two or more pages, one use case** (entries, taxonomy, article engines, search, analytics) → `app/features/<use-case>/`. Name it for what it does.
4. **Two or more pages, no single use case** (the brand icons, the email link) → `app/shared/`.
5. **No rendering, just calculation** that several places share → `app/calc/`. A calculation only one feature uses stays beside it as `model.ts`.
6. **Generic UI** that would make sense on another site and takes its data as props → `lib/khp-ui/components/<group>/`. If it knows about projects, posts or this site's words, it stays in `app/`. A page needs a new kind of element → it becomes a component here first (KHP §4.9).
7. **A fact, a list of records, a piece of content or a number someone may tune** → `src/data/`. Code never holds its own copy (KHP §1.3).

Moving up: when a second page needs something, move it then, in the same change. A page never imports another page's folder; that is the sign it should move. Moving down: when one user is left, move it back.

## When to split a file

Split a file when it passes about 250 lines, holds two components with their own jobs, or mixes view and calculation. Don't split below about 40 lines, or into pieces used once that read worse apart.

How a page folder usually reads:

```
app/pages/projects/[slug]/
  ProjectDetail.astro   the page: reads the entry, sets the status badge, lays out the parts
  ProjectActions.astro  Visit Live Site and View Code
  ProjectLead.astro     gallery and overview, before the story
  ProjectDetails.astro  the Overview card (a Panel): materials, facts, key features, challenges
  Gallery.tsx           the thumbnail grid island
  ProjectUpdates.astro  the release-notes FloatingButton and Drawer
  ReleaseEntry.astro    one release inside it
```

## Aliases

| Alias | Points to |
| ----- | --------- |
| `@ui` | `lib/khp-ui/index.ts` |
| `@ui/*` | `lib/khp-ui/*` (React islands import `@ui/components/<group>/<Name>`) |
| `@app/*` | `src/app/*` |
| `@data/*` | `src/data/*` |

Tests and scripts run outside Astro, so they import by relative path, not by alias.
