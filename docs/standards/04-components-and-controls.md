# 4. Components and controls

The catalogue is [lib/khp-ui/AGENTS.md](../../lib/khp-ui/AGENTS.md). Use a component from it before writing markup.

## At a glance

- Every field has its name above it (§4.1).
- Buttons come from `buttonVariants` (§4.2).
- Links in articles are underlined (§4.3).
- A card is one link; other links in it are raised above it (§4.4).
- Chips, status pills and small uppercase labels are part of the style (§4.5).
- Fields share one style; dropdowns are Radix Select (§4.6).
- Pages are composed from components, never raw HTML (§4.9).

## 4.1 Labels above controls

Every input, textarea and select has a visible `<label>` above it, tied by `for`/`id`. Placeholder text is an example, never the label. The contact form marks its required fields with an `error-600` asterisk.

## 4.2 Buttons

`buttonVariants` from `@ui`, through `Button` (a real `<button>`) and `ButtonLink` (navigation):

| Variant | Use on the site |
| ------- | --------------- |
| `default` | Solid brand (`brand-700`, white text): the home hero's and the footer's buttons to `/contact`, "Go back to Home" on the 404 page |
| `gradient` | The lead call to action in a section, with `shadow-brand`: "View All Projects", "Download PDF", "Get In Touch" on the resume page, the contact form's "Send Message", a project's "Visit Live Site" |
| `outlineBrand` | The second call to action: "Read All Blogs", "Back to Bio". It fills with `bg-brand-gradient` and white text on hover |
| `outline` | A neutral second action: "View Projects" on the home hero and the 404 page, a project's "View Code" |
| `link` | A text action: "Search for something else" on tag and tech pages |
| `secondary`, `ghost`, `destructive` | Available; no page uses them today |

Sizes `default` (`h-10`), `sm` (`h-9`), `lg` (`h-11`), `icon` (`h-10 w-10`). Every button on the site starts from these variants. Some add classes on top: the hero's, the footer's and the project page's buttons set their own padding, and "View Projects" on the hero and "View Code" on a project page also set their border and text colour. A new button uses a variant as it is. A link that opens another site in a new tab says so to screen readers ("(opens in a new tab)").

## 4.3 Links

Links in article text are `brand-700`, underlined with a `brand-400` decoration (`Prose`). Navigation links in bars and lists are not underlined and turn `brand-700` on hover. In an Astro template a plain link is `Link` from `@ui` (a button-styled one is `ButtonLink`, a chip `Chip` with `href`). `tone` sets the colours; `external` opens a new tab with `rel="noopener noreferrer"`.

## 4.4 Cards and stretched links

`Card` from `@ui` is the surface: `bg-card-gradient` with `shadow-elegant`. With `hoverable` it takes a `neutral-0` background, a `brand-300` border and `shadow-floating` on hover, eased by `motion-surface`. `id` gives it an anchor other pages can link to. Entry cards follow the same look (`EntryCard`):

- A grid card's title holds its one link, with `stretched-link`, which covers the card. A project's "Code" link is raised above it (`relative z-raised`). Badges over the cover are `pointer-events-none`, so clicks reach the card.
- A featured card is a dark photo overlay (a black gradient, white text, a lead pill and a project's status pill), and the whole card is one link with no other link inside. The lead pill says why it leads (§6.6).
- A certification card is not one link. "Verify credential" is its `stretched-link`; its tech chips and tag links are real links raised above it (`relative z-raised`).
- A role or certification on a tag or tech page (`BioRecordCard`) is one link to its card on `/bio`.

Raised parts use `z-raised`, which stays under the top bar (`z-nav`). Cards that are links lift on hover with `motion-lift` (§5.8).

Never put a link inside another link: nested links are invalid HTML and browsers split them.

## 4.5 Chips, pills and labels

- `Chip` for every short label: tags (`tag`, with the brand square), linked tags (`link`), technologies with their logos (`outline`), focus areas, versions and change categories in release notes, tags over a featured card's photo (`overlay`), and the current role's stack on the contact page's call-to-action card (`onBrand`).
- `StatusPill` for a state or "Featured", with an icon. The `brand` pill is `brand-700` with white text. Project status reads "Completed", "In Progress" or "Planned" on `success`, `warning` and `neutral`; the word is always there, so colour is never the only signal.
- `IconBadge` for the square icon on certification and resume cards.
- Tags on entry cards are plain chips with a small brand square. On articles and on the bio's role and certification cards they are `link` chips to their tag page (`TagLinks`).
- Small uppercase labels with wide tracking ("Built with", "Tagged", "Focus areas", "Related tech", "From my bio", the search result type, "Apps" in the mobile menu, table headers) are part of the style.

## 4.6 Fields and Select

A form is `Form`, each control sits in a `Field` (its label above it), and the controls are `Input`, `Textarea` and the Radix `Select`. All three share `FIELD_CLASS` (`form/field.ts`): `border-2 border-neutral-300` with `px-4 py-4`, and a `brand-500` border and soft ring on focus. Radix submits the Select with the form through its own `name` and `required`; do not add a hidden input. The subject Select hydrates with `client:load`, so it is ready before the reader reaches it.

## 4.7 Pagination

The blog list pages with `src/app/pages/blogs/Pagination.astro`: "Previous" and "Next". An edge link is shown disabled (`aria-disabled`), never hidden, so the row doesn't move. Six posts per page (`lists.postsPerPage` in `src/data/settings.ts`).

## 4.8 Icons

Phosphor (`@phosphor-icons/react`) for new icons. The GitHub, LinkedIn and envelope icons in `src/app/shared/` (`GitHubIcon`, `LinkedInIcon`, `EnvelopeIcon`), the toast status icons and the section toggle icons (built in a plain script) are inline SVG. An icon beside words is `aria-hidden`; an icon alone has an `aria-label`.

## 4.9 Pages are composed from components

A page, a feature and a layout are built from the components in [lib/khp-ui](../../lib/khp-ui/AGENTS.md): `Stack`, `Row` and `Grid` for where things sit, `Heading`, `Text` and `Link` for words, `Card`, `Chip` and `Image` for what is on them. Their templates write no raw HTML element.

- Among Astro templates, raw HTML lives only in `lib/khp-ui/` and in the brand glue in `src/app/shared/` (`GitHubIcon`, `LinkedInIcon`, `EnvelopeIcon`, `EmailLink`).
- Allowed in other templates: `<slot>`, inline SVG drawings, `<script>` and `<style>` blocks, and the document's own tags (`html`, `head`, `body`, `meta`, `link`, `title`) in `MainLayout` and `Head`.
- A pattern no component covers becomes a component in `lib/khp-ui/` first, then the page uses it. If a component is close, extend it (§1.3).
- Sizes, gaps and tones are named steps on the components (`space.ts`, `Heading`'s `size`, `Text`'s `tone`), so one change in a component changes it everywhere.
- A page may still pass `class` to a component for its own arrangement. Some pages also pass colour and type classes today (the footer's name, the home page's technology tiles); a look a second page needs becomes a prop or variant of the component instead.

`pnpm check:composition` (`scripts/check-composition.mjs`) fails on a raw element in an `.astro` template under `src/app/pages`, `src/app/features` or `src/app/layout`. React islands are not scanned. *Why:* chips, fields and headings were written by hand on each page, so changing one look meant finding every copy. A component is the one copy.

## Checklist

- [ ] Labels above every field (§4.1); buttons from `buttonVariants` (§4.2).
- [ ] No link inside a link; cards use a stretched title link or are one link (§4.4).
- [ ] Status is shown in words, not colour alone (§4.5).
- [ ] New icons from Phosphor, hidden beside words (§4.8).
- [ ] Templates use lib components only; a new pattern became a component first; `pnpm check:composition` passes (§4.9).
