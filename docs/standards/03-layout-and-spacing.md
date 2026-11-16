# 3. Layout and spacing

## At a glance

- Content sits in one centred column with a 1px rule down each side, the rails (§3.1).
- A page opens with `PageHeader`; a section with `SectionHeader`. Both are centred, with an accent word, a subtitle and a gradient bar (§3.2).
- Spacing follows the steps the lib components already use (§3.3).
- The column is `max-w-7xl`; subtitles stop at `max-w-3xl` (§3.4).
- Floating tools stack at the right edge under the top bar (§3.5).
- Phones and desktops are both targets (§3.6).

## 3.1 The rails column

Every band of a page is full width, with a `neutral-200` rule above it, and its content in a centred `max-w-7xl` column with `px-4 sm:px-6 lg:px-8` gutters. Behind the content, an absolutely placed layer draws the column's background with `border-l border-r border-neutral-200`: the rails. Bands stack so the rails run from the top bar to the footer.

`Frame` from `@ui` draws the pattern, and `PageSection` is a `Frame` with section padding: `variant="hero"` fills the rails with `bg-hero-gradient`, `variant="plain"` with `neutral-0`; `topBorder={false}` drops the rule. Use `PageSection` for any new band. The footer, home hero, article layout, 404 page and `MainLayout`'s filler under a short page use `Frame` directly. Only the top bar (`Navbar.tsx`, a React island that can't use an Astro component) draws the rails by hand; a change to `Frame`'s column is copied there.

## 3.2 Headers

- `PageHeader`: one centred `h1` built from `prefix`, `accent` and `suffix`, the accent word in `text-brand-gradient`. An optional `subtitle` under it, only a fact from the data (§6.7). No bar and no glow (§5.9). Sizes are Tailwind's (`text-4xl` up to `lg:text-7xl` at `lg`).
- `SectionHeader`: the same for an `h2` inside a page (`text-3xl` up to `md:text-5xl`), with the same optional subtitle and no bar. On a page with no `PageHeader` its first one passes `level={1}`, so the page still has one `h1`: `/bio` opens with "My Experience".
- The home hero ("Hi, I'm Kenneth", the accent name in `brand-600`) and article titles (left-aligned, plain `h1` with status badges) are their own headers.

## 3.3 Spacing

Gaps and the space above a block are named steps in `lib/khp-ui/components/layout/space.ts` (`GAP`, `SPACE_TOP`), shared by `Stack`, `Row`, `Grid`, `List` and `Form`, so a step means the same everywhere. The common ones:

| Between | Space |
| ------- | ----- |
| Bands | `PageSection`: `py-8 sm:py-12` |
| Header and content | `mb-12 sm:mb-16` (both headers) |
| Cards in a grid | `Grid`'s default gap, `2xl`: `gap-8 sm:gap-10` |
| Inside a card | `Card` padding: `sm` `p-4 sm:p-5`, `md` `p-6 sm:p-8`, `lg` `p-8 sm:p-10` |
| Label and its control | `mb-3` |

## 3.4 Widths

The column is `max-w-7xl` (80rem). Header subtitles stop at `max-w-3xl`. Article text runs the column's width inside `ArticleLayout`. The resume card is `max-w-3xl`.

## 3.5 Floating tools

A tool that belongs to the page but must stay in reach is a fixed square at the right edge under the top bar, with a dark label beside it on hover and focus: `FloatingButton` from `@ui`, styled by `.float-btn` and `.float-tip` in `theme.css`. It has two slots: `stack={0}` at `top: 5rem`, and `stack={1}` at `8.5rem` (`8.75rem` from `sm`). The release-notes trigger takes the first. The "Hide All Sections" button, built in script with the same classes, takes the first, or the second when a release-notes trigger is on the page. No more than two.

## 3.6 Phone and desktop

Every page is checked at 375px and 1440px. Nothing scrolls sideways at 375px; wide tables scroll inside their own wrapper, and the home technology marquee is clipped inside its own row. Grids go 1, 2, then 3 columns.

## Checklist

- [ ] New bands use `PageSection`; the top bar's hand-drawn rails match `Frame` (§3.1).
- [ ] Headers come from `PageHeader` and `SectionHeader` (§3.2).
- [ ] Spacing uses the named steps in `space.ts` (§3.3).
- [ ] Checked at 375px with no sideways scroll, and at 1440px (§3.6).
