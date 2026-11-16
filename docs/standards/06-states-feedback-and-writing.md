# 6. States, feedback and writing

## At a glance

- Loading says so; nothing pretends to be loaded (§6.1).
- Errors say what happened and what to do, in plain words (§6.2).
- An empty list says so (§6.3).
- A toast confirms an action the reader took (§6.4).
- Dates go through one formatter (§6.5).
- The owner's words stay; generic filler is replaced by facts from the data (§6.6).
- A line says what, never how; no taglines under titles, only facts from the data; a label is 1 to 3 words; `pnpm check:copy` enforces it (§6.7).

## 6.1 Loading

Pages are prerendered, so most content never loads. Search fetches its index when the box is first focused and shows "Loading…" in its panel until it arrives.

## 6.2 Errors

An error says what happened and what to do next. The contact form's failure toast reads "Failed to send message" with "Please try again or email me directly." An endpoint never answers with a stack trace, a status code or an internal name; it logs the detail and answers with a short message. A form keeps what the reader typed when a send fails.

## 6.3 Empty states

An empty list says so in the owner's words: the blog's "No blog posts yet", the resume's "Resume coming soon", the 404 page. Each has a way on (§2.5).

## 6.4 Toasts

`Toaster` (sonner) at the top right of the contact page confirms a message was sent or says why it failed, with an icon and words. Never for something the reader didn't do.

## 6.5 Dates and numbers

Content dates go through `formatDate` in `src/app/calc/format.ts`: "March 29, 2026", in UTC, so a date never shifts by a day with the server's time zone. A `<time>` carries the ISO day in `datetime`, from `isoDay`. Release dates go through `formatReleaseDate`, which builds the day in UTC too. Reading time is `readTime`: "6 min read". The bio timeline shows its years as written in `experience.ts`, joined with an en dash ("2020 – 2024", "2024 – Current") by `yearsLabel` in `experience.ts`, read by `RoleItem` and `BioRecordCard`. A project's timeline in its Overview card uses its own month format ("Mar 2024 – Dec 2024").

## 6.6 The owner's words and look

The owner's own words stay as he wrote them, including their case and punctuation: the hero's paragraphs about himself, his posts and project write-ups, his headings and buttons. A new visible element or section needs his say before it is built.

Generic filler is not his voice. A line that could sit on any portfolio ("Passionate about building great things") is replaced by a fact from the site's data: a role, a project, a certification, what a page lists. The home page's projects subtitle names the LoRa network for small fishing boats; the technologies subtitle says each tile opens the work that used it. Every claim on screen traces to the data or the content (§1.1, §10.3).

A label never claims what the data doesn't say. "Featured" appears only on a project marked `featured`. A featured card's lead pill says "Featured" for such a project, "Latest post" for the newest post, and nothing for any other project.

*Why:* on November 15, 2026 the owner rejected a redesign that restyled the site and rewrote its words ("don't make shit up"). Filler is made up too. A line drawn from the data can't be, and it tells a reader something about him.

## 6.7 Word budgets, and what, never how

Ported from Ebb §8.1 and §8.2 and Pundo §13. The owner's own copy keeps its length (§6.6); every line added after him follows this.

| Text | Budget |
| ---- | ------ |
| Page title, section title, label, button, tab | 1 to 3 words beside the title's own prefix ("My Experience", "Built with", "Verify credential") |
| Hint, empty-state line, toast | One sentence, at most 15 words |

**What, never how.** A line says what something is or holds, never how to work the page: no "click", "open one", "hover", "scroll", "check out", "take a look", "feel free". If a reader needs to be told how, the page is wrong; fix the page. A cue that is part of the control (a caret on an accordion, an arrow on a link) does that job without words.

**No taglines.** A page or section title stands alone. Nothing written goes under it: no tagline, no summary of what the section holds, no invitation ("From a LoRa network for small fishing boats to the apps I build and run", "Notes from building things", "Open to roles, freelance work and collaborations"). The content below says it. A subtitle exists only to state a fact computed from the data: a tag or tech page's count ("2 projects and 1 role"), a project's latest release ("Latest: v1.4 · March 2, 2026").

**Words.** No em dashes, and no hyphen standing in for one. No full stop after a title, label or button; sentences keep theirs. Sentence case in card text, Title Case where the owner uses it (§6.8). A middle dot may join two short facts in a secondary row ("Bohol Island State University · 2020 – 2024"), never in a title, label or button (Pundo §13.4). No filler ("seamless", "passionate", "elevate", "unlock", "cutting-edge", "robust", "powerful", "my journey").

`pnpm check:copy` (`scripts/check-copy.mjs`) fails on a how-to line, any `subtitle` written as words in a template (only a value from the data passes), a label over 3 words, a title with a full stop, filler, an em dash or an emoji, anywhere in the templates, the UI library or `src/data/` except his articles and the apps' release notes.

*Why:* on November 16, 2026 the owner called "Open one to see the tech I used there" stupid and asked for a standard that stops lines like it, copied from Ebb and Pundo. Ebb and Pundo enforce their budgets by review; this site enforces them with a script, because the same kind of line ("Each one opens the projects, posts and roles where I used it") had already slipped into two subtitles. The same day he removed taglines altogether ("I don't want this anymore"): every written subtitle went, his own included, and tags lost their descriptions, which existed only to fill one.

## 6.8 Words added with the owner's say

Match the words around them: the same case as their neighbours (Title Case buttons, sentence-case card text) and the same tone. Draw them from the data (§6.6). No em dashes.

## 6.9 Designed, not generated

The giveaways of a generated page, ported from Ebb §1.16.3, and this site's line on each, are in §5.9. The words in it follow §6.7.

## Checklist

- [ ] Every state the change can be in has its words (§6.1 to §6.3).
- [ ] Dates go through `format.ts` (§6.5).
- [ ] No owner copy was changed, and any new visible thing has his say (§6.6).
- [ ] New lines are facts from the data, and labels claim only what the data says (§6.6).
- [ ] No line tells the reader how to use the page; budgets met; `pnpm check:copy` passes (§6.7).
