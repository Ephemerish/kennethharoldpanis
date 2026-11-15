# What came from Ebb and Pundo

Sources read on November 15, 2026: Ebb (`alphauslabs/ebb`, `AGENTS.md`, `lib/ebb-ui/standards/`, `docs/structure.md`, `docs/systems/`) and Pundo (`dev/budget`, `CLAUDE.md`, `STANDARDS.md`, `docs/standards/`, itself adapted from Ebb). This file records what the site took, changed, left out and rejected, so a later reader doesn't argue it again.

## Visual rules rejected

On November 15, 2026 Ebb's and Pundo's visual rules were applied to the site: flat surfaces, one border and no shadows, left-aligned headers with no accent word, no gradients or glows, sentence case with no uppercase labels, a custom type scale with a 13px floor, semantic colour tokens with three jobs, a generated brand mark, colour-only transitions, and rewritten interface copy. The owner rejected the result as "ugly and generic" and the code was restored to his original look and words.

The site keeps its own visual language, described in §3 to §5. From Ebb and Pundo it ports only engineering standards: the folder structure, the systems registry, verification, correctness and accessibility. A visual or copy rule from either project is not added here without the owner's say (§6.6).

## Taken

| From | Rule | Here |
| ---- | ---- | ---- |
| Ebb §1.0, Pundo §1 | The data is right, or it says it isn't | §1.1 |
| Ebb §1.12 | See the whole before deciding | §1.2 |
| Ebb §1.9 | A proven library before our own | §1.4 |
| Ebb §1.13, Pundo §6.7 | No loose ends | §1.5 |
| Ebb §6.12 | Motion tokens; reduced motion turns motion off | §5.8 |
| Ebb §6.1, theme-tokens | One theme file; every colour has a dark value | §5.1, §5.2 |
| Pundo CLAUDE.md | Square corners | §5.6 (the site's own corners were already square) |
| Pundo layering | One ordered z-index scale | §5.7 |
| Ebb `docs/structure.md` | routes, pages mirror URLs, features, shared, layout, calc, api, a generic UI lib | §8.1, `docs/structure.md` |
| Ebb §11, Pundo `docs/systems.md` | A registry of systems, each with "Must stay true" | `docs/systems.md` |
| Pundo `pnpm verify` | One local gate, run by CI | §9.2 |

## Changed on purpose

| Their rule | Here | Why |
| ---------- | ---- | --- |
| Ebb: phones are not a target | 375px and 1440px both checked | Visitors read on phones |
| Ebb: `routes/` folder | Astro's `src/pages/` is the routes folder | Astro routes by file location |
| Ebb: `lib/ebb-ui` with its own standards | `lib/khp-ui` with a catalogue; standards at the root as in Pundo | One small site, one standard |
| Ebb: no lint for "tokens only" | `check-design-tokens.mjs` checks raw colour, default palette classes, rounded corners and raw z-index | A fixed mistake gets the check that would have caught it (Ebb §1.0) |
| Ebb §6.12: motion tokens, reduced motion turns it off | Motion allowed under a budget: cheap properties only, paused when unseen, nothing eager on the home page (§5.8, §7.6) | The owner wants the site snappy like Ebb, and moving. v2 had turned all motion off |
| Ebb: follow the system theme | Light by default, dark only when the reader picks it | The owner's choice |

## Rejected by the owner

| Their rule | Was §  | Now |
| ---------- | ------ | --- |
| Ebb §1.16, Pundo §6.9: designed, not generated (no uppercase labels, subtitles, gradient text, divider bars, decorative pills, shadows, centred headers) | §6.9 | Removed |
| Ebb §6.2: colour has three jobs, action, status, brand | §5.3 | Rewritten to describe the owner's use of lime |
| Ebb §6.5: one family, a custom scale, a 13px floor | §5.4 | Tailwind's default sizes, the owner's small labels |
| Pundo: flat, one border level, shadows only on overlays | §5.6 | Brand gradients and soft shadows |
| Ebb: semantic colour tokens (`surface`, `foreground`, `primary`) | §5.1 | The original brand, neutral and status scales |
| Pundo: a generated brand mark and icon set | §7.4 | Removed; the original favicon and photo |
| Word budgets and copy rules | §6.7, §6.8 | The owner's words stay (§6.6) |

## Left out

FinOps, FOCUS data, allocation, charts, tables, the record sidebar, dev mode, organisation ownership, writes tables, money formatting, database backups, mobile sync and i18n. They describe Ebb's and Pundo's products, not a personal site.
