# Where code goes

How the site's code is organised, so anyone can find a thing from the URL it shows up on, and knows where new code goes. Adapted from Ebb's `docs/structure.md` (KHP §8.1). The rule in short: **code lives as close as it can to what uses it, and moves up only when a second user appears.**

## The folders

```
src/
  pages/            Astro routes: one thin file per URL (getStaticPaths, props, the page). Nothing else.
    api/            The server: one file per endpoint.
  app/
    pages/          One folder per route, named and nested as its URL. A page's own code.
    features/       A use case two or more pages need: its UI and logic together (entries, taxonomy, article, search, contact, analytics).
    shared/         App-wide glue with no single use case (site identity and links, the email link, the GitHub and LinkedIn icons).
    layout/         The frame around every page: head, theme script and toggle, top bar, footer, the article layout.
    calc/           Pure functions, no rendering (dates, reading time).
    api/            What the browser calls, and the server's clients (nanostores, Supabase).
    data/           Registries: technologies, tags, experience, certifications, resume, apps, release notes.
  content/          Astro content collections: blog posts and projects, and their schema.
lib/khp-ui/         The theme and generic components. Knows nothing about projects, posts or this site's words.
public/             Static files: images, the favicon, cover backdrops.
scripts/            Build checks and generators, run by package.json scripts.
docs/               Standards, this guide, and the system contracts.
```

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
- A route's `getStaticPaths` may read data: projects and posts from the collections, tag and tech pages from `loadTaxonomy` in `app/features/taxonomy/collect.ts`.
- A new route means a new route file **and** a new page folder, in the same change, and a sitemap entry (KHP §7.3).
- Generated endpoints (`search.json.ts`, `sitemap.xml.ts`, `robots.txt.ts`) are route files that read from `app/`. Search and the sitemap read `loadTaxonomy`, like the tag and tech routes.

## Where a piece of code goes

First look in [systems.md](systems.md): if a system already does the job, use or extend it. Then put it at the lowest place that covers every user:

1. **One page** → that page's folder (`app/pages/projects/[slug]/ProjectUpdates.astro`).
2. **A page and its sub-pages** → the parent page's folder.
3. **Two or more pages, one use case** (entries, taxonomy, article engines, search, contact, analytics) → `app/features/<use-case>/`. Name it for what it does.
4. **Two or more pages, no single use case** (site identity, the email link) → `app/shared/`.
5. **No rendering, just calculation** that several places share → `app/calc/`. A calculation only one feature uses stays beside it as `model.ts`.
6. **Generic UI** that would make sense on another site and takes its data as props → `lib/khp-ui/`. If it knows about projects, posts or this site's words, it stays in `app/`.

Moving up: when a second page needs something, move it then, in the same change. A page never imports another page's folder; that is the sign it should move. Moving down: when one user is left, move it back.

## When to split a file

Split a file when it passes about 250 lines, holds two components with their own jobs, or mixes view and calculation. Don't split below about 40 lines, or into pieces used once that read worse apart.

How a page folder usually reads:

```
app/pages/projects/[slug]/
  ProjectDetail.astro   the page: reads the entry, sets the status badge, lays out the parts
  ProjectActions.astro  Visit Live Site and View Code
  ProjectLead.astro     gallery and overview, before the story
  ProjectDetails.astro  the Overview card: materials, facts, key features, challenges
  Gallery.tsx           the thumbnail grid island
  ProjectUpdates.astro  the floating release-notes trigger and drawer
  ReleaseEntry.astro    one release inside it
```

## Aliases

| Alias | Points to |
| ----- | --------- |
| `@ui` | `lib/khp-ui/index.ts` |
| `@ui/*` | `lib/khp-ui/*` (React islands import components directly) |
| `@app/*` | `src/app/*` |
