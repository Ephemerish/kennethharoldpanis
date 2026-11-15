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

`PageSection` from `@ui` draws a band: `variant="hero"` fills the rails with `bg-hero-gradient`, `variant="plain"` with `neutral-0`; `topBorder={false}` drops the rule. Use it for any new band. The top bar, footer, home hero, article layout, 404 page and `MainLayout`'s filler under a short page draw the same pattern by hand; a change to the pattern changes all of them together.

## 3.2 Headers

- `PageHeader`: one centred `h1` built from `prefix`, `accent` and `suffix`, the accent word in `text-brand-gradient`. An optional `subtitle` under it, then a short `bg-brand-gradient` bar (`w-32` at `size="lg"`, `w-24` at `md`). `glow` adds the soft brand blur behind it on hero pages. Sizes are Tailwind's (`text-4xl` up to `lg:text-7xl` at `lg`).
- `SectionHeader`: the same for an `h2` inside a page (`text-3xl` up to `md:text-5xl`), with a subtitle and a `w-24` bar.
- The home hero ("Hi, I'm Kenneth", the accent name in `brand-600`) and article titles (left-aligned, plain `h1` with status badges) are their own headers.

## 3.3 Spacing

| Between | Space |
| ------- | ----- |
| Bands | `PageSection`: `py-8 sm:py-12` |
| Header and content | `mb-12 sm:mb-16` (both headers) |
| A featured card and the grid under it | `mb-12 sm:mb-16` |
| Cards in a grid | `gap-8 sm:gap-10` |
| Inside a card | `Card` padding: `sm` `p-4 sm:p-5`, `md` `p-6 sm:p-8`, `lg` `p-8 sm:p-10` |
| Label and its control | `mb-3` |

## 3.4 Widths

The column is `max-w-7xl` (80rem). Header subtitles stop at `max-w-3xl`. Article text runs the column's width inside `ArticleLayout`. The resume card is `max-w-3xl`.

## 3.5 Floating tools

A tool that belongs to the page but must stay in reach is a fixed square at the right edge under the top bar, with a dark label beside it on hover and focus. The release-notes trigger sits at `top: 5rem`; the "Hide All Sections" button sits at `top-20`, or at `8.5rem` (`8.75rem` from `sm`) when a release-notes trigger is on the page. No more than two.

## 3.6 Phone and desktop

Every page is checked at 375px and 1440px. Nothing scrolls sideways at 375px; wide tables scroll inside their own wrapper, and the home technology marquee is clipped inside its own row. Grids go 1, 2, then 3 columns.

## Checklist

- [ ] New bands use `PageSection`; hand-drawn rails match it (§3.1).
- [ ] Headers come from `PageHeader` and `SectionHeader` (§3.2).
- [ ] Spacing uses the steps in §3.3.
- [ ] Checked at 375px with no sideways scroll, and at 1440px (§3.6).
