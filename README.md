# kennethharoldpanis.com

The personal site of Kenneth Harold Panis: projects, writing, experience and contact. Built with Astro 5, React islands, Tailwind CSS v4 and TypeScript, served by the Node adapter on Cloud Run.

Contributors and agents start with [AGENTS.md](AGENTS.md), then [STANDARDS.md](STANDARDS.md). [docs/structure.md](docs/structure.md) says where code goes, [docs/systems.md](docs/systems.md) lists what the site already has, and [lib/khp-ui/AGENTS.md](lib/khp-ui/AGENTS.md) is the component catalogue.

## Run it

```sh
pnpm install
pnpm dev            # http://localhost:3000 (port set in astro.config.mjs)
```

Set these in `.env` for the optional services: `RESEND_API_KEY` (contact form), `SUPABASE_URL` and `SUPABASE_ANON_KEY` (analytics and popular search). Without them the site still runs: the contact form answers that email is not configured, analytics records nothing, and search shows the latest entries instead of popular ones.

## Scripts

| Command | Does |
| ------- | ---- |
| `pnpm dev` | Development server |
| `pnpm build` | Checks the taxonomy, makes cover backdrops, builds to `dist/` |
| `pnpm verify` | The gate: type check, design tokens, tests, build, output checks. CI runs it |
| `pnpm check` | `astro check` |
| `pnpm check:tokens` | Fails on raw colour, Tailwind default palette classes, rounded corners or raw z-index outside the theme |
| `pnpm check:taxonomy` | Fails when a registered tag or technology is attached to nothing, when anything names an unregistered one or has no tag, when a technology's logo is missing, or when two bio records share a slug |
| `pnpm check:output` | Checks the built pages: the home page keeps its performance budget, the pretext article keeps its live cover, release-note controls keep their shape |
| `pnpm test` | Unit tests |
| `pnpm sync-notes` | Mirrors the apps' release notes into `src/app/data/patch-notes/releases.ts` |
| `pnpm optimize-images` | Compresses images in `public/images` |

## Layout

```
src/pages/        routes (thin) and API endpoints
src/app/          pages, features, shared, layout, calc, api, data
src/content/      blog posts and projects
lib/khp-ui/       theme and generic components
scripts/          checks and generators
docs/             standards, structure, system contracts
```

## Adding content

A post is a markdown file in `src/content/blog/`, a project one in `src/content/projects/`. Roles and certifications live in `src/app/data/experience.ts` and `certifications.ts`, each with a `slug` and tags. Tags and technologies must exist in `src/app/data/tags.ts` and `technologies.ts`, and each registered one must be attached to something; the build says what is wrong. The cover image must exist in `public/images/`, or the build fails, unless the post's engine draws a live cover. See [content registries](docs/systems/content-registries.md).

## App release notes

Pundo and Pidada keep their release notes in their own repositories. `pnpm sync-notes` reads them (from `../budget` and `../pidada`, or the paths in `PUNDO_PATCH_NOTES` and `PIDADA_CHANGELOG`), checks them, and writes the mirror the project pages show. See [release notes](docs/systems/release-notes.md).

## License

MIT.
