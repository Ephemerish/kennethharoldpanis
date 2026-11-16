# Frame and navigation

Standards: KHP §1.6, §2.1, §2.4, §2.5, §3.1, §3.6, §4.9, §5.7

## Purpose

The frame is what every page shares: the top bar, the bordered rails column
the content sits in, and the footer. The top bar holds the main links, the
Apps menu, search and the theme toggle, and marks the current page. What sits
inside a band belongs to each page. Search behaviour is [Search](search.md);
the theme switch is [Theme tokens](theme-tokens.md).

## Implementation

- `src/app/layout/MainLayout.astro`: imports `theme.css`, renders `Head` and `ClientRouter` in the head. The body is a full-height column (`min-h-screen flex flex-col`): `SkipLink` ("Skip to content", to `#main`, screen-reader only until focused), `Navbar` (`client:idle`, `transition:persist`), a `Box as="main" id="main"` that grows to fill the window and ends with a `Frame grow backdrop="none"` carrying the rails down to the footer, `Footer` and `Analytics`. It and `Head` are the only templates allowed the document's own tags (KHP §4.9).
- `lib/khp-ui/components/layout/Frame.astro`: the rails column. A full-width element with an optional `border-t` (`topBorder`), an absolutely placed `max-w-7xl` layer with `border-l border-r` (the rails) filled by `backdrop` (`plain` `neutral-0`, `hero` `bg-hero-gradient`, or `none`), and the content in the same column with inner padding; `pad` sets the band's vertical padding.
- `lib/khp-ui/components/layout/PageSection.astro`: one band, a `Frame as="section"` with `pad="md"`, `variant` `hero` or `plain`, `topBorder` on by default.
- `Footer.astro`, `ArticleLayout.astro`, the filler in `MainLayout.astro`, `src/app/pages/home/Hero.astro` and `src/app/pages/not-found/NotFound.astro` use `Frame` directly. `Navbar.tsx`, a React island, writes the same rails by hand.
- `src/app/layout/Navbar.tsx`: sticky at `z-nav`, `shadow-sm`. The name in `text-brand-gradient` links home. From `lg`: `navLinks.slice(0, 4)` (Home, Bio, Projects, Blogs), `AppsMenu`, the rest (Contact), then `Search` and `ThemeToggle`. The current page's link is `text-brand-700`. Keeps its own `path` and updates it on `astro:page-load`, which also closes the mobile menu. Escape closes the mobile menu. Below 1024px it answers an `open-search` event by opening the mobile menu with search focused.
- `src/app/layout/nav/AppsMenu.tsx`: disclosure button with `aria-expanded`. Closes on outside click, outside focus and Escape (focus returns to the button). Each app opens in a new tab and says so to screen readers.
- `src/app/layout/nav/MobileMenu.tsx`: under the bar below `lg`. Search (with `autoFocus` when opened for search), the page links, the apps under a small uppercase "Apps" label, and `ThemeToggle` with a visible label.
- `src/app/layout/Footer.astro`: a `Frame as="footer"` with the name in `text-brand-gradient`, GitHub, LinkedIn and email icon links (`GitHubIcon`, `LinkedInIcon`, `EnvelopeIcon` and `EmailLink` from `src/app/shared/`), and a `ButtonLink` "Get in Touch" (`default`, `brand-700`) to `/contact`.
- `src/data/site.ts`: `site` (name, URL, description, email, default image), `socials` (GitHub, LinkedIn), `navLinks` (Home, Bio, Projects, Blogs, Contact), `isCurrent`.

## Must stay true

1. Every page renders inside `MainLayout`, so every page has the top bar and footer (KHP §2.1).
2. The rails line up from the top bar to the footer: every band uses the same `max-w-7xl` column and gutters (KHP §3.1). A change to `Frame`'s column is copied to `Navbar.tsx`, the one hand-written band.
3. The current page's link is `brand-700` with `aria-current="page"`, in the top bar and the mobile menu (KHP §2.4). `isCurrent` treats sub-pages as current: `/projects/pundo` marks Projects.
4. The persisted `Navbar` follows `astro:page-load`. Its `path` prop is only the first page; without the listener the old page stays marked after a view transition.
5. `navLinks` is the one list of top-level pages. The top bar and mobile menu read it.
6. The Apps menu sits before the last link (`navLinks.slice(0, 4)`), between Blogs and Contact. Reordering `navLinks` moves it.
7. The Apps menu renders nothing when `apps` is empty.
8. Below `lg` the inline links, search and toggle hide and the menu button shows, with `aria-expanded` and `aria-controls`.
9. Overlays use layer names: top bar `z-nav`, Apps list `z-dropdown`. Card parts raised at `z-raised` stay under the top bar.
10. The skip link is the first focusable element on every page and lands on `#main` (KHP §1.6).
11. On a short page the footer sits at the bottom of the window and the rails run on down to it.

## Before changing

- Navigate by view transition from one section to another and check the marked link follows.
- At phone width, open the menu, navigate, and check it closes. Press Escape with it open.
- Check the Apps menu with keyboard: Tab in, Enter, Tab out (it closes), Escape (focus returns).
- Press Tab once on a fresh page: the skip link shows; Enter moves to the content.
- Open a short page (a tag page with one result) and check the footer sits at the bottom and the rails reach it.
- Related: [Theme tokens](theme-tokens.md), [Search](search.md), [Content registries](content-registries.md) (`apps.ts`), [Head and SEO](head-and-seo.md).

## Checks

- `pnpm test:e2e` ([Testing](testing.md)): on desktop, the top bar marks the current page and the mark follows a navigation; the Apps menu opens, its links open a new tab, and Escape closes it and returns focus. On mobile, the menu opens, shows the links and closes on Escape. At both widths, "Search for something else" reaches a focused search box, and every page has one `h1` and no sideways scroll.
- `pnpm test:perf` measures opening the Apps menu and switching the theme against the INP budget.
- `pnpm check:composition` keeps raw HTML out of the layout templates.
- None for the skip link, or for the footer sitting at the bottom of a short page.

## Known limits

- The mobile menu button's name is "Toggle menu" in both states; `aria-expanded` carries the state.
- `MobileMenu` does not move focus into the menu when the menu button opens it. Only a menu opened for search focuses its field.
- The footer has no page links.
- The rails pattern is written twice: in `Frame` and by hand in `Navbar.tsx`.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] Navigation was tried across a view transition, at phone and desktop width.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
