# Theme tokens

Standards: KHP §5.1, §5.2, §5.3, §5.4, §5.5, §5.6, §5.7, §5.8, §4.4

## Purpose

One file holds the site's colours for light and dark, its brand gradients and
shadows, square corners, layers, and its motion: timing tokens, base
transitions, a few motion utilities and the reduced-motion switch.
Every page, lib component and feature draws from it through Tailwind class
names or `var(--…)`. Component shapes belong to the lib components
([lib/khp-ui/AGENTS.md](../../lib/khp-ui/AGENTS.md)); article type belongs to
[Article engines](article-engines.md).

## Implementation

- `lib/khp-ui/tokens/theme.css`: imported once, by `src/app/layout/MainLayout.astro`. Imports Tailwind and `prose.css`.
  - Light scales on `:root`: `--brand-50` to `--brand-900` (lime), `--neutral-0` to `--neutral-950`, `--error-*`, `--warning-*`, `--success-*`, all as `rgb()`. Also `--brand-glow` (the brand shadow tint) and `--shadow-strength` (1).
  - Art tokens: `--art-night`, `--art-forest`, `--art-strip-1..3`, `--art-glow`. The pretext still cover's picture, the same in both themes.
  - Layers `--z-raised` to `--z-toast`.
  - Dark scales on `:root.dark`: every step mirrored (light `brand-50` becomes the darkest lime, `neutral-0` becomes near-black), `--shadow-strength: 3`.
  - `@theme`: `--color-*: initial` clears Tailwind's palette, then defines `white`, `black` and `ink` (near-black that stays dark in both themes). Outfit and the mono stack. Shadow sizes scaled by `--shadow-strength`. `--radius-*: initial`, so corners are square. A few large spacing steps.
  - `@theme inline`: maps each scale step to its class name (`bg-brand-600`, `text-neutral-700`).
  - Utilities: `z-*` layers and `stretched-link`.
  - Brand utilities: `bg-brand-gradient` (`brand-600` to `brand-700`, under white text), `bg-hero-gradient`, `bg-card-gradient`, `text-brand-gradient` (`brand-600` to `brand-500`), `shadow-brand`, `shadow-elegant`, `shadow-floating`.
  - Base: border colour, body background and text, Outfit.
  - Motion tokens on `:root`: `--duration-fast` (150ms), `--duration-base` (250ms), `--duration-slow` (600ms), `--ease-out`.
  - Base transitions on `a`, `button`, `summary`, `input`, `textarea`, `[role="button"]`, `[role="option"]` and `.motion-surface`: colour, background, border, text decoration colour, shadow, opacity and transform, at `--duration-fast`.
  - Motion utilities: `motion-lift` (lifts 2px on hover, eased at `--duration-base`), `motion-zoom` (scales to 1.03 when its `.group` is hovered, at `--duration-slow`), `marquee` (clips the row and fades its edges with a mask), `marquee-track` (runs `@keyframes marquee`, a `translate3d` to -50%, over `--marquee-duration`, 60s by default; paused while its `.marquee` is hovered or holds focus), `marquee-reverse`.
  - Reduced motion: under `prefers-reduced-motion: reduce` every animation and transition lasts 0.01ms and runs once, scrolling is not smooth, and the marquee becomes a still, wrapped, centred list with its `[data-marquee-copy]` hidden.
  - Focus: a 2px `brand-500` outline; the search input draws focus on its wrapper instead.
- `lib/khp-ui/tokens/prose.css`: only the collapsible section toggle styles (`#article-content .section-toggle`).
- `lib/khp-ui/utils/cn.ts`: `clsx` plus `tailwind-merge`.
- `src/app/layout/ThemeScript.astro`: inline script in the head. Adds `.dark` to `<html>` only when `localStorage.theme` is `"dark"`, before first paint, and again on `astro:after-swap`. A `window.__khpTheme` guard adds the listener once.
- `src/app/layout/ThemeToggle.tsx`: flips `.dark` and saves `"dark"` or `"light"` to `localStorage.theme`. Icon-only with an `aria-label` in the top bar; with a visible label in the mobile menu.
- `scripts/check-design-tokens.mjs`: the guard, run by `pnpm check:tokens`.

## Must stay true

1. No raw colour (hex, `rgb()`, `rgba()`), Tailwind default palette class, rounded corner or raw z-index outside `lib/khp-ui/tokens/` (KHP §5.1, §5.6, §5.7). A value written elsewhere ignores dark mode.
2. The only raw-colour exception is `RAW_COLOUR_OK` in the guard: `PretextCover.tsx`, because a canvas cannot read CSS variables.
3. Every scale step defined for light has a dark value (KHP §5.2). A missing one keeps the light value in dark.
4. `white`, `black` and `ink` are for text and shades over photos, the image viewer and the timeline's past strips. They do not change with the theme.
5. The site is light until the reader picks dark. The saved choice is applied before first paint and after every view-transition swap, so a dark reader never sees a light flash.
6. Motion changes only colour, background, border, shadow, opacity and transform, and what travels moves by `transform` (KHP §5.8). A transition on a layout property would make the page lay out again on every hover.
7. Layers are used by name, lowest to highest: raised, nav, dropdown, float, drawer, modal, popover, tooltip, toast.
8. `stretched-link` is how a grid card becomes one link without nesting links (KHP §4.4).
9. Reduced motion stops every transition and animation, and leaves the marquee as a readable list showing each technology once (KHP §5.8).
10. Durations come from the motion tokens, so the site moves at one pace.

## Before changing

- Check the change in light and dark, at phone and desktop width, and with reduced motion on when it moves.
- A new scale step needs a dark value and a `--color-*` line in `@theme inline`.
- Related: [Frame and navigation](frame-and-navigation.md), [Article engines](article-engines.md), [Entries](entries.md), `docs/standards/05-colour-type-and-tokens.md`.

## Checks

- `pnpm check:tokens` (`scripts/check-design-tokens.mjs`) scans `src` and `lib` for raw colour, default palette classes, `rounded` classes and raw `z-<number>`. It skips `lib/khp-ui/tokens/` and the generated `releases.ts`.
- `pnpm check:output` (`scripts/check-home-performance.mjs`) fails when the built home page uses a CSS blur class or its marquee copy is not `inert` (KHP §7.6).
- Contrast, dark mode and reduced motion are checked by eye. No automated contrast or motion test.

## Known limits

- `PretextCover.tsx` writes its canvas colours as literals (`rgb(6, 16, 9)`, `rgba(163, 230, 53, 0.9)` and others) that copy `--art-night` and the lime scale. A change to those tokens does not reach the canvas.
- The guard skips any line that starts with a comment marker, so a value on such a line is not checked. It does not check blur, gradients or type sizes.
- `ThemeToggle` watches only the `class` attribute. It stays correct because both writers set the class.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm check:tokens` passes and light and dark were looked at.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
