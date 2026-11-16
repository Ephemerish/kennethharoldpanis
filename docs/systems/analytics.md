# Analytics

Standards: KHP §8.5, §6.2

## Purpose

Records one page view per page, including view-transition navigations, in a
Supabase table. The same project's edge function turns those views into the
"Popular" suggestions in [Search](search.md). Analytics is telemetry: when it
is not set up or fails, the site works the same.

## Implementation

- `src/app/features/analytics/Analytics.astro`: inline script in `MainLayout`'s body. A `window.__khpAnalytics` guard makes it listen once, since inline scripts run again after a swap. Skips `localhost`, `127.0.0.1`, `0.0.0.0`, `::1` and `*.local`. On each `astro:page-load` it waits 100 ms, then POSTs JSON to `/api/analytics` with `keepalive`: visitor id (`localStorage`), session id (`sessionStorage`), path, referrer, user agent, screen and viewport size, pixel ratio, language, time zone, colour scheme, connection type, touch, and navigation load time. Errors are ignored.
- `src/pages/api/analytics.ts`: server endpoint (the site's `output` is `server` and the file sets no `prerender`). If `supabase` is null it answers 200 `{ skipped: true }`. Otherwise it inserts one row into `analytics` with snake_case columns. A Supabase error answers 500 "Not recorded"; anything else 500 "Internal Server Error". Both log on the server.
- `src/app/api/supabase.ts`: reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` (or `SUPABASE_KEY`) from `import.meta.env`, then `process.env`. Exports `null` when either is missing, instead of letting `createClient` throw at import.
- `src/pages/api/popular.ts`: reads the same variables and calls the edge function `popular-route-segments`. See [Search](search.md).
- `scripts/setup-analytics.sql`: creates `public.analytics`, enables row level security, allows insert for everyone and select for authenticated users.

## Must stay true

1. The beacon never blocks the page, never throws, and never logs in the browser.
2. One view per page load and per view-transition navigation. The run-once guard stops double listeners after a swap.
3. Local hosts send nothing, so development does not pollute the data.
4. Missing Supabase settings never break a route. `supabase.ts` exports `null`; callers check it (KHP §6.2).
5. The Supabase key stays on the server. The browser talks only to `/api/analytics` and `/api/popular` (KHP §8.5).
6. Error answers say little: "Not recorded" or "Internal Server Error", never the database error.
7. The visitor id survives storage being blocked: a `session_<time>` id is used instead.

## Before changing

- Deploy to a non-local host (or remove the host check locally) and check one row per navigation, including a view-transition one.
- Run with Supabase unset and check pages and `/api/analytics` still answer.
- Check the table columns match the insert before you add a field.
- Related: [Search](search.md), [Frame and navigation](frame-and-navigation.md).

## Checks

None. No test covers the beacon, the endpoint or the table. The browser tests run on `127.0.0.1`, which the beacon skips ([Testing](testing.md)).

## Known limits

- The endpoint does not validate the body. Any JSON is inserted as given.
- No rate limiting on `/api/analytics`, and the insert policy is `with check (true)`, so anyone with the anon key can write rows.
- The `popular-route-segments` edge function is not in this repo.
- The Supabase variable lookup is written twice, in `supabase.ts` and `popular.ts`.
- The endpoint logs "Supabase error:" and "Analytics error:" without the `[name]` prefix KHP §8.5 asks for.
- No consent notice or opt-out; a visitor id is kept in `localStorage`.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] A view was recorded, and a run without Supabase was tried.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
