# 8. Code and structure

## At a glance

- Code lives where [docs/structure.md](../structure.md) says: as close as it can to what uses it (§8.1).
- One main thing per file; split past about 250 lines (§8.2).
- Imports use `@ui`, `@app/*` and `@data/*` (§8.3).
- Astro by default; React only for what must run in the browser (§8.4).
- Endpoints validate, escape, and answer in words (§8.5).
- Comments say why, not what (§8.6).

## 8.1 Folders

The full guide is [docs/structure.md](../structure.md). In short: `src/pages/` holds thin route files only; `src/app/pages/<url>/` holds each page's own code; `src/app/features/` holds a use case two or more pages share; `src/app/shared/` holds the brand icons and the email link; `src/app/layout/` the frame; `src/app/calc/` pure functions; `src/app/api/` the browser's calls; `lib/khp-ui/` the theme and generic UI that know nothing about this site, grouped as `layout`, `type`, `media`, `surface`, `form` and `overlay`.

Everything that is content, data or a tunable lives in `src/data/`: `site.ts` (the site's identity and navigation), `settings.ts` (list sizes, contact limits, the performance budget), `content/` (the markdown), `bio/`, `taxonomy/`, `apps/` and `contact/`. Code reads it; it holds no rendering. `tests/` holds the unit, end-to-end and performance tests, and `server.mjs` at the root is the production server. A page never imports another page's folder: that means the code should move up.

*Why:* data was spread over `src/content/`, `src/app/data/`, `src/app/shared/site.ts` and a page's `limits.ts`. One folder means one place to look to change what the site says or how many of a thing it shows.

## 8.2 Files

A file holds one main thing and is named after it: a component in PascalCase, a module in kebab or camel case. Split when a file passes about 250 lines, holds two components with their own jobs, or mixes view and calculation (calculation goes to `model.ts` beside it). Generated files (`src/data/apps/patch-notes/releases.ts`) are exempt and never edited by hand.

## 8.3 Imports

`@ui` for the component library, `@ui/components/<group>/<Name>` from React islands (the barrel also exports `.astro` files, which islands can't load), `@app/...` for the app, `@data/...` for `src/data/`. Relative imports only within one folder. Tests and scripts, which run outside Astro, import by relative path.

## 8.4 Astro and React

A component is `.astro` unless it needs state or events in the browser. A React island hydrates as late as it can: `client:idle` for the top bar, toasts and the article image viewer; `client:visible` for the gallery and live covers on cards, which paint a still first; `client:load` for the pretext article's own cover and body, and for the contact subject Select, which must be ready before the reader reaches it. A small behaviour on server HTML (the contact form, the email link, the `Drawer`, the `Marquee`'s pause, collapsible sections) is a `<script>` run on `astro:page-load` and guarded so it wires once per page.

## 8.5 Server endpoints

`src/pages/api/*.ts` is the server. An endpoint validates every field (presence, format, length, allowed values), escapes anything it puts into HTML, logs the detail with a `[name]` prefix, and answers with a short plain message. It never returns a stack trace or a secret's whereabouts. Secrets come from environment variables and are never logged.

## 8.6 Comments

A file starts with a short block saying what it is for and which system or rule it belongs to. Inside, a comment explains a reason the code can't show (why UTC, why a guard). No comment restates the line below it. No `console.log` left in client code.

## Checklist

- [ ] Code is at the lowest folder that covers its users (§8.1).
- [ ] No file grew past about 250 lines without a reason (§8.2).
- [ ] Islands hydrate as late as they can (§8.4).
- [ ] Endpoints validate, escape and answer in words (§8.5).
