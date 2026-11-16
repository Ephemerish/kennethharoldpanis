# 2. Pages and navigation

## At a glance

- The top bar and footer are the same on every page (§2.1).
- A page is a place someone goes on purpose (§2.2).
- URLs are nouns, lower case, and never change once published (§2.3).
- The current page is marked in the top bar and the mobile menu (§2.4).
- Every page has a way on: no dead ends (§2.5).

## 2.1 The frame

Every page has the same top bar and footer, from `src/app/layout/`, reading their links from `src/data/site.ts`. A "Skip to content" link comes first and jumps to `#main`. The page body is a column, so on a short page the footer sits at the bottom of the window and the rails run on down to it.

- Top bar: the owner's name in `text-brand-gradient` as the home link, then Home, Bio, Projects, Blogs, the Apps menu, Contact, search and the theme toggle. It is sticky and persists across view transitions.
- Below `lg`, the links, search, apps and theme toggle move into one menu under the bar. Escape or a link closes it. "Search for something else" opens it with search focused.
- Footer: the name in `text-brand-gradient`, GitHub, LinkedIn and email icons, and a "Get in Touch" button to `/contact`.

## 2.2 What is a page

| Is a page | Is not a page |
| --------- | ------------- |
| A list people browse (projects, posts, a tag, a technology) | One fact's detail: it sits beside the fact |
| One entry people link to (a project, a post) | A confirmation: a toast says it (§6.4) |
| A way to act (contact) | A placeholder for something not built |

`/bio/resume` shows "Resume coming soon" until `resumeAvailable` is true. Nothing links to it and the sitemap leaves it out until then.

## 2.3 URLs

| URL | Page |
| --- | ---- |
| `/` | Home |
| `/projects`, `/projects/[slug]` | Projects, one project |
| `/blogs`, `/blogs/page/[n]`, `/blogs/[slug]` | Posts, more posts, one post |
| `/bio`, `/bio/resume` | Bio, resume |
| `/contact` | Contact |
| `/tags/[slug]`, `/tech/[slug]` | Everything with a tag, everything built with a technology |

A slug is the content file's name. A role or certification has no page of its own; `/bio#<slug>` reaches its card. A moved page keeps a redirect in `astro.config.mjs` (`/certifications`, `/bio/certifications` and `/bio/experience` go to `/bio`). Pagination is static: page 1 is `/blogs`, page n is `/blogs/page/n`; never a query string on a prerendered page, which would always render page 1.

## 2.4 The current page is marked

The top bar and the mobile menu colour the current page's link `brand-700` and set `aria-current="page"`, for the page and its sub-pages (`isCurrent` in `src/data/site.ts`). The persisted top bar reads the URL again on `astro:page-load`, so the mark follows view transitions.

## 2.5 No dead ends

Every page keeps the top bar, so there is always a way back. The 404 page links home, to projects, the blog and contact. An empty blog list says so. Every tag and tech page ends with "Search for something else". A tag or tech page lists every project, post, role and certification that carries it.

## Checklist

- [ ] The new page passes §2.2, and has a route file and a page folder (§8.1).
- [ ] Its URL follows §2.3, and it is in the sitemap (§7.3).
- [ ] The top bar marks it (§2.4); it has a way on (§2.5).
