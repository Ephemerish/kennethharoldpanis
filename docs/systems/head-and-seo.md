# Head and SEO

Standards: KHP §7.2, §7.3, §7.7, §1.3

## Purpose

Every page's `<head>` is written in one place: title, description, canonical
URL, share cards, the favicon and the font. The sitemap and robots file list
what search engines may read. The production server delivers all of it:
static files precompressed and cached, the rest handed to Astro. The theme
script that also runs in the head is [Theme tokens](theme-tokens.md); the
tests that drive the server are [Testing](testing.md).

## Implementation

- `src/app/layout/Head.astro`: rendered by `MainLayout`; reads `site` from `src/data/site.ts`. Props: `title` (default `site.name`), `description` (default `site.description`), `image` (default `site.image`, `/images/me/me.jpg`), `type` (default `website`), `noindex`.
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
- `astro.config.mjs`: `output: "server"` with the Node adapter in `middleware` mode, so Astro exports a request handler instead of starting its own server. Pages that set `prerender = true` are built to `dist/client`.
- `scripts/compress-assets.mjs`: the last step of `pnpm build`. Writes a Brotli (quality 11) `.br` and a gzip (level 9) `.gz` copy beside every `.html`, `.js`, `.mjs`, `.css`, `.json`, `.svg`, `.xml`, `.txt` and `.webmanifest` file of 1 KB or more in `dist/client`, and prints the total saved.
- `server.mjs`: the production server, run by `pnpm preview`, `pnpm start`, the Dockerfile (`CMD ["node", "server.mjs"]`) and the browser tests. Listens on `PORT` (default 3000) and `HOST` (default `0.0.0.0`).
  - A `GET` or `HEAD` outside `/api/` that names a file in `dist/client` (or a folder with an `index.html`) is served directly: the `.br` copy when the browser accepts `br`, else the `.gz` copy for `gzip`, else the file, with `Content-Encoding`, `Content-Length`, `Content-Type`, `Vary: Accept-Encoding` and `X-Content-Type-Options: nosniff`.
  - `Cache-Control`: files under `/_astro/` (hashed names) `public, max-age=31536000, immutable`; HTML `public, max-age=0, must-revalidate`; everything else `public, max-age=86400`.
  - `Last-Modified` from the file; a matching `If-Modified-Since` answers `304`.
  - A path that decodes or normalises to outside `dist/client` is not served from disk.
  - Everything else (the API, server-rendered routes, the 404 page) goes to Astro's `handler` from `dist/server/entry.mjs`.

## Must stay true

1. Every page gets its head from `Head.astro` through `MainLayout`. No page writes its own meta tags (KHP §7.2).
2. Every page has a canonical URL on the production host and an absolute share image.
3. The 404 page passes `noindex`, and so does `/bio/resume` while `resumeAvailable` is false.
4. The sitemap lists exactly the public pages that build. The sitemap and `getStaticPaths` in `src/pages/tags/[slug].astro` and `src/pages/tech/[slug].astro` all read `loadTaxonomy`, so a tag or tech page is listed exactly when it is built (KHP §7.3). `/bio/resume` is left out until `resumeAvailable`.
5. Name, description, URL and default image come from `site.ts` (KHP §1.3).
6. `/api/` stays disallowed in robots.
7. An article's title ends with the site name, read from `site.ts`.
8. Files are compressed at build time, never per request, and a browser gets the smallest encoding it accepts (KHP §7.7).
9. Hashed `/_astro/` files are cached for a year; HTML is revalidated on every visit, so a deploy shows at once.
10. The server never reads a file outside `dist/client`, whatever the URL holds.
11. `/api/` always reaches Astro, never a static file.

## Before changing

- Build and read the heads in `dist/client/index.html`, one article and `404.html`.
- After `pnpm build && pnpm preview`, fetch `/` with `Accept-Encoding: br` and check `Content-Encoding: br` and the `Cache-Control` header; fetch a `/_astro/` file and check `immutable`; fetch `/api/popular` and check it still answers.
- Fetch `/sitemap.xml` and `/robots.txt` from the build and check every URL resolves.
- Paste an article URL into a share-card validator after deploy.
- Related: [Article engines](article-engines.md), [Content registries](content-registries.md) (`resume.ts`).

## Checks

- `pnpm test:e2e` reads the built sitemap for its route list, so every listed page must load (200, no failed requests), and every internal link must resolve. An unknown URL must answer 404 ([Testing](testing.md)).
- `pnpm test:perf` measures HTML and JavaScript on the wire, through `server.mjs`, against the budget.
- None for the head tags, share cards or robots, or for the cache headers and the path guard.

## Known limits

- The 404 title has no site name.
- Titles other than articles are written in each page, so the " - Kenneth Harold Panis" suffix is repeated rather than read from `site.ts`.
- The home page's description is its own text, not `site.description`. Both name "Alphaus Inc", which `experience.ts` also holds.
- No `article:published_time` and no `lastmod` in the sitemap.
- Fonts load from Google Fonts with no self-hosted copy.
- `ArticleLayout` writes the default share image as `/images/me/me.jpg` instead of reading `site.image`.
- `server.mjs` compares `If-Modified-Since` to `Last-Modified` as exact strings, and sends no `ETag`.
- Files smaller than 1 KB and images are sent uncompressed. A file type not in `server.mjs`'s list is sent as `application/octet-stream`, uncompressed: today only `public/images/tech-logos/README.md`, which is copied into the build.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] Built heads, sitemap and robots were read.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
