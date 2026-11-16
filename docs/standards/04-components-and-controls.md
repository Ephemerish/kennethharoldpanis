# 4. Components and controls

The catalogue is [lib/khp-ui/AGENTS.md](../../lib/khp-ui/AGENTS.md). Use a component from it before writing markup.

## At a glance

- Every field has its name above it (§4.1).
- Buttons come from `buttonVariants` (§4.2).
- Links in articles are underlined (§4.3).
- A card that is a link is one link with nothing clickable inside (§4.4).
- Chips, status pills and small uppercase labels are part of the style (§4.5).
- Fields share one style; dropdowns are Radix Select (§4.6).
- Pages are composed from components, never raw HTML (§4.9).
- An icon is a control, a signal or a logo, never decoration (§4.8).
- Generic unless needed: one component per kind of thing, no variant the data doesn't call for (§4.10).

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

## 4.4 Cards

`Card` from `@ui` is the surface: `bg-card-gradient` with `shadow-elegant`. With `hoverable` it takes a `neutral-0` background, a `brand-300` border and `shadow-floating` on hover (§5.8). `id` gives it an anchor other pages can link to. With `href` the whole card is one link.

- A project or a post is an `EntryCard`: the whole card is one link, with no other link inside it (§4.10).
- A role or certification on a tag or tech page (`BioRecordCard`) is one link to its card on `/bio`.
- A card with several actions is not a link: a certification card holds "Verify credential", its tech chips and its tag links as separate links.

Never put a link inside another link: nested links are invalid HTML and browsers split them.

## 4.5 Chips, pills and labels

- `Chip` for every short label: tags (`tag`, with the brand square), linked tags (`link`), tech with its logo (`outline`), versions and change categories in release notes.
- `StatusPill` for a state, in words, one size. The `brand` pill is `brand-700` with white text. Project status reads "Completed", "In Progress" or "Planned" on `success`, `warning` and `neutral`; the word is always there, so colour is never the only signal.
- `Logo` for an organisation's logo or a certification's badge on a white plate; initials when there is no image.
- Tags on entry cards are plain chips with a small brand square. On articles and on the bio's role and certification cards they are `link` chips to their tag page (`TagLinks`).
- Small uppercase labels with wide tracking ("Built with", "Tagged", "From my bio", the search result type, "Apps" in the mobile menu, table headers) are part of the style.

## 4.6 Fields and Select

A form is `Form`, each control sits in a `Field` (its label above it), and the controls are `Input`, `Textarea` and the Radix `Select`. All three share `FIELD_CLASS` (`form/field.ts`): `border-2 border-neutral-300` with `px-4 py-4`, and a `brand-500` border and soft ring on focus. Radix submits the Select with the form through its own `name` and `required`; do not add a hidden input. The subject Select is server-rendered and hydrates with `client:load`, so it is on screen with the page and ready before the reader reaches it; it gets `name` and `required` only once hydrated, so its server markup holds no hidden required field to block a form sent without script (§7.8). Without script, `NativeSelect` inside `NoScript` takes its place. Never `client:only` for it: the field would appear only after React and Radix load.

## 4.7 Pagination

The blog list pages with `src/app/pages/blogs/Pagination.astro`: "Previous" and "Next". An edge link is shown disabled (`aria-disabled`), never hidden, so the row doesn't move. Six posts per page (`lists.postsPerPage` in `src/data/settings.ts`).

## 4.8 Icons

An icon has a job or it isn't there. Three jobs:

| Job | Examples |
| --- | -------- |
| It is the control | The menu, close, theme, zoom and release-notes buttons; the accordion and select carets |
| It signals behaviour words don't show | The arrow that marks a link opening a new tab; the magnifier that marks the search field |
| It is a logo | GitHub, LinkedIn, email (icon-only links with an `aria-label`); tech logos; organisation logos and certification badges (`Logo`) |

Never an icon beside words that already say the same thing: no calendar before a date, no clock before a read time, no arrow after "View All Projects", no envelope on "Get In Touch", no rocket beside "Project", no icon in a coloured square beside "Email". `IconText` and `IconBadge`, which existed to do exactly that, are deleted. A thing with no image shows its initials (`Logo`), not a stand-in icon.

Phosphor (`@phosphor-icons/react`) for the icons that stay; the brand logos in `src/app/shared/` are inline SVG. An icon beside words is `aria-hidden`; an icon alone has an `aria-label`. `pnpm check:icons` (`scripts/check-icons.mjs`) allows Phosphor only in the files it lists, each with its job, and fails on any other.

*Why:* on November 16, 2026 the owner called the icons and bars "stupid" and "unnecessary". An icon repeating its word is the commonest AI tell after the side stripe (§5.9).

## 4.9 Pages are composed from components

A page, a feature and a layout are built from the components in [lib/khp-ui](../../lib/khp-ui/AGENTS.md): `Stack`, `Row` and `Grid` for where things sit, `Heading`, `Text` and `Link` for words, `Card`, `Chip` and `Image` for what is on them. Their templates write no raw HTML element.

- Among Astro templates, raw HTML lives only in `lib/khp-ui/` and in the brand glue in `src/app/shared/` (`GitHubIcon`, `LinkedInIcon`, `EnvelopeIcon`, `EmailLink`).
- Allowed in other templates: `<slot>`, inline SVG drawings, `<script>` and `<style>` blocks, and the document's own tags (`html`, `head`, `body`, `meta`, `link`, `title`) in `MainLayout` and `Head`.
- A pattern no component covers becomes a component in `lib/khp-ui/` first, then the page uses it. If a component is close, extend it (§1.3).
- Sizes, gaps and tones are named steps on the components (`space.ts`, `Heading`'s `size`, `Text`'s `tone`), so one change in a component changes it everywhere.
- A page may still pass `class` to a component for its own arrangement. Some pages also pass colour and type classes today (the footer's name, the home page's technology tiles); a look a second page needs becomes a prop or variant of the component instead.

`pnpm check:composition` (`scripts/check-composition.mjs`) fails on a raw element in an `.astro` template under `src/app/pages`, `src/app/features` or `src/app/layout`. React islands are not scanned. *Why:* chips, fields and headings were written by hand on each page, so changing one look meant finding every copy. A component is the one copy.


## 4.10 Generic unless needed

One kind of thing has one component, and it looks the same everywhere it appears. Projects and posts are one kind of thing (an entry): one `EntryCard`, in one `EntryGrid`, on the home page, `/projects`, `/blogs`, and tag and tech pages.

- **No variant without a reason in the data.** A variant exists only when the thing itself differs (a project has a status, a post a read time) and then it is a field of the same component (`CardData`), never a second layout. "Featured" and "newest" are an order, not a look: they come first.
- **The component reads one shape.** `toCard` turns a project or a post into `CardData`; the card never branches on the kind. A new kind of entry adds a case to `toCard`, not a card.
- **No wrappers that only rename.** A `ProjectsGrid` that is `EntryGrid` with projects, or a `FeaturedProjects` that is a `Stack` of cards, is deleted; the page uses the generic one.
- **Before writing a component, look for the generic one** in `lib/khp-ui` and `src/app/features` (§1.4). If it is close, extend it.
- **When one is replaced, the old one goes,** with every option only it used (§1.5).

*Why:* on November 16, 2026 the owner found two card designs for the same thing (a dark full-width "featured" card and a light grid card) and separate wrappers per page, and asked for one generic card. The old `EntryCard` (two layouts in one file), `Cover`, `Tags`, `EntryCollectionGrid`, `FeaturedProjects`, `ProjectsGrid` and `BlogsGrid` were deleted and rebuilt as `toCard`, `EntryCard`, `Cover` and `EntryGrid`; options only they used went with them (`Heading` size `feature`, `StatusPill` size `lg` and icons, `Chip` variants `overlay` and `onBrand`, `Text` tones `inverse` and `inverse-muted`, `Link` `stretched` and the `stretched-link` utility, `Grid` `cards-wide`). Cards also lost their in-card "Code" link: one card, one link.

## Checklist

- [ ] Labels above every field (§4.1); buttons from `buttonVariants` (§4.2).
- [ ] No link inside a link; a card that is a link holds nothing clickable (§4.4).
- [ ] One component per kind of thing; no new variant or wrapper the data doesn't need; replaced code deleted (§4.10).
- [ ] Status is shown in words, not colour alone (§4.5).
- [ ] Every icon is a control, a signal or a logo; `pnpm check:icons` passes (§4.8).
- [ ] Templates use lib components only; a new pattern became a component first; `pnpm check:composition` passes (§4.9).
