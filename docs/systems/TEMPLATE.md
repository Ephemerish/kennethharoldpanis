# System name

Standards: KHP §n.n, §n.n

## Purpose

Say what the system does for a reader of the site and where its boundary is.
Name the system that owns the behaviour just outside that boundary.

## Implementation

Link the real routes, components, modules, scripts and generated files that
make up the system. Check that every path exists and owns what is described.

## Must stay true

List the behaviours, relationships and failure handling a change must keep.
Say why losing each one would hurt a reader or break another system. Cover the
edge cases that matter, such as a view-transition navigation, light and dark,
reduced motion, a phone-width screen, or a missing environment variable. Keep
known gaps out of this list; they go under Known limits.

## Before changing

Link the related contracts and name the cases to try by hand: the pages to
open, the themes and widths to check, and the content that exercises the edge
cases. If the system writes a generated file, say how to regenerate it.

## Checks

Link the scripts that guard the system and give the commands to run them
(`pnpm verify` runs astro check, check:tokens, check:composition, test, build,
check:output, test:e2e and test:perf).
Say "None" when nothing automated covers the system. Do not claim a page was
checked by eye because a script passed.

## Known limits

Record real gaps, unsupported cases and verification boundaries, each with its
consequence. Remove a gap only when the code and a check support it.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] The relevant checks ran and their output was read.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
