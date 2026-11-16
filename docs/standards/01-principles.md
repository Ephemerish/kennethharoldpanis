# 1. Principles

Read always. When two rules disagree, the lower number wins, except that the owner's words and look (§6.6) are never changed to satisfy another rule without his say.

## At a glance

- What the site says is true, or it says what it doesn't know (§1.1).
- Look at every place a change touches before deciding (§1.2).
- Each fact has one home (§1.3).
- A maintained library before our own code (§1.4).
- Dead code, options and pages go in the change that finds them (§1.5).
- Everyone can use it: keyboard, screen reader, phone (§1.6).

## 1.1 Right, or it says so

A date, a status, a count or a claim on screen is true when the page is built. A form says "sent" only when the server said so. What isn't known is said plainly ("Resume coming soon"), never filled with a guess or a placeholder that looks real. *Why:* the contact form once reported every message as sent, because the nanoquery mutator it used swallowed errors.

## 1.2 See the whole before deciding

Before a change, list every page that shows the same kind of thing, every state it can be in (one item, none, many, a long title, a failed request, a phone, dark mode) and every component beside it. Decide once for all of them and build it once. Test: if the list is "just this page", it wasn't looked for.

## 1.3 One home per fact

Each fact is written once and read everywhere:

| Fact | Home |
| ---- | ---- |
| Name, URL, description, email, default share image, social links, navigation | `src/data/site.ts` |
| How many entries the home page and `/blogs` show, the contact form's limits, the performance budget | `src/data/settings.ts` |
| Colours, gradients, shadows, layers | `lib/khp-ui/tokens/theme.css` |
| How a button, field, chip, card or heading looks | its component in `lib/khp-ui/components/` |
| Technologies and tags | `src/data/taxonomy/technologies.ts`, `tags.ts` |
| Work and school history, certifications, the resume flag | `src/data/bio/experience.ts`, `certifications.ts`, `resume.ts` |
| Live apps and their release notes | `src/data/apps/apps.ts`, `src/data/apps/patch-notes/` |
| Posts and projects | `src/data/content/blog/`, `src/data/content/projects/` |
| How entries sort, and the project status words | `src/app/features/entries/model.ts` |
| What carries each tag and technology | `src/app/features/taxonomy/collect.ts` (`loadTaxonomy`) |
| Contact subjects | `src/data/contact/subjects.ts` |
| Blog page URLs | `src/app/pages/blogs/model.ts` |

Known repeats are recorded as gaps in the system files.

## 1.4 A proven library before our own

Controls, popovers, toasts, icons and data fetching come from maintained libraries: Radix (Select), sonner (toasts), Phosphor (icons), nanostores and nanoquery (client data), class-variance-authority and tailwind-merge (class composition). Custom code that does a library's job says which library didn't fit and why, in a comment. Read a library's behaviour before relying on it: nanoquery's `mutate()` returns `undefined` on failure instead of throwing.

## 1.5 No loose ends

Whoever finds a dead link, an unused component, an option nobody passes, a page nothing links to or an unused dependency removes it in the same change and names it in the report. Two components for one thing become one. Removing something a reader sees needs the owner's say (§6.6).

## 1.6 Accessible

- Every action is a `<button>`, every navigation an `<a>`; never one inside the other. Every page has exactly one `h1`.
- Every field has a visible label above it (§4.1).
- Focus is visible everywhere (`:focus-visible` draws a 2px `brand-500` outline). A "Skip to content" link (`SkipLink`) is the first thing on every page.
- The current page carries `aria-current="page"` (§2.4).
- Icons beside words are `aria-hidden`; an icon alone has an `aria-label`.
- Text meets WCAG AA contrast in both themes: white text sits on `brand-700`, not `brand-600` (§5.3). A gap that remains is recorded in [theme tokens](../systems/theme-tokens.md). *Why:* the site is itself a work sample (§10.6); this rule used to accept the palette's shortfall.
- Motion stops under reduced motion (§5.8).

## Checklist

- [ ] Every claim on screen is true, or the gap is said in words (§1.1).
- [ ] Every place, state and neighbour the change touches was looked at (§1.2).
- [ ] No fact was written twice (§1.3).
- [ ] Loose ends found were removed or reported (§1.5).
- [ ] Keyboard, focus, labels, contrast and reduced motion checked (§1.6).
