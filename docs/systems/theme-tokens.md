# Theme tokens

Standards: KHP §5.1, §5.2, §5.3, §5.4, §5.5, §5.6, §5.7, §5.8, §3.5, §4.4, §7.7

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
  - Layers `--z-raised` to `--z-toast`, then `--z-splash` over everything.
  - Dark scales on `:root.dark`: every step mirrored (light `brand-50` becomes the darkest lime, `neutral-0` becomes near-black), `--shadow-strength: 3`.
  - `@theme`: `--color-*: initial` clears Tailwind's palette, then defines `white`, `black` and `ink` (near-black that stays dark in both themes). Outfit and the mono stack. Shadow sizes scaled by `--shadow-strength`. `--radius-*: initial`, so corners are square. A few large spacing steps.
  - `@theme inline`: maps each scale step to its class name (`bg-brand-600`, `text-neutral-700`).
  - Utilities: `z-*` layers.
  - Brand utilities: `bg-brand-gradient` (`brand-700` to `brand-800`, under white text), `bg-hero-gradient` (`neutral-0` to `brand-50`), `bg-card-gradient` (`neutral-0` to `neutral-50`), `text-brand-gradient` (`brand-600` to `brand-500`), `shadow-brand`, `shadow-elegant`, `shadow-floating`.
  - `.float-btn` and `.float-tip`: a fixed tool at the right edge under the top bar (`z-float`) and its name beside it (`z-tooltip`), shown on the button's hover and focus. `data-stack="1"` moves both to the second slot. Shared by `FloatingButton` and the collapse-all button (KHP §3.5).
  - `.drawer`: the right-hand `<dialog>` at full height, up to 34rem wide, with a `neutral-950` backdrop at 30%. Used by `Drawer`.
  - Base: border colour, body background and text, Outfit.
  - Motion tokens on `:root`: `--duration-fast` (150ms), `--ease-out`, `--ease-in-out` (the splash).
  - The mark's colours, a light and a dark value each: `--mark-ground`, `--mark-shadow`, `--mark-lit`; they match `THEMES` in `scripts/generate-brand.mjs`.
  - The splash (`Splash.astro`): `.splash`, hidden unless its own script adds `data-show`, fills the window with `--mark-ground` and fades on `data-leaving`; `.splash-mark` (half the window's short side) holds the `.splash-piece`s, moved only by `transform` in `splash-fly-in`, `splash-pop`, `splash-fly-out` and `splash-shrink`, timed by the `--splash-*` variables the component sets; `splash-cap` hides it after `--splash-max` without script.
  - Base transitions on `a`, `button`, `summary`, `input`, `textarea`, `[role="button"]`, `[role="option"]` and `.motion-surface`: colour, background, border, text decoration colour, shadow, opacity and transform, at `--duration-fast`.
  - Motion: `--duration-fast` and `--ease-out`; the base transition on controls and `.motion-surface`; `marquee`, `marquee-track` and `marquee-reverse` (KHP §5.8).
  - Reduced motion: under `prefers-reduced-motion: reduce` every animation and transition lasts 0.01ms and runs once, scrolling is not smooth, and the marquee becomes a still, wrapped, centred list with its `[data-marquee-copy]` hidden.
  - Focus: a 2px `brand-500` outline; the search input draws focus on its wrapper instead.
- `lib/khp-ui/tokens/prose.css`: only the collapsible section toggle styles (`#article-content .section-toggle`). The rest of the article type is `Prose` in `lib/khp-ui/components/type/`.
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
8. A card that is a link is a `Card` with `href`; nothing clickable sits inside it (KHP §4.4).
9. Reduced motion stops every transition and animation, and leaves the marquee as a readable list showing each technology once (KHP §5.8).
10. Durations come from the motion tokens, so the site moves at one pace.
11. No CSS blur filter and no glow (KHP §5.9, §7.7).
12. Floating tools share `.float-btn` and `.float-tip`, so the release-notes button and collapse-all look and stack the same (KHP §3.5).

## Before changing

- Check the change in light and dark, at phone and desktop width, and with reduced motion on when it moves.
- A new scale step needs a dark value and a `--color-*` line in `@theme inline`.
- Related: [Frame and navigation](frame-and-navigation.md), [Article engines](article-engines.md), [Entries](entries.md), `docs/standards/05-colour-type-and-tokens.md`.

## Checks

- `pnpm check:tokens` (`scripts/check-design-tokens.mjs`) scans `src` and `lib` for raw colour, default palette classes, `rounded` classes and raw `z-<number>`. It skips `lib/khp-ui/tokens/` and the generated `src/data/apps/patch-notes/releases.ts`.
- `pnpm check:output` (`scripts/check-home-performance.mjs`) fails when the built home page uses a CSS blur class or its marquee copy is not `inert` (KHP §7.6).
- `pnpm test:e2e` checks the theme choice survives a navigation and a reload, and that the marquee moves and pauses under the pointer ([Testing](testing.md)). `pnpm test:perf` measures scrolling every representative page.
- Contrast, dark mode's look and reduced motion are checked by eye. No automated contrast or motion test.

## Known limits

- `PretextCover.tsx` writes its canvas colours as literals (`rgb(6, 16, 9)`, `rgba(163, 230, 53, 0.9)` and others) that copy `--art-night` and the lime scale. A change to those tokens does not reach the canvas.
- The guard skips any line that starts with a comment marker, so a value on such a line is not checked. It does not check blur, gradients or type sizes.
- `ThemeToggle` watches only the `class` attribute. It stays correct because both writers set the class.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm check:tokens` passes and light and dark were looked at.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
