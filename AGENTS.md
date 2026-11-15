# AGENTS.md: kennethharoldpanis.com

For anyone changing this site, people or agents.

## Mandatory first step

Before any change, decision or answer about the site:

1. Read [STANDARDS.md](STANDARDS.md), its sections 1 and 10, then every file its "Read by task" table names for your task. When unsure, read all of `docs/standards/`.
2. Before building anything, read [docs/systems.md](docs/systems.md), the registry of what the site already has, and reuse or extend it (KHP §1.4). Before changing a system, read its file in [docs/systems/](docs/systems/), above all its "Must stay true".
3. Put code where [docs/structure.md](docs/structure.md) says (KHP §8.1). Use components from [lib/khp-ui/AGENTS.md](lib/khp-ui/AGENTS.md) before writing markup.
4. Run `pnpm verify` and check the change on screen in light and dark, at 375px and 1440px, before calling it done (KHP §9.2, §9.3).
5. Cite the rules you applied by number (`KHP §5.1`) when you explain a decision.

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

- **A portfolio first** (§10): the site shows employers, recruiters and engineers what Kenneth can do. His role and certifications are on the first screen, and every claim links to its proof.
- **The owner's words stay; filler goes** (§6.6): never rewrite his own copy. A generic line is replaced by a fact from the data, and a label never claims what the data doesn't say. A new visible element or section needs his say first.
- **Right, or it says so** (§1.1): a date, status or claim on screen is true. A form never says "sent" when it wasn't.
- **One home per fact** (§1.3): name, email, social links and navigation live in `src/app/shared/site.ts`; colours only in `lib/khp-ui/tokens/theme.css`.
- **The site's visual language** (§3, §4, §5): lime brand, headings with one accent word in `text-brand-gradient`, centred section headers with a subtitle and a short gradient bar, the bordered rails column, gradient cards with `shadow-elegant`, square corners, Outfit. Build new things from the lib components so they look like the rest.
- **Theme colours only** (§5.1): no hex, `rgb()` or Tailwind default palette class outside `lib/khp-ui/tokens/`. `pnpm check:tokens` fails on raw colour, default palette classes, rounded corners and raw z-index.
- **Light and dark** (§5.2): every scale step has a dark value. The site is light until the reader switches; the choice is remembered.
- **Motion on a budget** (§5.8, §7.6): snappy like Ebb. Transitions change only colour, background, border, shadow, opacity and transform, using the motion tokens. Motion pauses when unseen, nothing hydrates eagerly on the home page, and reduced motion stops it all.
- **Every tag and technology traces to real work** (§7.1): projects, posts, roles and certifications carry them, and `pnpm check:taxonomy` fails on one that nothing carries.
- **Library first** (§1.4): Radix, sonner, Phosphor, nanostores before custom code.
- **Colocate** (§8.1): code lives with the page that uses it and moves up only when a second user appears.
- **No loose ends** (§1.5): what you find dead, you remove in the same change and say so. Visible things need the owner's say (§6.6).
- **Accessible** (§1.6): real buttons and links, never a link inside a link, labels above fields, visible focus, `aria-current` on the current page, AA contrast (white text on `brand-700`).

## Where to look

| For | Read |
| --- | --- |
| Rules | [STANDARDS.md](STANDARDS.md) and `docs/standards/` |
| Where code goes | [docs/structure.md](docs/structure.md) |
| What exists, and what must survive a change | [docs/systems.md](docs/systems.md) |
| Components | [lib/khp-ui/AGENTS.md](lib/khp-ui/AGENTS.md) |
| Where these rules came from | [docs/standards/ebb-port.md](docs/standards/ebb-port.md) |

Do not create or amend Git commits without the owner's permission for that commit.
