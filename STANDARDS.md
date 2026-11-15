# Site standard

|        |                                                      |
| ------ | ---------------------------------------------------- |
| Owner  | Kenneth Harold Panis                                 |
| Prefix | `KHP`                                                |
| Status | v3, November 15, 2026                                |

People and agents read [AGENTS.md](AGENTS.md), then this index and the topic files for their task, before changing the site. Check each file's checklist before reporting a change as done. A known violation is fixed, or recorded as a gap in the system's document. Explicit instructions from the owner come first.

The site keeps the owner's visual style and his words. These standards describe that style so new work matches it, and hold the engineering rules (structure, systems, verification, correctness, accessibility) that keep it working. v2 removed the visual rules taken from Ebb and Pundo, which the owner rejected; see [ebb-port.md](docs/standards/ebb-port.md). v3 allows motion under a performance budget (§5.8, §7.6), extends the taxonomy to roles and certifications (§7.1), replaces filler with facts (§6.6), and adds the portfolio standard (§10).

## Files

| Section | File | Decides |
| ------- | ---- | ------- |
| 1 | [Principles](docs/standards/01-principles.md) | Correctness, one home per fact, reuse, loose ends, accessibility |
| 2 | [Pages and navigation](docs/standards/02-pages-and-navigation.md) | What is a page, URLs, the top bar and footer, ways on |
| 3 | [Layout and spacing](docs/standards/03-layout-and-spacing.md) | The rails column, headers, spacing, widths, floating tools, screen sizes |
| 4 | [Components and controls](docs/standards/04-components-and-controls.md) | Labels, buttons, links, cards, chips and pills, fields, paging, icons |
| 5 | [Colour, type and tokens](docs/standards/05-colour-type-and-tokens.md) | The theme scales, dark mode, what colour means, type, shape, layers, motion |
| 6 | [States, feedback and writing](docs/standards/06-states-feedback-and-writing.md) | Loading, errors, empty states, toasts, dates, the owner's words, no filler |
| 7 | [Content, metadata and assets](docs/standards/07-content-metadata-and-assets.md) | The taxonomy, head tags, sitemap, images, the home page's performance budget |
| 8 | [Code and structure](docs/standards/08-code-and-structure.md) | Folders, file size, imports, islands, endpoints, comments |
| 9 | [Workflow and done](docs/standards/09-workflow-and-done.md) | Before a change, verification, visual review, changing a rule |
| 10 | [Portfolio](docs/standards/10-portfolio.md) | Who he is on the first screen, proof for every claim, real work behind every tag and technology, the site as a work sample |

## Read by task

Read **1** and **10** always. Then:

| Task | Sections |
| ---- | -------- |
| Change a page or a component | 2, 3, 4, 5, 6, 9; the system in [docs/systems.md](docs/systems.md) |
| Change colours, type or the theme | 5, 9; [theme tokens](docs/systems/theme-tokens.md) |
| Add a project or a post | 6.5, 6.6, 7.1, 7.5; [content registries](docs/systems/content-registries.md) |
| Add a role, certification, tag or technology | 6.6, 7.1; [content registries](docs/systems/content-registries.md) |
| Add or change motion | 5.8, 7.6; [theme tokens](docs/systems/theme-tokens.md) |
| Add a route or move code | 2, 7.2, 7.3, 8; [docs/structure.md](docs/structure.md) |
| Change an API endpoint | 1, 8.5, 9 |
| Change scripts or dependencies | 1.4, 8, 9 |
| Change these standards | 9.5 |

## Rule numbers

Cite rules as `KHP §3.1`. Numbers stay stable. A new rule takes the next free number; a removed rule leaves a line saying why.

## Deciding a case

Follow the rule. If no rule decides it, prefer, in order: correct, the way the site already does it, clear to a first-time reader, accessible, simple. Ask the owner when the answer changes what a reader sees.

## Sources

The engineering rules are adapted from the owner's other projects: Ebb (`alphauslabs/ebb`, `lib/ebb-ui/standards/`) and Pundo (`dev/budget`, `STANDARDS.md` and `docs/standards/`, itself a port of Ebb). [What came from where](docs/standards/ebb-port.md) records what was copied, changed, left out and rejected.
