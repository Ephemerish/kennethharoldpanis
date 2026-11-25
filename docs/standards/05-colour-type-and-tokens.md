# 5. Colour, type and tokens

The theme lives in [lib/khp-ui/tokens/theme.css](../../lib/khp-ui/tokens/theme.css); the system is described in [theme tokens](../systems/theme-tokens.md). `pnpm check:tokens` enforces §5.1, the corners in §5.6 and §5.7.

## At a glance

- Colours come from the theme's scales; Tailwind's default palette is cleared (§5.1).
- Every scale step has a dark value; the site is light until the reader switches (§5.2).
- Lime is the brand; neutral carries text and surfaces; status scales carry state with words (§5.3).
- Outfit, Tailwind's default type sizes (§5.4).
- Square corners; brand gradients and soft shadows are the look (§5.6).
- Motion only with a job: answering the pointer, showing what appeared, following the hand, or the owner's marquee and live cover (§5.8).
- No AI tells, Ebb's list with this site's line on each: no side stripes, sparkle icons, echo badges, how-to lines, purple glows or filler; the owner's own look is not slop (§5.9).

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

Outfit for everything, one variable file served by the site from `/fonts` (`font-display: optional`, preloaded, cached a year; no Google Fonts), falling back to the system font; `ui-monospace` and the system stack for code and the timeline dates. Sizes are Tailwind's defaults (`text-xs` to `text-7xl`), stepped up by breakpoint (`text-3xl sm:text-4xl md:text-5xl`). `Heading` and `Text` name the steps the site uses (`Heading` `size="card"`, `Text` `size="body"`), so titles and text of one kind match on every page (§4.9). Headings are bold. The owner's headings and buttons are in Title Case ("View All Projects"); keep them as written (§6.6). Small labels are `text-xs` or `text-[11px]`, semibold, uppercase, `tracking-wider`, in `neutral-500` (`Label`), never `neutral-400` (§4.5, §5.3).

## 5.5 Article text

Article type lives in `Prose` (`lib/khp-ui/components/type/Prose.astro`), which `src/app/features/article/Prose.astro` wraps: light weight, `text-sm` to `lg:text-lg`; `h2` with a `brand-500` rule under it, `h3` with a `brand-300` rule; square `brand-600` list markers; a `brand-200` rule beside italic quotes; inline code on `brand-100`; links as in §4.3; figures with centred captions. `enhanceTables` wraps tables to scroll on phones and gives them `brand-50` uppercase headers. `h2` and `h3` sections fold with toggles styled in `lib/khp-ui/tokens/prose.css`.

## 5.6 Shape and surface

Corners are square: the theme clears `--radius-*`, and `pnpm check:tokens` fails on any `rounded` class. The look comes from the brand utilities in `theme.css`:

- Gradients: `bg-brand-gradient` (buttons, bars, the brand card), `bg-hero-gradient` (hero bands), `bg-card-gradient` (cards), `text-brand-gradient` (accent words).
- Shadows: `shadow-elegant` (cards), `shadow-floating` (form and sidebar cards, and cards on hover), `shadow-brand` (gradient buttons), `shadow-lg` or stronger on things that float (the search panel, the Select list, toasts, floating tools, the release drawer); the Apps menu uses `shadow-elegant`. `--shadow-strength` makes shadows stronger in dark so they still show.

## 5.7 Layers

Never a raw `z-<number>`. In order: `z-raised`, `z-nav`, `z-dropdown`, `z-float`, `z-drawer`, `z-modal`, `z-popover`, `z-tooltip`, `z-toast`, `z-splash`. In CSS, `var(--z-*)`.

## 5.8 Motion, only with a job

Every animation and transition on the site has one of these jobs, or it doesn't exist:

| Job | What moves | How |
| --- | ---------- | --- |
| Answer the pointer | A link, button, field or card changes colour, border or shadow on hover and focus | `--duration-fast` (150ms), set once in `theme.css` for `a`, `button`, `summary`, fields, `[role="button"]`, `[role="option"]` and `.motion-surface` |
| Show what appeared | A tooltip fades in | `--duration-fast` opacity |
| Follow the hand | The marquee follows a drag; the image viewer follows a zoom or pan | Moved directly by the pointer |
| The owner's motion | The technology marquee drifts; the pretext post's cover draws live; the splash greets each load of the site | `marquee` utilities; the pretext engine; `Splash` |

Not allowed, because it has no job: cards lifting on hover, images zooming on hover, page cross-fades on navigation, things fading or sliding in as they scroll into view, bouncing, pulsing, parallax, entrance animations, a transition on `all`, any duration other than the token. `pnpm check:tokens` fails on `animate-*`, `transition-all`, a raw `duration-*`, and a scale or translate on hover or focus ("decorative motion").

Rules for the motion that stays:

- **Cheap properties only.** Colour, background, border, shadow, opacity and transform; never a property that moves layout. The marquee moves by `transform`.
- **Paused when unseen.** The marquee pauses on hover, focus and drag, and an `IntersectionObserver` pauses it off screen. The pretext cover runs at 24 frames a second only while it is on screen and the tab is visible.
- **Nothing eager.** A card's live cover paints a still first and hydrates when it scrolls into view (§7.6).
- **Reduced motion stops it.** Under `prefers-reduced-motion` every transition and animation ends at once, the marquee becomes a still, wrapped list, the pretext cover draws one still frame, and the splash never shows.
- **The splash, each load.** `Splash` (`lib/khp-ui/components/overlay/`) covers the window in the mark's green (`--mark-ground`) each time the site loads, a reload included. Moving between pages is a view-transition swap, not a load, so it never shows there. It needs script and never shows under reduced motion or Data Saver (KHP §7.8). The mark's seven pieces, small inline SVGs filled by `--mark-lit` and `--mark-shadow`, fly in from past the window's edges and settle into the ring (`--ease-out`), the full moon popping in last; once the page has loaded and the mark is together, they fly back out (`--ease-in-out`) while the green fades, so the page opens through the motion. Only `transform` and `opacity` move, on the compositor; no player, no request, no bundle (§7.7). A CSS-only cap (`splash-cap`) hides it after 4.5 seconds even if its script never gets there. Pieces and timing are written by `scripts/generate-brand.mjs` into `src/app/layout/brand/splash.json`, which also writes the same motion as Lottie (`orbit.json`) for the app family.

*Why the splash:* on November 24, 2026 the owner chose the moon-phase mark ("Six", in moss) and asked for a splash screen animated with Lottie, like his other apps, easing in and out like the loader on sproutmarkup.com/p/patricia. Seeing the first version, he asked for it on every load ("it does it even when you refresh"), over the whole window in the mark's green with no tile behind the moons, bigger, and with a seamless transition into the page. Then he asked for it to be as cheap as possible on every device: the Lottie player was replaced by CSS on the compositor.

*Why:* on November 16, 2026 the owner asked to cut animation and transitions to the ones needed. Removed: `motion-lift` (cards rising 2px on hover), `motion-zoom` (covers scaling on hover), the view-transition cross-fade between pages (`transition:animate="none"` on `<html>`), the `--duration-base` and `--duration-slow` tokens, and `opacity` and `transform` from the base transition. v2 had turned all motion off; v3 allowed it on a budget; this keeps only motion with a job.

## 5.9 No AI tells

"AI slop" is UI that looks generated: the defaults a code model reaches for when no one made a choice. Readers have learned to spot them, and a portfolio that shows them says the work wasn't looked at (§10). This table ports Ebb's list of giveaways (Ebb §1.16.3, itself from the common slop checklists, [sources](#sources-for-59)) and gives this site's line on each. Where the owner's look already answers a row, his look wins ([ebb-port.md](ebb-port.md)).

| Giveaway | This site's line | Check |
| -------- | ---------------- | ----- |
| A coloured or thick stripe down one side of a card or callout, the most-cited tell | None. An item that matters now says so in its content ("2024 – Current", open by default). A quote's thin rule is the one exception, a print convention | `pnpm check:tokens` ("side stripe") |
| Pills everywhere; a badge that repeats the text beside it | A chip is a tag, a technology, a status or a fact (a focus area, a version); never decoration, never a repeat ("Current" beside "2024 – Current") | Review |
| A tagline under every title; a line telling the reader how to use the page | §6.7: no taglines, a title stands alone; only a fact from the data goes under it; a line says what, never how | `pnpm check:copy` |
| Verbose, redundant text; filler words | The budgets and words of §6.7 | `pnpm check:copy` |
| Icons beside words that already say it (a calendar before a date, an arrow after "View all", an icon in a coloured square beside "Email"); sparkle, rocket and wand icons; emoji | An icon is a control, a signal or a logo (§4.8); no emoji | `pnpm check:icons`, `pnpm check:copy` |
| Bars and rules as decoration: a short bar under every title, a divider under a card heading, a rule above "Read more" | Space separates things. A rule only between table rows and the parts of a panel. No title bar | Review |
| A "Read more →" line on a card that is already a link | The whole card is the link; no action line (§4.10) | Review |
| A glow behind a title | None | Review |
| Purple, indigo or blue-to-purple gradients; neon glows | Lime and neutral only (§5.1); no glows | `pnpm check:tokens` |
| Faint grey text, glassmorphism, blur | Text `neutral-500` or darker (§5.3); no blur (§7.7) | `pnpm check:tokens`, axe, `check:output` |
| Many shades and opacities of one colour | The theme's steps only; opacity for overlays on photos and "off" states | `pnpm check:tokens` |
| Monospace for names people read | Monospace for code and the timeline's years (his choice), never a name | Review |
| Labels strung with bullets ("a · b · c") | At most one middle dot, joining two short facts in a secondary row (§6.7) | Review |
| Full stops in titles; ALL CAPS sentences | No full stop after a title, label or button (§6.7). Uppercase only on the small `Label` style, his choice | `pnpm check:copy` |
| A layout no one chose: centred hero, three icon-topped feature cards, a stat banner | A section exists because it shows his work (§10) | Review |
| Sub-groups and labels that don't hold for every item ("Data" over three AWS services on a card where everything is cloud) | Tech and tags only; a flat row of chips; the least common denominator (§1.7) | Review |

**His look is not slop.** Some of it is on the slop lists: the gradient accent word, gradient cards with a soft shadow, small uppercase labels, centred headers. They stay, without the bar, the tagline (§6.7) or the glow, which he asked to remove. They stay. They are his choices, used in fixed places (one accent word per heading, labels only to name a group), and the site that dropped them was rejected as "ugly and generic". The rule is not "avoid anything a model might make"; it is "nothing on screen is there by default".

A new element on this list needs the owner's say (§6.6).

*Why:* on November 16, 2026 the owner pointed at the lime stripe down the current role's card ("too AI, it's AI slop"), then at "Open one to see the tech I used there", and asked for a standard copied from Ebb and Pundo and enforced. The stripe and the article `h4` callout bar were removed, `AccordionItem`'s `accent` prop was deleted, the "Key features" sparkle became a checklist, the redundant "Current" pill went, the how-to subtitles went, the tech categories on cards went (§1.7), and `check:tokens` and `check:copy` now fail on what they could catch. Later the same day he asked for the "stupid icons", "the bars" and "the unnecessary bullshit" to go: the decorative icons (`IconText`, `IconBadge`, panel and button icons, search type icons), the bar under every title (`Divider`), the glow behind page titles, and the card's "View project →" line and its rule were removed, and `check:icons` was added.

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
- [ ] New motion has one of the jobs in §5.8, uses the token, pauses when unseen and stops under reduced motion; `pnpm check:tokens` passes.
- [ ] Nothing from the §5.9 list: no side stripe, no sparkle or emoji decoration, no badge that repeats its text.
