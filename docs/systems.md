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
| Theme tokens | The brand, neutral and status scales for light and dark, `white`, `black`, `ink`, the brand gradients and shadows, square corners, layers, the motion tokens, transitions and utilities (`motion-lift`, `motion-zoom`, the marquee) and the reduced-motion switch, `stretched-link`, the section toggle styles, the theme script and toggle, the token guard | [Theme tokens](systems/theme-tokens.md) |
| Frame and navigation | `MainLayout`, the skip link, `PageSection` and the rails column, the top bar, Apps menu, mobile menu, footer, `navLinks` and the current-page mark | [Frame and navigation](systems/frame-and-navigation.md) |

## Content

| System | Owns | Contract |
| --- | --- | --- |
| Content registries | The content schema, tags, technologies, engines enum, experience, certifications, resume flag, apps; the taxonomy (`loadTaxonomy`, tag and tech pages, their "From my bio" cards, tag links) and the taxonomy check | [Content registries](systems/content-registries.md) |
| Entries | Entry cards (grid and featured), covers (a still, then live; or an image with a backdrop), grids, tag and tech chips, list sorting and project status words, backdrop generation | [Entries](systems/entries.md) |
| Article engines | `ArticleLayout`, the prose and pretext engines, Prose enhancements, figures, the image viewer, the live cover's frame loop | [Article engines](systems/article-engines.md) |
| Release notes | The mirrored app release notes, the sync script, the project release drawer | [Release notes](systems/release-notes.md) |

## Features

| System | Owns | Contract |
| --- | --- | --- |
| Search | The build-time index, the lazy fetcher stores, ranking, the combobox, popular suggestions, the `open-search` event | [Search](systems/search.md) |
| Contact | The contact form, subjects, `sendContact`, `/api/contact`, email link obfuscation | [Contact](systems/contact.md) |

## Platform

| System | Owns | Contract |
| --- | --- | --- |
| Head and SEO | Page titles, description, canonical, share cards, the favicon, `noindex`, sitemap, robots | [Head and SEO](systems/head-and-seo.md) |
| Analytics | The page-view beacon, `/api/analytics`, the fail-soft Supabase client, the table setup script | [Analytics](systems/analytics.md) |

## Checks at a glance

`pnpm verify` runs `astro check`, `check:tokens`, `test`, `build` (which runs
the taxonomy check and the backdrop script first) and `check:output` (the home
page's performance budget and the release-note controls) (KHP §9.2). Search, contact, analytics, head and SEO and the frame have no
automated checks; their files say what to try by hand.
