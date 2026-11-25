# Systems

Every system the site has: logic or UI that more than one page relies on, or
that decides how something works everywhere. Read this before building
anything. If a system does the job, use it; if one nearly does, extend it
(KHP §1.4).

Before changing a system, read its file and keep every item in its
**Must stay true** list. Each file also says which checks guard it and which
gaps are known. Change a system, change its file and its row here in the same
change (KHP §1.5). Use [the template](systems/TEMPLATE.md) for a new one.

## Design system

| System | Owns | Contract |
| --- | --- | --- |
| Theme tokens | The brand, neutral and status scales for light and dark, `white`, `black`, `ink`, the brand gradients and shadows, the self-hosted Outfit, square corners, layers, the motion token, the base transition, the marquee, the splash's styles and the reduced-motion switch, the resilience classes (`js-only`, `no-js-only`), `.float-btn` and `.float-tip`, `.drawer`, the section toggle styles, the theme script and toggle, the token guard | [Theme tokens](systems/theme-tokens.md) |
| Components | The `lib/khp-ui` components every page is composed from, and the composition check (KHP §4.9) | [lib/khp-ui/AGENTS.md](../lib/khp-ui/AGENTS.md) |
| Frame and navigation | `MainLayout`, the splash (`Splash`, its pieces in `src/app/layout/brand/splash.json`), `SkipLink`, `Frame`, `PageSection` and the rails column, the top bar, Apps menu, mobile menu, footer, `site.ts` (`navLinks`, `isCurrent`) and the current-page mark | [Frame and navigation](systems/frame-and-navigation.md) |

## Content

| System | Owns | Contract |
| --- | --- | --- |
| Content registries | `src/data/`: the content collections (`src/content.config.ts` over `src/data/content/`), tags, technologies, the engines enum, experience, certifications, resume flag, apps, `settings.ts`; the taxonomy (`loadTaxonomy`, tag and tech pages, their "From my bio" cards, tag links), the taxonomy check and the logo visibility check (`check-assets.mjs`) | [Content registries](systems/content-registries.md) |
| Entries | Entry cards (grid and featured), covers (a still, then live; or an image with a backdrop), first-row eager covers, grids, tag and tech chips, list sorting and project status words, backdrop generation | [Entries](systems/entries.md) |
| Article engines | `ArticleLayout`, the prose and pretext engines, Prose enhancements, figures, the image viewer, the live cover's frame loop | [Article engines](systems/article-engines.md) |
| Release notes | The mirrored app release notes, the sync script, the project page's release-notes button and drawer | [Release notes](systems/release-notes.md) |

## Features

| System | Owns | Contract |
| --- | --- | --- |
| Search | The build-time index, the lazy fetcher stores, ranking, the combobox, popular suggestions, the `open-search` event | [Search](systems/search.md) |
| Contact | The contact form, subjects, `sendContact`, `/api/contact`, email link obfuscation | [Contact](systems/contact.md) |

## Platform

| System | Owns | Contract |
| --- | --- | --- |
| Head and SEO | Page titles, description, canonical, share cards, the favicons and `generate-brand.mjs`, `noindex`, sitemap, robots; the production server (`server.mjs`), precompression and caching | [Head and SEO](systems/head-and-seo.md) |
| Analytics | The page-view beacon, `/api/analytics`, the fail-soft Supabase client, the table setup script | [Analytics](systems/analytics.md) |
| Testing | The unit, end-to-end, accessibility (axe, both themes) and performance suites, the Playwright config, the route list and the vitals helpers, the performance budget's measurement | [Testing](systems/testing.md) |

## Checks at a glance

`pnpm verify` runs `astro check`, `check:tokens`, `check:composition`, `test`
(unit), `build` (the taxonomy check and the backdrop script first, the
compressed copies last), `check:output` (the home page's checks and the
release-note controls), `test:e2e` (every page and feature in a browser) and
`test:perf` (the performance budget) (KHP §9.2). The browser suites cover the
frame, search, contact's form, release notes, article enhancements and the
image viewer by behaviour; [testing](systems/testing.md) lists what they try
and each system's file says what is still tried by hand. Analytics and the
head tags have no automated checks.
