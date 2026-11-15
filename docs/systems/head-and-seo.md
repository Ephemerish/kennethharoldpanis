# Head and SEO

Standards: KHP §7.2, §7.3, §1.3

## Purpose

Every page's `<head>` is written in one place: title, description, canonical
URL, share cards, the favicon and the font. The sitemap and robots file list
what search engines may read. The theme script that also runs in the head is
[Theme tokens](theme-tokens.md).

## Implementation

- `src/app/layout/Head.astro`: rendered by `MainLayout`. Props: `title` (default `site.name`), `description` (default `site.description`), `image` (default `site.image`, `/images/me/me.jpg`), `type` (default `website`), `noindex`.
  - `<title>` and the share titles are the `title` prop as given.
  - Canonical and `og:url`: the path on `Astro.site` (`https://kennethharoldpanis.com`, from `astro.config.mjs`), falling back to `site.url`. The share image is made absolute the same way.
  - Open Graph: type, site name, title, description, image, URL. Twitter: `summary_large_image` with title, description, image.
  - `/favicon.ico` and a sitemap link. No theme colour, manifest or app icons.
  - Outfit from Google Fonts with `display=swap`, then `ThemeScript`.
  - `noindex` adds `<meta name="robots" content="noindex">`.
- Page titles: each page passes its full title: "Kenneth Harold Panis - Software Engineer" (home), "Projects - Kenneth Harold Panis", "Blog - Kenneth Harold Panis", "Bio - Kenneth Harold Panis", "Resume - Kenneth Harold Panis", "Contact - Kenneth Harold Panis", "Tagged “…” - Kenneth Harold Panis", "Built with … - Kenneth Harold Panis", "404 - Page Not Found". Articles get "<title> - Kenneth Harold Panis" from `ArticleLayout`.
- `src/app/layout/ArticleLayout.astro`: passes the entry title followed by " - " and `site.name`, its description, `type` (`article` by default) and `/images/<cover>` as the image, or `/images/me/me.jpg` when there is no hero image (the pretext post).
- `src/app/pages/bio/resume/Resume.astro`: passes `noindex` while `resumeAvailable` is false.
- `src/pages/sitemap.xml.ts`: prerendered, built from `loadTaxonomy` ([Content registries](content-registries.md)). `/`, `/bio`, `/projects`, `/blogs`, `/contact`; `/bio/resume` only when `resumeAvailable`; `/blogs/page/N` from 2; every project and post; a tag or tech page for each one any project, post, role or certification carries. Sorted, absolute on `site.url`.
- `src/pages/robots.txt.ts`: prerendered. Allows all, disallows `/api/`, names the sitemap.
- `public/favicon.ico`: the original favicon.

## Must stay true

1. Every page gets its head from `Head.astro` through `MainLayout`. No page writes its own meta tags (KHP §7.2).
2. Every page has a canonical URL on the production host and an absolute share image.
3. The 404 page passes `noindex`, and so does `/bio/resume` while `resumeAvailable` is false.
4. The sitemap lists exactly the public pages that build. The sitemap and `getStaticPaths` in `src/pages/tags/[slug].astro` and `src/pages/tech/[slug].astro` all read `loadTaxonomy`, so a tag or tech page is listed exactly when it is built (KHP §7.3). `/bio/resume` is left out until `resumeAvailable`.
5. Name, description, URL and default image come from `site.ts` (KHP §1.3).
6. `/api/` stays disallowed in robots.
7. An article's title ends with the site name, read from `site.ts`.

## Before changing

- Build and read the heads in `dist/client/index.html`, one article and `404.html`.
- Fetch `/sitemap.xml` and `/robots.txt` from the build and check every URL resolves.
- Paste an article URL into a share-card validator after deploy.
- Related: [Article engines](article-engines.md), [Content registries](content-registries.md) (`resume.ts`).

## Checks

None. No script checks the head, the sitemap or robots.

## Known limits

- The 404 title has no site name.
- Titles other than articles are written in each page, so the " - Kenneth Harold Panis" suffix is repeated rather than read from `site.ts`.
- The home page's description is its own text, not `site.description`. Both name "Alphaus Inc", which `experience.ts` also holds.
- No `article:published_time` and no `lastmod` in the sitemap.
- Fonts load from Google Fonts with no self-hosted copy.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] Built heads, sitemap and robots were read.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
