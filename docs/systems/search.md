# Search

Standards: KHP §1.3, §1.6, §6.1, §6.2, §8.5

## Purpose

One search box in the top bar (and the mobile menu) finds projects, posts,
tags, tech, experience and certifications. With no query it suggests the most
visited pages, or the latest entries when there is no traffic data. Where the
visit counts come from is [Analytics](analytics.md).

## Implementation

- `src/pages/search.json.ts`: prerendered at build from `loadTaxonomy` ([Content registries](content-registries.md)). One flat array of `SearchItem`: every project and post (title, URL, description, tag labels and tech names as keywords, ISO date), every role (title, org, `/bio#<slug>`), every certification (title, issuer, focus areas as extra keywords, `/bio#<slug>`), and every tag and tech something carries, with its count.
- `src/app/api/stores.ts`: `SearchItem`, `ItemType`, `PopularResponse`. `$searchIndex` (`/search.json`) and `$popular` (`/api/popular`) are nanoquery fetcher stores, gated by `$searchEnabled`, deduped for 5 minutes and cached for 30. `enableSearch()` opens the gate.
- `src/pages/api/popular.ts`: server endpoint. Calls the Supabase edge function `popular-route-segments` with the key kept on the server. Returns `{ tags, tech, blogs, projects }` lists of `{ segment, count }`, or empty lists when Supabase is not set or fails. `Cache-Control: public, max-age=15`.
- `src/app/features/search/Search.tsx`: React combobox. The input has `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"` and `aria-activedescendant`; the panel is a `role="listbox"` of `role="option"` links. Ids come from `useId`, so the top bar and mobile menu instances never share an id. Arrow keys move, Enter follows, Escape closes, outside click closes. Shows "Loading…", "No results for “…”.", or a small uppercase "Popular" or "Latest" label. Listens for an `open-search` window event. With `autoFocus` (the mobile menu opened for search) it enables search, opens and focuses its field when it mounts.
- `src/app/features/search/ranking.ts`: `TYPE_META` (label and icon per type), `parsePopular`, `popularItems` (max 6), `latestItems` (max 6), `scoreItem`.
- `src/app/features/search/Highlight.tsx`: marks matched tokens on `brand-100`.
- `src/app/features/taxonomy/TaxonomyResults.astro`: the "Search for something else" button on tag and tech pages dispatches `open-search`. From `lg` the top bar's search takes it. Below `lg`, `Navbar` hears it too and opens the mobile menu with its search focused.

## Must stay true

1. Nothing is fetched until the reader focuses the box or `open-search` fires. Pages stay idle until then.
2. Every query token must match somewhere or the item is dropped. Title exact 100, title prefix 60, word start 45, title contains 30, keyword 18, description 8. Top 8 shown.
3. An empty query shows "Popular" from real visits when any resolve to indexed items, else "Latest" posts and projects by date.
4. `/api/popular` fails soft: no Supabase or a failed call gives empty lists, and `parsePopular` skips anything that is not a list of rows. Search then falls back to "Latest".
5. The Supabase key never reaches the browser; only the endpoint uses it (KHP §8.5).
6. The index is built from `loadTaxonomy`, the same collector as the tag and tech pages and the sitemap, so search lists exactly what they do. A new entry, role, certification, tag or tech appears with the next build, with no extra step.
7. A popular `segment` resolves to an item by type and URL ending `/<segment>`, so URL shapes in the index must match the route shapes.
8. Results are links. Keyboard and pointer reach the same items, and the active item scrolls into view. Each instance has its own ids (KHP §1.6).
9. Roles and certifications link to their card on `/bio`, so a result never leaves the site.
10. `open-search` reaches a visible search box at every width.

## Before changing

- Search for a project title, a tag, a tech name, a certification and a word that matches nothing. Try it at phone width in the mobile menu.
- Run with Supabase unset and check "Latest" shows.
- Press "Search for something else" on a tag page at desktop and phone width.
- Related: [Analytics](analytics.md), [Content registries](content-registries.md), [Frame and navigation](frame-and-navigation.md).

## Checks

None. The index, ranking and combobox have no tests.

## Known limits

- When `/search.json` fails, the panel shows nothing: no error message (KHP §6.2).
- `/api/popular` has no rate limiting.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] Search was tried by keyboard and pointer, with and without popularity data.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
