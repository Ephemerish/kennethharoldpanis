# Testing

Standards: KHP §9.2, §9.3, §7.7, §1.1, §1.6, §3.6, §7.5

## Purpose

The tests check that every page the site publishes works, that every
interactive feature behaves the way a visitor uses it, and that pages and
interactions stay inside the performance budget. They run on the production
build, served the way visitors get it. Every page is scanned for
accessibility, contrast included, in light and in dark. They do not judge the
look: colour choice, spacing and composition are still checked by eye (KHP §9.3). The
budget's numbers belong to [Content registries](content-registries.md)
(`src/data/settings.ts`); the server the tests drive belongs to
[Head and SEO](head-and-seo.md).

## Implementation

- `playwright.config.ts`: `@playwright/test`. The web server is `node server.mjs` on `127.0.0.1:4400`. Locally it drives the installed Google Chrome (`channel: "chrome"`) and reuses a server already on the port; in CI (`CI` set) it uses Playwright's Chromium, forbids `test.only`, and retries a failure once. Three projects:
  - `desktop`: `tests/e2e` at 1440 x 900.
  - `mobile`: `tests/e2e` at 375 x 812, with touch.
  - `performance`: `tests/perf` at 1440 x 900, one test at a time.
- `tests/support/routes.ts`: `routes`, every path in the built `dist/client/sitemap.xml`, so a new page is tested as soon as it ships. `representative`, 11 pages, one of each kind, for the performance runs: `/`, `/projects`, `/projects/pundo`, `/projects/marine-communication-network`, `/blogs`, two posts (one prose, the pretext post), `/bio`, `/contact`, `/tech/react`, and the first tag page in the sitemap, so a renamed tag can't leave a dead route. It throws when a fixed path is not in the sitemap.
- `tests/support/vitals.ts`:
  - `observeVitals`: installs `PerformanceObserver`s before any page script, for Largest Contentful Paint, layout shift, long tasks and event timing.
  - `throttle`: CPU slowed 4x, and a 4G network (40 ms latency, 12 Mbit/s down, 3 Mbit/s up), through the Chrome DevTools Protocol.
  - `readVitals`: LCP, CLS, Total Blocking Time (the sum of each long task's time over 50 ms), INP (the slowest event), the JavaScript and HTML transfer sizes.
  - `scrollFrames`: scrolls the whole page 40 px a frame and returns each frame's time. `percentile`.
- `tests/e2e/pages.spec.ts`: every route at both widths answers 200, has exactly one `h1`, no image without `alt`, no sideways scroll, no script error, no console error and no failed request to the site. An unknown URL answers 404 with "Page Not Found" and "Go back to Home". On desktop, every internal link on every page answers below 400.
- `tests/e2e/resilience.spec.ts` (KHP §7.8): with script off, seven kinds of page still show their `h1` and the top bar's links (as a row on a phone) and hide the controls that need script; the contact form posts without script and lands on `/contact/not-sent` (skipped when `RESEND_API_KEY` is set, so it never sends); the endpoint redirects a plain post (303 to `/thank-you` via the honeypot, or `/contact/not-sent`) and answers JSON to a scripted one; with every image aborted, no broken image shows and nothing scrolls sideways; with storage throwing, the theme still switches and nothing throws; with script off the splash stays hidden; with the search index failing, search says "Search isn't available right now."
- `tests/e2e/accessibility.spec.ts`: every route, on desktop, in light and in dark (the theme set in `localStorage` before the page loads), scanned by `@axe-core/playwright` with the WCAG 2.0 and 2.1 A and AA rules: contrast, names, labels, landmarks. Fails listing each rule and up to 4 of its elements.
- `tests/e2e/features.spec.ts`: the top bar marks the current page and follows a navigation; search finds a project and opens it with Enter; the mobile menu opens, shows the links and closes on Escape; "Search for something else" focuses search at both widths; the theme choice survives a navigation and a reload; the Apps menu opens, its links open a new tab, and Escape closes it and returns focus; the release-notes drawer opens and returns focus to its button on Escape; article sections fold one by one and all at once; an article's cover opens the image viewer and Escape closes it; the marquee moves, pauses under the pointer, and can be dragged without opening a tile; a tech page says "Certified in" for tech only a certification covers, and the home rows leave such tech out; the pretext cover's canvas shows once scrolled into view; `/bio#<slug>` lands on its card; the current role is open and shows its tech, and opening another shows the tech used there; a link to a closed role opens it; the contact form won't send with empty fields, says "sent" only when the server accepts, and keeps the message when it refuses; headings keep the space around their accent word; the splash shows on a load and leaves, not on a move to another page, again on a reload, and never under reduced motion or Data Saver. The contact tests answer `/api/contact` themselves with `page.route`.
- `tests/perf/performance.spec.ts`: each representative page, throttled, must answer OK, is loaded, left to finish idle hydration, then scrolled. Its LCP, CLS, TBT, JavaScript, HTML, scroll p95 and share of janky frames are checked against `performanceBudget` from `src/data/settings.ts`, with soft asserts so one run reports every miss. Six interactions are checked against the INP budget: switching the theme, opening the Apps menu, typing in search, opening release notes, folding an article section, opening the image viewer. Each test prints its numbers.
- `tests/unit/cover-runtime.test.mjs`: Node's test runner. `visibleAnimation` schedules nothing off screen or in a hidden tab, resumes, caps the frame rate and keeps one pending callback; `coverSize` bounds the canvas.
- `package.json`: `test` (unit), `test:e2e` (`desktop` and `mobile`), `test:perf` (`performance`, one worker). `verify` runs both browser suites after the build and the output checks.
- `.github/workflows/test.yaml`: installs Chromium with its system packages, then runs `pnpm verify`.

## Must stay true

1. The browser tests run against `pnpm build` served by `server.mjs`, never the dev server, so they measure the compressed, cached site visitors get.
2. The page list comes from the built sitemap. A page in the sitemap is tested at both widths with no change to the tests (KHP §7.3).
3. The budget's numbers live only in `src/data/settings.ts`; the performance spec imports them (KHP §1.3).
4. Every page has one `h1`, `alt` on every image and no sideways scroll at 375px (KHP §1.6, §7.5, §3.6), and passes axe's WCAG A and AA rules in both themes (KHP §1.6, §5.2).
5. The contact tests check that success shows only when the server accepts, and that a refusal keeps what the reader typed (KHP §1.1).
6. The throttling profile stays fixed, so results from different runs compare.
7. Performance tests run one at a time, so measurements don't compete for the CPU.
8. Tests wait for the top bar's idle hydration like a reader would. The site never hydrates earlier to make a test easier (KHP §7.6).
9. A skip says why. The accessibility scan skips mobile (contrast and names are the same at every width). Five more skip by design: the top bar mark, the Apps menu and the marquee hover on mobile, the mobile menu on desktop, and the link crawl on mobile (links are the same at every width).

## Before changing

- The dev server bundles the islands' browser dependencies at start (`vite.optimizeDeps.include` in `astro.config.mjs`). A new island dependency goes in that list, or the first visit to its page in dev stalls while Vite re-bundles and reloads.

- Build first: `pnpm build`, then `pnpm test:e2e` or `pnpm test:perf`. Read the printed numbers, not just pass or fail.
- Locally, Google Chrome must be installed. Stop any old server on port 4400, or the tests reuse it and test an old build.
- A new feature gets a test in `features.spec.ts` that uses it the way a visitor would: by role and name, with the keyboard where it matters.
- To change a budget, change `src/data/settings.ts` and say why in KHP §7.7.
- Related: [Head and SEO](head-and-seo.md) (`server.mjs`), [Frame and navigation](frame-and-navigation.md), [Search](search.md), [Contact](contact.md), [Release notes](release-notes.md), [Article engines](article-engines.md), [Entries](entries.md).

## Checks

- `pnpm test`, `pnpm test:e2e` and `pnpm test:perf`, all inside `pnpm verify`, which CI runs on every push and pull request to `main`.

## Known limits

- The browser suites need a build; `tests/support/routes.ts` fails to load without `dist/client/sitemap.xml`.
- Pages left out of the sitemap are not crawled: `/bio/resume` while `resumeAvailable` is false, and the redirects in `astro.config.mjs`.
- The contact tests stub `/api/contact`. The endpoint's validation, escaping and the Resend call are not tested.
- The beacon skips `127.0.0.1`, so analytics is never exercised. Without Supabase settings, search shows "Latest", and "Popular" is not tested.
- Only requests to the site count as failures. A failed request to Google Fonts or another host does not fail a page.
- Performance runs at 1440px only, on the machine that runs them. Numbers differ between a laptop and CI, and between Chrome and Chromium.
- The look, reduced motion, head tags and share cards are not tested. Axe checks text contrast but not images: logo visibility is `scripts/check-assets.mjs` ([Content registries](content-registries.md)).
- Axe sees only what is on the page when it runs: closed accordions, menus and drawers are not scanned open.
- `check-home-performance.mjs` limits the home page's raw HTML to 120 KB; the performance budget limits every page's HTML on the wire to 150 KB. They measure different things.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] `pnpm build`, `pnpm test:e2e` and `pnpm test:perf` ran and their output was read.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
