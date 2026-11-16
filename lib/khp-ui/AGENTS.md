# khp-ui

The site's theme and the components every page is built from. Nothing here knows about projects, posts, tags or the site's words (KHP §8.1). Pages, features and layouts compose these components and write no raw HTML of their own (KHP §4.9, `pnpm check:composition`). Raw HTML lives here, so one change to a component changes it everywhere.

Import from `@ui` in Astro. React islands import `@ui/components/<group>/<Name>` (for example `@ui/components/form/Select`), because the barrel also exports `.astro` files, which islands can't load.

Before writing markup, check this list. If a component is close but not right, extend it here rather than building a second one beside it (KHP §1.3). New work uses these so it looks like the rest of the site (KHP §3, §4).

## Tokens

| File | Holds |
| ---- | ----- |
| `tokens/theme.css` | The brand, neutral, success, warning and error scales for light and their mirrored dark values (`:root.dark`); `white`, `black`, `ink`; Outfit; shadows; square corners; layers; the brand utilities (`bg-brand-gradient`, `bg-hero-gradient`, `bg-card-gradient`, `text-brand-gradient`, `shadow-elegant`, `shadow-floating`, `shadow-brand`); `soft-glow` (the page title's halo, a radial gradient, not a CSS blur); `stretched-link`; `.float-btn` and `.float-tip` (a floating tool and its name, in two slots by `data-stack`); `.drawer` (the right-hand drawer and its backdrop); motion (KHP §5.8): the tokens `--duration-fast`, `--duration-base`, `--duration-slow` and `--ease-out`, the base transitions on links, buttons, fields and `.motion-surface`, the utilities `motion-lift`, `motion-zoom`, `marquee`, `marquee-track` and `marquee-reverse`, and the reduced-motion switch that stops them |
| `tokens/prose.css` | Only the collapsible section toggle styles. Article type lives in `components/type/Prose.astro` |

## Components

Props are typed. Most extend Astro's `HTMLAttributes<...>`, so plain attributes (`id`, `aria-*`, `data-*`) pass through to the element and an unknown prop fails `astro check`. Every component also takes `class`.

### Layout (`components/layout/`)

| Component | Use for, and its props |
| --------- | ---------------------- |
| `Box` | A plain element for structure nothing else names (a positioned layer, a clipping wrapper). `as`, `space`. Reach for `Stack`, `Row` or `Grid` first |
| `Stack` | Children one above another. `as`, `gap`, `align`, `space`, `grow` (fill a column parent) |
| `Row` | Children side by side. `as`, `gap`, `align` (default `center`), `justify`, `wrap`, `stackBelow` (`sm`, `md`, `lg`: a column under that width), `space` |
| `Grid` | Equal columns by named preset. `as`, `cols` (`cards` 1-2-3, `cards-wide` 1-2-3 at `xl`, `halves`, `halves-md`, `facts` 2-3), `gap` (default `2xl`), `space` |
| `Frame` | The bordered column with its rails (KHP §3.1). `as`, `backdrop` (`plain`, `hero`, `none`), `topBorder`, `pad` (`none`, `sm`, `md`, `lg`), `grow`, `innerClass`. The footer, home hero, article layout, 404 page and `MainLayout`'s filler use it directly |
| `PageSection` | One band of a page: a `Frame` with `pad="md"`. `variant` (`hero`, the default, or `plain`), `topBorder` (default true), `id` |
| `Marquee` | A row that drifts sideways forever (KHP §5.8). `seconds` (one loop, default 60), `reverse`, `gap`, `label`. Renders its slot twice, the copy `inert`; pauses on hover, focus and off screen |
| `space.ts` | The shared scales: `GAP` (`none`, `2xs` to `3xl`), `ALIGN`, `JUSTIFY` and `SPACE_TOP` (`none`, `xs` to `2xl`, the margin above a block). One table, so a step means the same in every primitive (KHP §3.3) |

### Type (`components/type/`)

| Component | Use for, and its props |
| --------- | ---------------------- |
| `Heading` | Every title. `level` (1 to 6, default 2), `size` (`hero`, `page`, `section`, `article`, `feature`, `title`, `card`, `item`, `small`), `tone` (`strong`, `inherit`, `inverse`, `brand`), `weight`, `align` |
| `Accent` | The `text-brand-gradient` word inside a heading. No props |
| `Text` | Every run of words that isn't a heading. `as`, `size` (`inherit`, `xs`, `sm`, `body`, `base`, `large`, `lead`, `intro`, `xl`), `tone` (`inherit`, `strong`, `default`, `muted`, `subtle`, `brand`, `inverse`, `inverse-muted`; `subtle`, `neutral-500`, is the faintest text that passes AA, so there is no fainter tone), `weight`, `align`, `leading`, `datetime`, `clamp` (1 to 4 lines) |
| `Label` | The small uppercase line that names a group ("Built with"). `as`, `tone` (`subtle`, `brand`), `size` (`xs`, `2xs`) |
| `Link` | Every navigation in an Astro template (KHP §4.3). `href`, `tone` (`inherit`, `brand`, `muted`, `quiet`, `strong`), `external` (new tab, `rel="noopener noreferrer"`), `stretched` (covers its card, KHP §4.4), `underline` |
| `List`, `ListItem` | A `ul` or `ol` laid out as a column or a wrapping row. `List`: `ordered`, `direction` (`column`, `row`), `gap`, `space`. `ListItem`: `marker` (`none`, `square`, `square-muted`) |
| `Divider` | The short gradient bar under a centred title. `width` (`sm`, `md`, `lg`), `thickness` (`thin`, `thick`) |
| `IconText` | A Phosphor icon beside a few words (a date, a read time). `Icon`, `as`, `iconSize` (`sm`, `md`, `lg`), `datetime` |
| `VisuallyHidden` | Words for screen readers only. No props |
| `SkipLink` | "Skip to content", the first focusable thing on the page. `href` (default `#main`) |
| `Facts`, `Fact` | Labelled values as a `dl`. `Facts`: `layout` (`grid`, `stack`), `gap`. `Fact`: `label`; the value is the slot |
| `Prose` | The type of long-form markdown (KHP §5.5): headings, lists, quotes, code, links, figures. `id`. The article feature wraps it with tables and collapsible sections |
| `PageHeader` | A page's centred `h1` from `prefix`, `accent` (in `text-brand-gradient`) and `suffix`, an optional `subtitle`, and a short gradient bar. `size` (`lg` or `md`); `glow` adds a `soft-glow` halo behind it |
| `SectionHeader` | A section's centred title, composed the same way, with `subtitle` and the bar. `level` (2, the default, or 1 when it is the page's first title, so the page has one `h1`), `id` (on the title, for an anchor) |

### Media (`components/media/`)

| Component | Use for, and its props |
| --------- | ---------------------- |
| `Image` | Every picture. `src`, `alt` (required; `""` for decoration), `width`, `height`, `fit` (`cover`, `contain`, `none`), `priority` (loads eagerly with `fetchpriority="high"`; otherwise lazy), `darkSrc` (a second picture shown only in dark, for a logo drawn in black or white) |

### Surface (`components/surface/`)

| Component | Use for, and its props |
| --------- | ---------------------- |
| `Card` | The content surface. `variant` (`default`: `bg-card-gradient`, `shadow-elegant`; `subtle`: flat; `floating`: `shadow-floating`, forms and sidebars; `brand`: `bg-brand-gradient`, white text), `hoverable` (a `group` with `motion-surface`; on hover a `neutral-0` background, a `brand-300` border and `shadow-floating`), `padding` (`none`, `sm`, `md`, `lg`), `as`, `href` (renders a link), `target`, `rel`, `id` (an anchor other pages link to) |
| `Chip` | Every small label: tags, linked tags, technologies with logos, focus areas, versions, change categories. `variant` (`brand`, `neutral`, `tag`, `outline`, `link`, `success`, `warning`, `error`, `onBrand` over a brand surface, `overlay` over a photo), `size` (`xs`, `sm`, `md`, `tag`, `link-sm`, `link-md`, `logo-sm`, `logo-md`), `href` (a link, with a hover for `link` and `outline`), `dot` (the lime square), `logo` (a technology's logo), `logoDark` (its dark-theme variant) |
| `AccordionItem` | A card whose summary row opens to show more: a native `<details>`, so it works by keyboard and without script. The `summary` slot is the row; the default slot is what it reveals. `open`, `id` (a link to `#id` opens it). No coloured side edge (KHP §5.9). The roles on `/bio` |
| `StatusPill` | A status or "Featured" pill, optionally with an icon. `variant` (`brand`: `brand-700`, white text; `neutral`, `success`, `warning`, `error`), `Icon`, `iconWeight`, `size` (`md`, or `lg` for a featured card's corner) |
| `IconBadge` | A square holding one Phosphor icon. `Icon`, `variant` (`brand`, `dark`, `warning`, `success`, `subtle`), `size` (`sm` to `xl`), `weight` |
| `Panel`, `PanelSection` | A bordered box with a header strip, in parts: the project's Overview card. `Panel`: `title`, `Icon`. `PanelSection`: `heading`, `Icon`, `iconTone` (`brand`, `muted`), `divided` (a rule under it), `side` (a rule on its left from `md`) |

### Form (`components/form/`)

| Component | Use for, and its props |
| --------- | ---------------------- |
| `buttonVariants` (`button.ts`) | Button classes: `variant` (`default`: `brand-700`; `gradient`, `outlineBrand`, `outline`, `secondary`, `ghost`, `link`, `destructive`), `size` (`default`, `sm`, `lg`, `icon`). Also exports the `ButtonVariants` type |
| `Button` | A real `<button>` in those styles. `type` (default `button`), `variant`, `size` |
| `ButtonLink` | Navigation styled as a button. `href`, `target`, `rel`, `variant`, `size` |
| `Form` | A `<form>` laid out as a column. `id`, `method`, `action`, `gap` (default `xl`) |
| `Field` | A control with its label above it (KHP §4.1). `label`, `for`, `required` (an `error-600` asterisk); the control is the slot |
| `Input` | A one-line field. `id` (also the default `name`), `name`, `type` (`text`, `email`, `url`, `tel`, `search`) |
| `Textarea` | A multi-line field. `id`, `name`, `rows` (default 5) |
| `FIELD_CLASS` (`field.ts`) | The one field look, shared by `Input`, `Textarea` and the Select trigger (KHP §4.6) |
| `Select` and parts (`Select.tsx`) | React. Radix Select styled like the fields. Submits with the form through Radix's own `name` and `required` |

### Overlay (`components/overlay/`)

| Component | Use for, and its props |
| --------- | ---------------------- |
| `Drawer` | A modal `<dialog>` that slides in from the right. `id`, `title`, `eyebrow`, `subtitle`, `closeLabel`. Any element with `data-drawer-open="<id>"` opens it; Escape, the close button or a click outside closes it, and focus returns to the opener. Its script wires each drawer once per page |
| `Disclosure` | A `<details>` with a `summary` line. `summary`, `space` |
| `FloatingButton` | A tool fixed at the right edge under the top bar, its name beside it on hover and focus (KHP §3.5). `label`, `stack` (0 or 1, the slot); the icon is the slot |
| `Toaster` (`Toaster.tsx`) | React. sonner toasts in the theme's colours with status icons; mount once per page that toasts |

### Utilities

| Export | Does |
| ------ | ---- |
| `cn` (`utils/cn.ts`) | Joins classes with `clsx` and `tailwind-merge` |

## Rules

- Colours only from the theme's scales and `white`, `black`, `ink`; no rounded corners; layers by name. `pnpm check:tokens` enforces it (KHP §5.1, §5.6, §5.7).
- Motion from the tokens and utilities in `theme.css`, on colour, background, border, shadow, opacity and transform only (KHP §5.8). No CSS blur filter; a halo is `soft-glow` (KHP §7.7).
- A component takes its data as props and starts with a comment saying what it is for.
- A pattern a page needs that no component covers becomes a component here first, then the page uses it (KHP §4.9).
- Adding a component: add its row here and its export in `index.ts` in the same change.
