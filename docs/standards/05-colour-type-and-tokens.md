# 5. Colour, type and tokens

The theme lives in [lib/khp-ui/tokens/theme.css](../../lib/khp-ui/tokens/theme.css); the system is described in [theme tokens](../systems/theme-tokens.md). `pnpm check:tokens` enforces §5.1, the corners in §5.6 and §5.7.

## At a glance

- Colours come from the theme's scales; Tailwind's default palette is cleared (§5.1).
- Every scale step has a dark value; the site is light until the reader switches (§5.2).
- Lime is the brand; neutral carries text and surfaces; status scales carry state with words (§5.3).
- Outfit, Tailwind's default type sizes (§5.4).
- Square corners; brand gradients and soft shadows are the look (§5.6).
- Motion is quick, cheap and optional: it pauses when unseen and stops under reduced motion (§5.8).
- No AI tells: no side stripes, sparkle icons, echo badges, purple glows or filler; the owner's own look is not slop (§5.9).

## 5.1 Theme colours only

Colour classes use the theme's scales: `brand-50` to `brand-900`, `neutral-0` to `neutral-950`, `success-*`, `warning-*`, `error-*`, plus `white`, `black` and `ink`. Tailwind's default palette (`gray`, `slate`, `lime` and the rest) is cleared with `--color-*: initial`, so such a class draws nothing; `pnpm check:tokens` fails on it. No hex, `rgb()` or `rgba()` outside `lib/khp-ui/tokens/`. The one exception, with its reason, is listed in `scripts/check-design-tokens.mjs`: the pretext cover's canvas, which cannot read CSS variables.

## 5.2 Light and dark

Each scale is a CSS variable. `:root` holds the light values and `:root.dark` mirrors every step, so the same classes (`bg-neutral-0`, `text-brand-600`) work in both: light text on dark stays readable without `dark:` variants. `white`, `black` and `ink` do not change; use them only for text and shades over photos and for the timeline's past strips.

Dark mode is opt-in. The site is light by default whatever the system says. `ThemeToggle` (in the top bar on desktop, inside the mobile menu on phones) saves the choice in `localStorage` under `theme`. `ThemeScript` applies it before first paint and again after each view-transition swap. A new scale step gets its dark value in the same change.

## 5.3 What colour means

| Colour | Used for |
| ------ | -------- |
| Brand (lime) | The accent word in headers (`text-brand-gradient`), the name in the top bar and footer, main buttons, the current page's link, hover text and borders, list markers, the timeline's current stop and strip, the hero photo's border |
| Neutral | Text, surfaces, borders, rails. Text uses `neutral-500` or darker: `neutral-400` and `neutral-300` fail AA contrast in both themes, so they are for borders and `aria-hidden` icons only |
| Success, warning, error | Project status, release-note categories, toasts, the required-field asterisk. Always with words |

*Why the text floor:* `Text` and `Label` had a `faint` tone in `neutral-400`, 2.5:1 on white and about 3.6:1 on the dark surface. Every "Built with", "Tagged" and project-fact label used it and was hard to read, worst in dark. The tone is gone, `pnpm check:tokens` fails on text in those two steps, and the accessibility test checks contrast on every page in both themes.
| White, black, ink | Text and shades over photos, the image viewer, the timeline's past strips |

Which lime step: a lime surface under white text is `brand-700` (the default button, the brand `StatusPill`, the featured card's corner pill, the hero's and footer's buttons to `/contact`). Small lime text is `brand-700` or darker. `bg-brand-gradient` runs `brand-700` to `brand-800`, AA at every point. Large heading accents (the hero's name, `text-brand-gradient`) keep `brand-600`. *Why:* white text on `brand-600` is about 3.1:1, below WCAG AA for normal text; on `brand-700` it is about 5:1.

## 5.4 Type

Outfit for everything (weights 300 to 700 from Google Fonts); `ui-monospace` and the system stack for code and the timeline dates. Sizes are Tailwind's defaults (`text-xs` to `text-7xl`), stepped up by breakpoint (`text-3xl sm:text-4xl md:text-5xl`). `Heading` and `Text` name the steps the site uses (`Heading` `size="card"`, `Text` `size="body"`), so titles and text of one kind match on every page (§4.9). Headings are bold. The owner's headings and buttons are in Title Case ("View All Projects"); keep them as written (§6.6). Small labels are `text-xs` or `text-[11px]`, semibold, uppercase, `tracking-wider`, in `neutral-500` (`Label`), never `neutral-400` (§4.5, §5.3).

## 5.5 Article text

Article type lives in `Prose` (`lib/khp-ui/components/type/Prose.astro`), which `src/app/features/article/Prose.astro` wraps: light weight, `text-sm` to `lg:text-lg`; `h2` with a `brand-500` rule under it, `h3` with a `brand-300` rule; square `brand-600` list markers; a `brand-200` rule beside italic quotes; inline code on `brand-100`; links as in §4.3; figures with centred captions. `enhanceTables` wraps tables to scroll on phones and gives them `brand-50` uppercase headers. `h2` and `h3` sections fold with toggles styled in `lib/khp-ui/tokens/prose.css`.

## 5.6 Shape and surface

Corners are square: the theme clears `--radius-*`, and `pnpm check:tokens` fails on any `rounded` class. The look comes from the brand utilities in `theme.css`:

- Gradients: `bg-brand-gradient` (buttons, bars, the brand card), `bg-hero-gradient` (hero bands), `bg-card-gradient` (cards), `text-brand-gradient` (accent words).
- Shadows: `shadow-elegant` (cards), `shadow-floating` (form and sidebar cards, and cards on hover), `shadow-brand` (gradient buttons), `shadow-lg` or stronger on things that float (the search panel, the Select list, toasts, floating tools, the release drawer); the Apps menu uses `shadow-elegant`. `--shadow-strength` makes shadows stronger in dark so they still show.
- Soft glow: the `PageHeader` glow on hero pages, drawn with `soft-glow`, a radial gradient. It is the only glow (§5.9). No CSS blur filter anywhere (§7.7); the home page check fails on one (§7.6).

## 5.7 Layers

Never a raw `z-<number>`. In order: `z-raised`, `z-nav`, `z-dropdown`, `z-float`, `z-drawer`, `z-modal`, `z-popover`, `z-tooltip`, `z-toast`. In CSS, `var(--z-*)`.

## 5.8 Motion

Motion is welcome when it costs little. The site should feel quick and snappy, like Ebb, so motion keeps to a budget:

- **Cheap properties only.** Transitions change colour, background, border, shadow, opacity and transform, never a property that moves layout. Anything that travels (the card lift, the cover zoom, the marquee) moves by `transform`, which the browser composites.
- **One set of timings.** `theme.css` holds `--duration-fast` (150ms), `--duration-base` (250ms), `--duration-slow` (600ms) and `--ease-out`. Links, buttons, `summary`, fields, `[role="button"]`, `[role="option"]` and `.motion-surface` ease at `--duration-fast`.
- **A few utilities.** `motion-lift` lifts a card that is a link 2px on hover. `motion-zoom` scales a cover image to 1.03 when its card is hovered. `marquee`, `marquee-track` and `marquee-reverse` make the home page's endless technology rows.
- **Paused when unseen.** The marquee pauses on hover and focus, and an `IntersectionObserver` pauses it off screen. The pretext cover's frame loop runs at 24 frames a second only while it is on screen and the tab is visible.
- **Nothing eager.** A card's live cover paints a still first and hydrates when it scrolls into view. The home page's budget is §7.6.
- **Reduced motion stops it.** Under `prefers-reduced-motion` every transition and animation ends at once, the marquee becomes a still, wrapped list showing each technology once, and the pretext cover draws one still frame.

New motion uses these tokens and utilities. The image viewer's zoom and pan are driven by its own script.

*Why:* v2 turned all animations and transitions off for performance. The owner wants the site to move and still be as fast as Ebb, so motion is allowed where it is cheap and stops when no one sees it.

## 5.9 No AI tells

"AI slop" is UI that looks generated: the defaults a code model reaches for when no one made a choice. Readers have learned to spot them, and a portfolio that shows them says the work wasn't looked at (§10). The tells below are the ones design critics and slop-detection tools cite most ([sources](#sources-for-59)). The site doesn't use them:

| Tell | Rule here | Check |
| ---- | --------- | ----- |
| A coloured or thick stripe down one side of a card or callout, the most-cited tell | No side stripe. A card is marked by its content (an open state, a date that says "Current"), not an edge. A quote's thin rule is the one exception: it is a print convention, not decoration | `pnpm check:tokens` ("side stripe") |
| Sparkle, magic-wand and rocket icons; emoji as decoration | An icon says what the thing is (a checklist for features, a bolt for challenges), or there is none | Review |
| A pill or badge that repeats what the text beside it says ("Current" beside "2024 – Current") | A label adds a fact or it goes | Review |
| Purple, indigo or blue-to-purple gradients; neon glows on dark | The palette is lime and neutral only (§5.1). The one glow is the page title's `soft-glow` (§5.6) | `pnpm check:tokens` (palette) |
| Faint grey text on dark, glassmorphism, CSS blur | Text is `neutral-500` or darker (§5.3); no blur (§7.7) | `pnpm check:tokens`, the axe test, `check:output` |
| Filler copy: "passionate", "seamless", "elevate", "unlock", "cutting-edge"; invented stats | Lines come from the data (§6.6, §10.7) | Review |
| A layout no one chose: a centred hero, then three icon-topped feature cards, then a stat banner | A section exists because it shows his work (§10) | Review |

**What is not slop here.** Some of the owner's look also appears on the slop lists: the gradient accent word, gradient cards with a soft shadow, small uppercase labels, the short bar under a heading. They stay. They are his choices from before AI tools, used in fixed places (one accent word per heading, labels only to name a group), and the site that dropped them was rejected as "ugly and generic" ([ebb-port.md](ebb-port.md)). The rule is not "avoid anything a model might make"; it is "nothing on screen is there by default". Each element has a reason someone can state.

When unsure, ask the four questions in AGENTS.md. A new element that is on the list above needs the owner's say (§6.6).

*Why:* on November 16, 2026 the owner pointed at the lime stripe down the current role's card ("too AI, it's AI slop") and asked for a standard. The stripe and the article `h4` callout bar were removed, the `AccordionItem` `accent` prop was deleted so it can't come back, the "Key features" sparkle became a checklist, the redundant "Current" pill went, and the token check now fails on a side stripe.

### Sources for §5.9

- [Impeccable, anti-patterns](https://www.mintlify.com/pbakaus/impeccable/concepts/anti-patterns) and [the visible tells of AI design](https://924b8765.impeccable-2rv.pages.dev/slop)
- [Scoring Show HN submissions for AI design patterns](https://adriankrebs.ch/blog/design-slop/)
- [How to detect AI slop in your design](https://github.com/Laith0003/ux-skill/wiki/How-to-detect-AI-slop-in-your-design)
- [7 signs a UI has been vibe coded](https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui)
- [Hallmark's catalogue of AI UI tells](https://instagit.com/Nutlope/hallmark/hallmark-anti-patterns-detected/)

## Checklist

- [ ] `pnpm check:tokens` passes; any new exception has its reason (§5.1).
- [ ] New scale steps have dark values; checked in both themes (§5.2).
- [ ] Colour used as in §5.3; status has words; no text in `neutral-300` or `neutral-400` (`pnpm check:tokens`), and every page passes axe in light and dark (`tests/e2e/accessibility.spec.ts`).
- [ ] New UI uses the lib components and brand utilities, not new one-off styles (§5.6).
- [ ] New motion uses the tokens, changes only the properties in §5.8, pauses when unseen and stops under reduced motion.
- [ ] Nothing from the §5.9 list: no side stripe, no sparkle or emoji decoration, no badge that repeats its text.
