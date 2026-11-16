# AGENTS.md: kennethharoldpanis.com

For anyone changing this site, people or agents.

## Mandatory first step

Before any change, decision or answer about the site:

1. Read [STANDARDS.md](STANDARDS.md), its sections 1 and 10, then every file its "Read by task" table names for your task. When unsure, read all of `docs/standards/`.
2. Before building anything, read [docs/systems.md](docs/systems.md), the registry of what the site already has, and reuse or extend it (KHP §1.4). Before changing a system, read its file in [docs/systems/](docs/systems/), above all its "Must stay true".
3. Name things with the words in [docs/GLOSSARY.md](docs/GLOSSARY.md), in code, docs and on screen; a new term goes there in the same change (KHP §6.7). `pnpm check:copy` fails on a word the glossary replaces.
4. Put code where [docs/structure.md](docs/structure.md) says (KHP §8.1). Use components from [lib/khp-ui/AGENTS.md](lib/khp-ui/AGENTS.md) before writing markup.
5. Run `pnpm verify` (types, checks, build, then every page and feature in a browser and the performance budget) and check the change on screen in light and dark, at 375px and 1440px, before calling it done (KHP §9.2, §9.3).
6. Cite the rules you applied by number (`KHP §5.1`) when you explain a decision.

A change that breaks a standard is not done, however well it works. If a standard is wrong, change it in the same change, with the reason.

## What the site is

The personal site of Kenneth Harold Panis, software engineer. It shows his projects, his writing, where he has worked and studied, and how to reach him. It also points to his live apps (Pundo, Pidada) and mirrors their release notes. Readers are recruiters, collaborators and other engineers, on phones and desktops.

The look and the words are the owner's. The engineering standards here keep the site correct, accessible and easy to change; they do not restyle it.

## The four questions

Ask of every change you make:

1. **Does it make sense?** Can you say in one sentence what it is for and who reads it?
2. **Is it logical?** Does each fact come from one place (KHP §1.3)?
3. **Will it confuse anyone?** Would a first-time reader get it at a glance?
4. **Does it follow common norms?** Web conventions, accessibility, the patterns readers already know. Deviate only with a written reason.

## The rules in one screen

- **Makes sense, or isn't shown** (§1.7): a label or grouping must hold for every item under it; things are tech and tags, not a third vocabulary; the same kind of thing looks the same on every page; when in doubt, the least common denominator (a flat list, the data's order).
- **A portfolio first** (§10): the site shows employers, recruiters and engineers what Kenneth can do. His role and certifications are on the first screen, and every claim links to its proof.
- **The owner's words stay; filler goes** (§6.6): never rewrite his own copy. A generic line is replaced by a fact from the data, and a label never claims what the data doesn't say. A new visible element or section needs his say first.
- **Right, or it says so** (§1.1): a date, status or claim on screen is true. A form never says "sent" when it wasn't.
- **One data model** (`src/data/model.ts`): everything listed (projects, posts, roles, schools, certifications) shares `slug`, `title`, `description`, `image`, `tags`, `tech`, and dates as `startDate` / `endDate` (none while it is still going). Data holds facts, never components or styles.
- **One home per fact** (§1.3): content, data and tunables live in `src/data/`. Name, email, social links and navigation are in `src/data/site.ts`; list sizes, contact limits and the performance budget in `src/data/settings.ts`; posts and projects in `src/data/content/`. Colours only in `lib/khp-ui/tokens/theme.css`.
- **Generic unless needed** (§4.10): one component per kind of thing, the same everywhere. Projects and posts are one `EntryCard` in one `EntryGrid`; featured items come first, they don't look different. No variant or wrapper the data doesn't call for; replaced code is deleted.
- **Pages are built from components** (§4.9): templates in `src/app/pages`, `src/app/features` and `src/app/layout` compose `@ui` components and write no raw HTML. A new pattern becomes a component in `lib/khp-ui` first. `pnpm check:composition` fails on a raw element.
- **The site's visual language** (§3, §4, §5): lime brand, headings with one accent word in `text-brand-gradient`, centred section headers with a subtitle and a short gradient bar, the bordered rails column, gradient cards with `shadow-elegant`, square corners, Outfit. Build new things from the lib components so they look like the rest.
- **Words say what, never how** (§6.7): no taglines under titles; a subtitle is only a fact from the data (a count, a version); no line tells the reader how to use the page ("Open one to see…"); a label is 1 to 3 words; the glossary's word for each thing. `pnpm check:copy` enforces it.
- **Icons only with a job** (§4.8): a control, a signal (opens a new tab, a search field) or a logo. Never beside words that already say it. No bars under titles, no dividers for decoration, no glows. `pnpm check:icons` fails on an icon outside its allowed files.
- **No AI slop** (§5.9): no coloured side stripe on a card, no sparkle or emoji decoration, no badge that repeats its text, no purple glow, no filler. The owner's gradient accent word, gradient cards and labels are his look, not slop. `pnpm check:tokens` fails on a side stripe.
- **Theme colours only** (§5.1): no hex, `rgb()` or Tailwind default palette class outside `lib/khp-ui/tokens/`. `pnpm check:tokens` fails on raw colour, default palette classes, rounded corners and raw z-index.
- **Light and dark** (§5.2): every scale step has a dark value. The site is light until the reader switches; the choice is remembered.
- **Motion only with a job** (§5.8): colour feedback on controls, a tooltip fade, following a drag or zoom, and the owner's marquee and live cover. No hover lifts or zooms, no page fades, no entrance animations; `pnpm check:tokens` fails on them. Reduced motion stops it all.
- **Works in any condition** (§7.8): no script, failed images, blocked storage, an old browser, a failed request: the page still reads and every link and the contact form still work. Controls that need script are `js-only` with a `no-js-only` fallback; tests prove it.
- **A performance budget for every page** (§7.7): LCP, CLS, TBT, INP, JavaScript, HTML and scroll smoothness, with the numbers in `src/data/settings.ts`. `pnpm test:perf` measures it. `server.mjs` serves precompressed files with long caching; covers above the fold load first; no CSS blur.
- **Every tag and tech traces to real work** (§7.1): projects, posts, roles and certifications carry them, and `pnpm check:taxonomy` fails on one that nothing carries. A tech is a tool with a logo; a tag is a theme grouping 2 or more items. A role's tech comes from what he did there (his commits, for Alphaus); a school's from its curriculum.
- **Library first** (§1.4): Radix, sonner, Phosphor, nanostores before custom code.
- **Colocate** (§8.1): code lives with the page that uses it and moves up only when a second user appears.
- **No loose ends** (§1.5): what you find dead, you remove in the same change and say so. Visible things need the owner's say (§6.6).
- **Accessible** (§1.6): real buttons and links, never a link inside a link, labels above fields, visible focus, `aria-current` on the current page, AA contrast (white text on `brand-700`).

## Where to look

| For | Read |
| --- | --- |
| Rules | [STANDARDS.md](STANDARDS.md) and `docs/standards/` |
| What we call things | [docs/GLOSSARY.md](docs/GLOSSARY.md) (internal, mandatory) |
| Where code goes | [docs/structure.md](docs/structure.md) |
| Tests and what they cover | [docs/systems/testing.md](docs/systems/testing.md) |
| What exists, and what must survive a change | [docs/systems.md](docs/systems.md) |
| Components | [lib/khp-ui/AGENTS.md](lib/khp-ui/AGENTS.md) |
| Where these rules came from | [docs/standards/ebb-port.md](docs/standards/ebb-port.md) |

Do not create or amend Git commits without the owner's permission for that commit.
