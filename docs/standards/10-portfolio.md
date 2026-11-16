# 10. Portfolio

Read always, with §1. The site exists to show employers, recruiters and engineers what Kenneth can do. Every rule here serves that.

## At a glance

- Who he is and what he does is on the first screen (§10.2).
- Every claim links to its proof (§10.3).
- Every technology and tag traces to real work (§10.4).
- Work is shown by what it did and what he did, not by adjectives (§10.5).
- The site is itself a work sample: fast, accessible, polished (§10.6).
- No filler, no unbacked skills (§10.7).

## 10.1 Purpose

The readers are employers, recruiters and other engineers, often on a phone, often with a minute to spare. They want to know who he is, what he has built, and whether to get in touch. A change that helps none of them answer that needs a reason.

## 10.2 The first screen says who and what

The home hero shows his name, his current role ("Software Engineer at Alphaus Inc", from the timeline entry whose `end` is `current`), and his earned certifications as chips (`shortTitle`) that link to their cards on `/bio`. Both come from `src/data/bio/`, so they change when the data does. Keep them on the first screen at 375px and 1440px.

## 10.3 Every claim links to proof

A claim on screen leads to what backs it:

| Claim | Proof |
| ----- | ----- |
| A project | Its page, and its live app ("Visit Live Site") and code ("View Code") when they exist |
| A post | The post |
| A live app | The app, and its release notes in the project page's drawer |
| A certification | "Verify credential", the issuer's public record |
| A role | Its card on `/bio`, which opens to the tech used there: its own and that of the project or post it produced (`href`), each chip linking to its tech page |
| A technology or tag | Its page, listing everything that carries it |

A claim with no proof on the site is removed, or the proof is added first. A role card has no "Read the write-up" link: the owner asked for the tech used there instead, and each tech chip opens the page listing that work, so the proof is one click away either way.

## 10.4 Every technology and tag traces to real work

A technology or tag is registered only when a project, post, role or certification carries it. `scripts/check-taxonomy.mjs` fails the build otherwise (§7.1). The home page's technology rows list every registered technology, and each tile opens the work behind it, so each one is a skill shown, not just claimed.

## 10.5 Outcomes and role, not adjectives

Describe work by what it did and what he did in it: what was built, for whom, what changed, which part was his. "Leading the shift to a micro-frontend architecture" (his Alphaus role) says something; "passionate full-stack developer" does not. Results and numbers come from the work itself, never estimated. His own write-ups stay his (§6.6); this rule guides new lines and what to suggest to him.

## 10.6 The site is a work sample

An engineer reading the site judges his work by it. So it is fast, accessible and polished:

- `pnpm verify` passes (§9.2).
- Every page keeps the performance budget (§7.6, §7.7), and motion keeps to §5.8.
- Text meets WCAG AA contrast in both themes (§1.6, §5.3).
- Everything works by keyboard, with visible focus (§1.6).
- Reduced motion stops all motion (§5.8).
- Nothing on screen is broken, half-built or a placeholder that looks real (§1.1).

## 10.7 No filler, no unbacked skills

No line that could sit on any portfolio, and no skill, tool or claim the site cannot point to (§6.6, §10.3). If something is true but has no proof on the site yet, add the proof first.

## Checklist

- [ ] The first screen still shows his role and certifications from the data (§10.2).
- [ ] Every new claim links to its proof (§10.3).
- [ ] `pnpm check:taxonomy` passes (§10.4).
- [ ] New words describe outcomes and his part in them, not adjectives (§10.5).
- [ ] `pnpm verify` passes; contrast, keyboard and reduced motion were checked (§10.6).
- [ ] No filler and no unbacked skill was added (§10.7).
