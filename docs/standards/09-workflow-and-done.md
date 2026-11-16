# 9. Workflow and done

## At a glance

- Read the rules and the system before changing (§9.1).
- `pnpm verify` passes, the browser tests included (§9.2).
- The change is seen on screen in both themes and both sizes (§9.3).
- Done means every checklist is ticked or the gap is stated (§9.4).
- A wrong rule is changed in the same change, with its reason (§9.5).

## 9.1 Before a change

Read [AGENTS.md](../../AGENTS.md), this standard's files for the task, the system's document in [docs/systems/](../systems/), and the components in [lib/khp-ui/AGENTS.md](../../lib/khp-ui/AGENTS.md). List what the change touches (§1.2). If it changes what a reader sees, get the owner's say first (§6.6).

## 9.2 Verify

`pnpm verify` runs, in order:

1. `check`: `astro check` (types, 0 errors and 0 warnings).
2. `check:tokens`: theme colours, corners, layers, and no text below AA contrast (§5.1, §5.3).
3. `check:composition`: templates built from components (§4.9).
4. `check:assets`: every technology logo visible in light and dark; badges and organisation logos present (§7.1).
5. `test`: the unit tests in `tests/unit/`.
6. `build`: the taxonomy check, the cover backdrops, `astro build`, then the compressed copies (§7.7).
7. `check:output`: the home page keeps its budget, the pretext article keeps its live cover, release controls keep their shape (§7.6).
8. `test:e2e`: every page in the sitemap at 1440px and 375px, every interactive feature, and an axe accessibility scan of every page in light and dark, in a real browser.
9. `test:perf`: the performance budget (§7.7).

The browser tests run against the built site served by `server.mjs`, so they need step 6 first. CI installs Chromium and runs the same `pnpm verify`. A failure is fixed, never skipped. See [testing](../systems/testing.md).

## 9.3 Look at it

Run the built site (`pnpm build && pnpm preview`, or `pnpm dev`) and look at every page the change touches, in light and dark, at 375px and 1440px. Check keyboard focus and the empty and error states, and reduced motion when the change moves. Say in the report what was looked at and what wasn't.

The browser tests replace the manual check for what they cover: status, one `h1`, sideways scroll, image `alt`, script errors and failed requests on every page, links, text contrast and accessible names in both themes, and the features listed in [testing](../systems/testing.md). They do not judge the look. Colour choice, spacing, how dark mode reads, and reduced motion are still checked by eye.

## 9.4 Done means

- `pnpm verify` passes.
- Every checklist in the standards files read for the task is ticked.
- The system documents and `docs/systems.md` match the code.
- Loose ends found were removed or named (§1.5).
- What wasn't verified is said.

## 9.5 Changing a standard

If a rule is wrong, change it in the same change as the code, say why in the rule (*Why:* …), and keep its number. A removed rule leaves its number with a line saying why it went. Record a rule taken from Ebb or Pundo, or departed from, in [ebb-port.md](ebb-port.md).
