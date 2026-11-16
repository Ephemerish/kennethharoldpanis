# Article engines

Standards: KHP §3.5, §4.3, §4.9, §5.5, §5.8, §7.5, §7.6, §7.7

## Purpose

An article is a blog post or a project write-up. `ArticleLayout` draws its
head, cover, body and facets once. An engine decides how a blog post's body is
drawn: `prose` through `Prose.astro`, or `pretext` laid out by pretext.js with
a live cover. Cards and lists are [Entries](entries.md); the project's release
drawer is [Release notes](release-notes.md).

## Implementation

- `src/app/features/article/engines.ts`: `ENGINES` (key, description, `liveCover`), `ENGINE_KEYS` for the content schema, `DEFAULT_ENGINE = "prose"`, `engineHasLiveCover`. Has no imports, because `src/content.config.ts` imports it.
- `src/app/pages/blogs/[slug]/BlogPost.astro`: renders the entry with `render(entry)`, then picks `PretextArticle` when `engine === "pretext"`, else `ProseArticle` with the `Content`.
- `src/app/layout/ArticleLayout.astro`: a `Frame` (the rails column, `pad="md"`) holding an article built from `@ui` components, with a header: the `h1` with any status badges beside it (projects pass one), a meta row (date in `<time datetime>`, read time), the description, the hero (backdrop image under `#article-hero`, `object-contain` on black, `shadow-lg`, both `Image` with `priority`; `showHero={false}` keeps it only as the share image), the `actions` slot, then "Built with" (`TechChips`) and "Tagged" (`TagLinks`) under `Label`s. Then the `lead` slot, the body through `Prose` (or raw when `proseBody` is false), `ContentImageViewer` (`client:idle`) and the `overlay` slot. Passes "<title> - Kenneth Harold Panis" (from `site.name`) as the page title and the hero as the share image (see [Head and SEO](head-and-seo.md)).
- `src/app/pages/projects/[slug]/ProjectDetail.astro`: a project, rendered with `render(project)`, through `ArticleLayout` with its status badge, `ProjectActions` ("Visit Live Site", "View Code", both `ButtonLink`), `ProjectLead` (gallery and the Overview card, `ProjectDetails`, a `Panel` of `PanelSection`s) and, when the app has release notes, `ProjectUpdates` in the overlay.
- `ProseArticle.astro`: the markdown `Content` through `ArticleLayout`.
- `Prose.astro`: wraps `Prose` from `@ui` (`lib/khp-ui/components/type/Prose.astro`, the article type as Tailwind arbitrary variants, KHP §5.5) with `id="article-content"`. On `astro:page-load` it removes any old collapse-all button and tooltip, then runs `enhanceTables` and `initCollapsibleSections`.
- `prose/enhanceTables.ts`: wraps each table in a focusable `.table-wrapper` region labelled "Table" that scrolls sideways, and styles its cells.
- `prose/collapsibleSections.ts`: each `h2`/`h3` with content becomes a real `<button class="section-toggle" aria-expanded>` inside the heading, with a caret; styles in `lib/khp-ui/tokens/prose.css`. With two or more sections, a fixed button at the right edge hides or shows all ("Hide All Sections", "Show All Sections") with a tooltip. Built in script with the `.float-btn` and `.float-tip` classes that `FloatingButton` uses, it takes slot `1` (lower) when a release-notes trigger is on the page, else slot `0`.
- `rehype-figure.mjs`: registered in `astro.config.mjs`. A paragraph holding only an image becomes a `<figure>`; non-empty alt text becomes the `<figcaption>`.
- `ImageViewer.tsx`: custom fullscreen viewer on `bg-black/90`. Zoom by wheel, buttons, double-click and `+`/`-`; drag to pan; arrows and Escape; locks body scroll. `ContentImageViewer.tsx` wires `#article-hero` and `#article-content img` to it. `Gallery.tsx` on project pages uses it too.
- `PretextArticle.astro`: parses the body into blocks (`#`/`##` headings, paragraphs, `>` quotes, a `Source:` line, inline links) and renders `PretextCover` (`variant="featured"`) in the lead and `PretextEngine`, both `client:load`. Passes no hero, so the share image is the default.
- `PretextEngine.tsx` and `pretext/blocks/*`: one renderer per block kind. The first paragraph is `LeadFlow`, text flowing around moving shapes; section starts get a `DropLetter`.
- `PretextCover.tsx`: canvas cover of cloth strips and, by default, the title. With `showTitle` it shows the title as text until the canvas is live. With `showTitle={false}` (on cards, which show the title themselves) its background stays transparent and its canvas hidden until live, so the still under it shows. It draws one frame at once, then runs `visibleAnimation` at 24 frames a second; under reduced motion it keeps that one frame and starts no loop.
- `pretext/hooks.ts` (`usePretext` loads pretext.js after fonts and reports reduced motion; `useElementBox`), `pretext/animation.ts` (`visibleAnimation`, `coverSize`), `pretext/shared.ts`, `pretext/cloth.ts`.

## Must stay true

1. Every long-form body goes through `ArticleLayout`. Prose bodies go through `Prose`, so type, figures, tables and collapsible sections are defined once (KHP §5.5).
2. Tables scroll inside their wrapper, never widen the page (KHP §3.6).
3. Section toggles are real buttons with `aria-expanded`, keeping the original look. The collapse-all button has an `aria-label` and a visible tooltip on hover and focus, and looks like every other floating tool (KHP §3.5).
4. Enhancements run on `astro:page-load` and are idempotent (`data-collapsible="ready"`, the wrapper check, old collapse-all removed first), so view transitions neither skip nor double them.
5. The pretext engine renders readable server HTML before pretext.js loads.
6. A frame loop runs only while its element is on screen and the tab is visible, at most 24 frames a second (`visibleAnimation`). Reduced motion draws one still frame and starts no loop (KHP §5.8).
7. The canvas drawing surface is bounded (`coverSize`: at most 640 x 360 at up to 1.5x), whatever the screen.
8. The pretext article hydrates its own live cover with `client:load`. A card's cover paints a still and hydrates only when visible, so the home page hydrates nothing eagerly (KHP §7.6).
9. A new engine is added in `engines.ts` (which feeds the schema) and mapped in `BlogPost.astro`.

## Before changing

- Open a prose post with tables and several sections, the pretext post, and a project with a gallery and release notes. Check phone and desktop width, both themes, reduced motion.
- Navigate between two articles by view transition and check the toggles, the collapse-all button and the viewer still work.
- Related: [Entries](entries.md), [Release notes](release-notes.md), [Theme tokens](theme-tokens.md), [Content registries](content-registries.md).

## Checks

- `pnpm test` runs `tests/unit/cover-runtime.test.mjs`: `visibleAnimation` schedules nothing offscreen or hidden, resumes, caps the rate, keeps one pending callback; `coverSize` bounds the surface.
- `pnpm check:output` runs `scripts/check-home-performance.mjs`: the built pretext article still has the `PretextCover` island; the home page paints the still and hydrates the cover only `client:visible`.
- `pnpm test:e2e`: sections fold one at a time and all at once on a prose post; an article's cover opens the image viewer and Escape closes it; the pretext cover hydrates when scrolled into view; every article loads with one `h1` and no sideways scroll at 375px. `pnpm test:perf` measures folding a section and opening the viewer against the INP budget ([Testing](testing.md)).
- None for rehype-figure, table wrapping or the pretext parser.

## Known limits

- There is no back link to the list at the top of an article; the top bar is the way back.
- Article text runs the full column width; there is no reading measure.
- `PretextCover.tsx` writes canvas colours as literals by exception (see [Theme tokens](theme-tokens.md)).
- The pretext parser drops lists, images, code, emphasis and tables to plain text or nothing.
- `ImageViewer` is a custom component, not a library dialog: it does not move focus in, trap it, or restore it on close. React's `onWheel` is passive, so its `preventDefault` does not stop page scroll. Article images open on click only; they are not keyboard reachable.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm test` and `pnpm check:output` pass after `pnpm build`.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
