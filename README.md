# kennethharoldpanis.com

The personal site of Kenneth Harold Panis: projects, writing, experience and contact. Built with Astro 5, React islands, Tailwind CSS v4 and TypeScript. In production `server.mjs` serves it on Cloud Run: static files precompressed and cached, everything else through Astro's Node adapter.

Contributors and agents start with [AGENTS.md](AGENTS.md), then [STANDARDS.md](STANDARDS.md). [docs/structure.md](docs/structure.md) says where code goes, [docs/systems.md](docs/systems.md) lists what the site already has, and [lib/khp-ui/AGENTS.md](lib/khp-ui/AGENTS.md) is the component catalogue.

## Run it

```sh
pnpm install
pnpm dev                    # development server, http://localhost:3000
pnpm build && pnpm preview  # the production build through server.mjs, http://localhost:3000
```

The dev port is set in `astro.config.mjs`; `server.mjs` reads `PORT` and `HOST` (defaults 3000 and `0.0.0.0`).

Set these in `.env` for the optional services: `RESEND_API_KEY` (contact form), `SUPABASE_URL` and `SUPABASE_ANON_KEY` (analytics and popular search). Without them the site still runs: the contact form answers that email is not configured, analytics records nothing, and search shows the latest entries instead of popular ones.

## Test it

```sh
pnpm test                   # unit tests
pnpm build                  # the browser tests need a build
pnpm test:e2e               # every page at 1440px and 375px, and every feature
pnpm test:perf              # the performance budget
```

The browser tests start `server.mjs` on port 4400 and drive the installed Google Chrome; CI installs Playwright's Chromium instead (`pnpm exec playwright install chromium`). See [testing](docs/systems/testing.md).

## Scripts

| Command | Does |
| ------- | ---- |
| `pnpm dev` | Development server |
| `pnpm build` | Checks the taxonomy, makes cover backdrops, builds to `dist/`, then writes Brotli and gzip copies of every text file |
| `pnpm preview`, `pnpm start` | Serves the build with `server.mjs` |
| `pnpm verify` | The gate: type check, design tokens, composition, logo visibility, unit tests, build, output checks, browser tests, performance budget. CI runs it |
| `pnpm check` | `astro check` |
| `pnpm check:tokens` | Fails on raw colour, Tailwind default palette classes, rounded corners, raw z-index, or text in `neutral-300`/`neutral-400`, outside the theme |
| `pnpm check:composition` | Fails when a page, feature or layout template writes a raw HTML element instead of a `@ui` component |
| `pnpm check:taxonomy` | Fails when a registered tag or technology is attached to nothing, when a tag groups fewer than 2 items or repeats a tech's name, when an item has more than 3 tags, when anything names an unregistered one or carries no tag (or, on the bio, no tag or tech), when a technology's logo is missing, or when two bio records share a slug |
| `pnpm check:assets` | Fails when a technology logo is under 50% visible on the light or the dark tile, or a badge or organisation logo is missing |
| `pnpm check:output` | Checks the built pages: the home page keeps its budget, the pretext article keeps its live cover, release-note controls keep their shape |
| `pnpm test` | Unit tests in `tests/unit/` |
| `pnpm test:e2e` | Playwright: every page and feature, desktop and mobile, and an axe accessibility scan of every page in light and dark |
| `pnpm test:perf` | Playwright: load, scroll and interaction times against the budget in `src/data/settings.ts` |
| `pnpm sync-notes` | Mirrors the apps' release notes into `src/data/apps/patch-notes/releases.ts` |
| `pnpm optimize-images` | Compresses images in `public/images` |

## Layout

```
src/pages/        routes (thin) and API endpoints
src/app/          pages, features, shared, layout, calc, api
src/data/         content and data: site.ts, settings.ts, content/, bio/, taxonomy/, apps/, contact/
lib/khp-ui/       theme and generic components (layout, type, media, surface, form, overlay)
tests/            unit, e2e and perf tests
scripts/          checks and generators
server.mjs        the production server
docs/             standards, structure, system contracts
```

## Adding content

A post is a markdown file in `src/data/content/blog/`, a project one in `src/data/content/projects/`. Roles and certifications live in `src/data/bio/experience.ts` and `certifications.ts`, each with a `slug` and tags. Tags and technologies must exist in `src/data/taxonomy/tags.ts` and `technologies.ts`, and each registered one must be attached to something; the build says what is wrong. The cover image must exist in `public/images/`, or the build fails, unless the post's engine draws a live cover. How many entries the home page and `/blogs` show is in `src/data/settings.ts`. See [content registries](docs/systems/content-registries.md).

## App release notes

Pundo and Pidada keep their release notes in their own repositories. `pnpm sync-notes` reads them (from `../budget` and `../pidada`, or the paths in `PUNDO_PATCH_NOTES` and `PIDADA_CHANGELOG`), checks them, and writes the mirror the project pages show. See [release notes](docs/systems/release-notes.md).

## License

MIT.
