# 9. Workflow and done

## At a glance

- Read the rules and the system before changing (§9.1).
- `pnpm verify` passes (§9.2).
- The change is seen on screen in both themes and both sizes (§9.3).
- Done means every checklist is ticked or the gap is stated (§9.4).
- A wrong rule is changed in the same change, with its reason (§9.5).

## 9.1 Before a change

Read [AGENTS.md](../../AGENTS.md), this standard's files for the task, the system's document in [docs/systems/](../systems/), and the components in [lib/khp-ui/AGENTS.md](../../lib/khp-ui/AGENTS.md). List what the change touches (§1.2). If it changes what a reader sees, get the owner's say first (§6.6).

## 9.2 Verify

`pnpm verify` runs, in order: `astro check` (types, 0 errors and 0 warnings), `check:tokens` (§5.1), `test`, `build` (which also checks the taxonomy and makes cover backdrops), and `check:output` (the home page keeps its performance budget, the pretext article keeps its live cover, release controls keep their shape). CI runs the same. A failure is fixed, never skipped.

## 9.3 Look at it

Run the built site (`pnpm build && node dist/server/entry.mjs`, or `pnpm dev`) and look at every page the change touches, in light and dark, at 375px and 1440px. Check keyboard focus and the empty and error states, and reduced motion when the change moves. Say in the report what was looked at and what wasn't.

## 9.4 Done means

- `pnpm verify` passes.
- Every checklist in the standards files read for the task is ticked.
- The system documents and `docs/systems.md` match the code.
- Loose ends found were removed or named (§1.5).
- What wasn't verified is said.

## 9.5 Changing a standard

If a rule is wrong, change it in the same change as the code, say why in the rule (*Why:* …), and keep its number. A removed rule leaves its number with a line saying why it went. Record a rule taken from Ebb or Pundo, or departed from, in [ebb-port.md](ebb-port.md).
