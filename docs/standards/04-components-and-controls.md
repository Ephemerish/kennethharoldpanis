# 4. Components and controls

The catalogue is [lib/khp-ui/AGENTS.md](../../lib/khp-ui/AGENTS.md). Use a component from it before writing markup.

## At a glance

- Every field has its name above it (§4.1).
- Buttons come from `buttonVariants` (§4.2).
- Links in articles are underlined (§4.3).
- A card is one link; other links in it are raised above it (§4.4).
- Chips, status pills and small uppercase labels are part of the style (§4.5).
- Fields share one style; dropdowns are Radix Select (§4.6).

## 4.1 Labels above controls

Every input, textarea and select has a visible `<label>` above it, tied by `for`/`id`. Placeholder text is an example, never the label. The contact form marks its required fields with an `error-600` asterisk.

## 4.2 Buttons

`buttonVariants` from `@ui`, for `<button>` and `ButtonLink`:

| Variant | Use on the site |
| ------- | --------------- |
| `default` | Solid brand (`brand-700`, white text): "Go back to Home" on the 404 page |
| `gradient` | The lead call to action in a section, with `shadow-brand`: "View All Projects", "Download PDF", "Get In Touch" on the resume page |
| `outlineBrand` | The second call to action: "Read All Blogs", "Back to Bio". It fills with `bg-brand-gradient` and white text on hover |
| `outline` | A neutral second action: "View Projects" on the 404 page |
| `secondary`, `ghost`, `link`, `destructive` | Available; no page uses them today |

Sizes `default` (`h-10`), `sm` (`h-9`), `lg` (`h-11`), `icon` (`h-10 w-10`). The home hero, the footer's "Get in Touch", the contact form's "Send Message" and the project page's "Visit Live Site" and "View Code" are styled by hand with the same colours; a new button uses `buttonVariants`. A link that opens another site in a new tab says so to screen readers ("(opens in a new tab)").

## 4.3 Links

Links in article text are `brand-700`, underlined with a `brand-400` decoration (`Prose.astro`). Navigation links in bars and lists are not underlined and turn `brand-700` on hover. An external link opens in a new tab with `rel="noopener noreferrer"`.

## 4.4 Cards and stretched links

`Card` from `@ui` is the surface: `bg-card-gradient` with `shadow-elegant`. With `hoverable` it takes a `neutral-0` background, a `brand-300` border and `shadow-floating` on hover, eased by `motion-surface`. `id` gives it an anchor other pages can link to. Entry cards follow the same look (`EntryCard`):

- A grid card's title holds its one link, with `stretched-link`, which covers the card. A project's "Code" link is raised above it (`relative z-raised`). Badges over the cover are `pointer-events-none`, so clicks reach the card.
- A featured card is a dark photo overlay (a black gradient, white text, a lead pill and a project's status pill), and the whole card is one link with no other link inside. The lead pill says why it leads (§6.6).
- A certification card is not one link. "Verify credential" is its `stretched-link`; its tech chips and tag links are real links raised above it (`relative z-raised`).
- A role or certification on a tag or tech page (`BioRecordCard`) is one link to its card on `/bio`.

Raised parts use `z-raised`, which stays under the top bar (`z-nav`). Cards that are links lift on hover with `motion-lift` (§5.8).

Never put a link inside another link: nested links are invalid HTML and browsers split them.

## 4.5 Chips, pills and labels

- `Chip` for short labels: focus areas, versions and change categories in release notes, the current role's stack on the contact page's call-to-action card.
- `StatusPill` for a state or "Featured", with an icon. The `brand` pill is `brand-700` with white text. Project status reads "Completed", "In Progress" or "Planned" on `success`, `warning` and `neutral`; the word is always there, so colour is never the only signal.
- `IconBadge` for the square icon on certification and resume cards.
- Tags on entry cards are plain chips with a small brand square. On articles and on the bio's role and certification cards they link to their tag page (`TagLinks`).
- Small uppercase labels with wide tracking ("Built with", "Tagged", "Focus areas", "Related tech", "From my bio", the search result type, "Apps" in the mobile menu, table headers) are part of the style.

## 4.6 Fields and Select

Inputs and textareas are `border-2 border-neutral-300` with `px-4 py-4`, and a `brand-500` border and soft ring on focus. The Radix `Select` trigger uses the same style. Radix submits the Select with the form through its own `name` and `required`; do not add a hidden input. The subject Select hydrates with `client:load`, so it is ready before the reader reaches it.

## 4.7 Pagination

The blog list pages with `src/app/pages/blogs/Pagination.astro`: "Previous" and "Next". An edge link is shown disabled (`aria-disabled`), never hidden, so the row doesn't move. Six posts per page.

## 4.8 Icons

Phosphor (`@phosphor-icons/react`) for new icons. The GitHub and LinkedIn icons in `src/app/shared/`, the footer's email icon, the toast status icons and the section toggle icons (built in a plain script) are inline SVG. An icon beside words is `aria-hidden`; an icon alone has an `aria-label`.

## Checklist

- [ ] Labels above every field (§4.1); buttons from `buttonVariants` (§4.2).
- [ ] No link inside a link; cards use a stretched title link or are one link (§4.4).
- [ ] Status is shown in words, not colour alone (§4.5).
- [ ] New icons from Phosphor, hidden beside words (§4.8).
