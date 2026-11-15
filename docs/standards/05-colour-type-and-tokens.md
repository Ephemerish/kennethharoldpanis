# 5. Colour, type and tokens

The theme lives in [lib/khp-ui/tokens/theme.css](../../lib/khp-ui/tokens/theme.css); the system is described in [theme tokens](../systems/theme-tokens.md). `pnpm check:tokens` enforces §5.1, the corners in §5.6 and §5.7.

## At a glance

- Colours come from the theme's scales; Tailwind's default palette is cleared (§5.1).
- Every scale step has a dark value; the site is light until the reader switches (§5.2).
- Lime is the brand; neutral carries text and surfaces; status scales carry state with words (§5.3).
- Outfit, Tailwind's default type sizes (§5.4).
- Square corners; brand gradients and soft shadows are the look (§5.6).
- Motion is quick, cheap and optional: it pauses when unseen and stops under reduced motion (§5.8).

## 5.1 Theme colours only

Colour classes use the theme's scales: `brand-50` to `brand-900`, `neutral-0` to `neutral-950`, `success-*`, `warning-*`, `error-*`, plus `white`, `black` and `ink`. Tailwind's default palette (`gray`, `slate`, `lime` and the rest) is cleared with `--color-*: initial`, so such a class draws nothing; `pnpm check:tokens` fails on it. No hex, `rgb()` or `rgba()` outside `lib/khp-ui/tokens/`. The one exception, with its reason, is listed in `scripts/check-design-tokens.mjs`: the pretext cover's canvas, which cannot read CSS variables.

## 5.2 Light and dark

Each scale is a CSS variable. `:root` holds the light values and `:root.dark` mirrors every step, so the same classes (`bg-neutral-0`, `text-brand-600`) work in both: light text on dark stays readable without `dark:` variants. `white`, `black` and `ink` do not change; use them only for text and shades over photos and for the timeline's past strips.

Dark mode is opt-in. The site is light by default whatever the system says. `ThemeToggle` (in the top bar on desktop, inside the mobile menu on phones) saves the choice in `localStorage` under `theme`. `ThemeScript` applies it before first paint and again after each view-transition swap. A new scale step gets its dark value in the same change.

## 5.3 What colour means

| Colour | Used for |
| ------ | -------- |
| Brand (lime) | The accent word in headers (`text-brand-gradient`), the name in the top bar and footer, main buttons, the current page's link, hover text and borders, list markers, the timeline's current stop and strip, the hero photo's border |
| Neutral | Text, surfaces, borders, rails |
| Success, warning, error | Project status, release-note categories, toasts, the required-field asterisk. Always with words |
| White, black, ink | Text and shades over photos, the image viewer, the timeline's past strips |

Which lime step: a lime surface under white text is `brand-700` (the default button, the brand `StatusPill`, the featured card's corner pill, the hero's and footer's buttons to `/contact`). Small lime text is `brand-700` or darker. `bg-brand-gradient` runs `brand-700` to `brand-800`, AA at every point. Large heading accents (the hero's name, `text-brand-gradient`) keep `brand-600`. *Why:* white text on `brand-600` is about 3.1:1, below WCAG AA for normal text; on `brand-700` it is about 5:1.

## 5.4 Type

Outfit for everything (weights 300 to 700 from Google Fonts); `ui-monospace` and the system stack for code and the timeline dates. Sizes are Tailwind's defaults (`text-xs` to `text-7xl`), stepped up by breakpoint (`text-3xl sm:text-4xl md:text-5xl`). Headings are bold. The owner's headings and buttons are in Title Case ("View All Projects"); keep them as written (§6.6). Small labels are `text-xs` or `text-[11px]`, semibold, uppercase, `tracking-wider`, in `neutral-400` or `neutral-500` (§4.5).

## 5.5 Article text

Article type lives in `src/app/features/article/Prose.astro`: light weight, `text-sm` to `lg:text-lg`; `h2` with a `brand-500` rule under it, `h3` with a `brand-300` rule; square `brand-600` list markers; a `brand-200` rule beside italic quotes; inline code on `brand-100`; links as in §4.3; figures with centred captions. `enhanceTables` wraps tables to scroll on phones and gives them `brand-50` uppercase headers. `h2` and `h3` sections fold with toggles styled in `lib/khp-ui/tokens/prose.css`.

## 5.6 Shape and surface

Corners are square: the theme clears `--radius-*`, and `pnpm check:tokens` fails on any `rounded` class. The look comes from the brand utilities in `theme.css`:

- Gradients: `bg-brand-gradient` (buttons, bars, the brand card), `bg-hero-gradient` (hero bands), `bg-card-gradient` (cards), `text-brand-gradient` (accent words).
- Shadows: `shadow-elegant` (cards), `shadow-floating` (form and sidebar cards, and cards on hover), `shadow-brand` (gradient buttons), `shadow-lg` or stronger on things that float (the search panel, the Select list, toasts, floating tools, the release drawer); the Apps menu uses `shadow-elegant`. `--shadow-strength` makes shadows stronger in dark so they still show.
- Soft blur: the `PageHeader` glow and the certification card halo. The home page uses none (`check-home-performance.mjs`, §7.6).

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

## Checklist

- [ ] `pnpm check:tokens` passes; any new exception has its reason (§5.1).
- [ ] New scale steps have dark values; checked in both themes (§5.2).
- [ ] Colour used as in §5.3; status has words.
- [ ] New UI uses the lib components and brand utilities, not new one-off styles (§5.6).
- [ ] New motion uses the tokens, changes only the properties in §5.8, pauses when unseen and stops under reduced motion.
