# khp-ui

The site's theme and its generic UI. Nothing here knows about projects, posts, tags or the site's words (KHP §8.1). Import from `@ui` in Astro; from `@ui/components/<Name>` in React islands (the barrel also exports `.astro` files, which islands can't load).

Before writing markup, check this list. If a component is close but not right, extend it here rather than building a second one beside it (KHP §1.3). New work uses these so it looks like the rest of the site (KHP §3, §4).

## Tokens

| File | Holds |
| ---- | ----- |
| `tokens/theme.css` | The brand, neutral, success, warning and error scales for light and their mirrored dark values (`:root.dark`); `white`, `black`, `ink`; Outfit; shadows; square corners; layers; the brand utilities (`bg-brand-gradient`, `bg-hero-gradient`, `bg-card-gradient`, `text-brand-gradient`, `shadow-elegant`, `shadow-floating`, `shadow-brand`); `stretched-link`; motion (KHP §5.8): the tokens `--duration-fast`, `--duration-base`, `--duration-slow` and `--ease-out`, the base transitions on links, buttons, fields and `.motion-surface`, the utilities `motion-lift` (a 2px lift on hover), `motion-zoom` (a cover scales to 1.03 on its card's hover), `marquee`, `marquee-track` and `marquee-reverse`, and the reduced-motion switch that stops them |
| `tokens/prose.css` | Only the collapsible section toggle styles. Article type lives in `src/app/features/article/Prose.astro` |

## Components

| Component | Kind | Use for |
| --------- | ---- | ------- |
| `PageSection` | Astro | A full-width band with the bordered rails column. `variant` `hero` (`bg-hero-gradient` inside the rails, the default) or `plain` (`neutral-0`); `topBorder={false}` drops the rule above |
| `PageHeader` | Astro | A page's centred `h1` from `prefix`, `accent` (in `text-brand-gradient`) and `suffix`, an optional `subtitle`, and a short gradient bar. `size` `lg` or `md`; `glow` adds the soft brand blur behind it |
| `SectionHeader` | Astro | A section's centred `h2`, composed the same way, with `subtitle` and the gradient bar |
| `Card` | Astro | The content surface. `variant` `default` (`bg-card-gradient`, `shadow-elegant`), `subtle` (flat), `floating` (`shadow-floating`, forms and sidebars), `brand` (`bg-brand-gradient`, white text). `hoverable` makes it a `group` with `motion-surface`, and on hover a `neutral-0` background, a `brand-300` border and `shadow-floating`. `padding` `none`, `sm`, `md`, `lg`. `as`, or `href` to render as a link. `id` sets an anchor other pages can link to |
| `Chip` | Astro | A small label: focus areas, versions, change categories. `variant` `brand`, `neutral`, `success`, `warning`, `error`, `white` (over a brand surface); `size` `xs` or `sm` |
| `StatusPill` | Astro | A status or "Featured" pill, optionally with an icon. `variant` `brand` (`brand-700`, white text), `neutral`, `success`, `warning`, `error` |
| `IconBadge` | Astro | A square holding one Phosphor icon. `variant` `brand`, `dark`, `warning`, `success`, `subtle`; `size` `sm` to `xl` |
| `ButtonLink` | Astro | Navigation styled as a button, through `buttonVariants` |
| `buttonVariants` | function | Button classes for `<button>` and `ButtonLink`: `default` (`brand-700`), `gradient`, `outlineBrand`, `outline`, `secondary`, `ghost`, `link`, `destructive`; sizes `default`, `sm`, `lg`, `icon` |
| `Select` and parts | React | Radix Select styled like the contact fields. Submits with the form through Radix's own `name` and `required` |
| `Toaster` | React | sonner toasts in the theme's colours with status icons; mount once per page that toasts |
| `cn` | function | Joins classes with `clsx` and `tailwind-merge` |

## Rules

- Colours only from the theme's scales and `white`, `black`, `ink`; no rounded corners; layers by name. `pnpm check:tokens` enforces it (KHP §5.1, §5.6, §5.7).
- Motion from the tokens and utilities in `theme.css`, on colour, background, border, shadow, opacity and transform only (KHP §5.8).
- A component takes its data as props and has a comment saying what it is for.
- Adding a component: add its row here and its export in `index.ts` in the same change.
