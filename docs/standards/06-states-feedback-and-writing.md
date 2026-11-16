# 6. States, feedback and writing

## At a glance

- Loading says so; nothing pretends to be loaded (§6.1).
- Errors say what happened and what to do, in plain words (§6.2).
- An empty list says so (§6.3).
- A toast confirms an action the reader took (§6.4).
- Dates go through one formatter (§6.5).
- The owner's words stay; generic filler is replaced by facts from the data (§6.6).

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

A label never claims what the data doesn't say. "Featured" appears only on a project marked `featured` or a certification marked `highlighted`. A featured card's lead pill says "Featured" for such a project, "Latest post" for the newest post, and nothing for any other project.

*Why:* on November 15, 2026 the owner rejected a redesign that restyled the site and rewrote its words ("don't make shit up"). Filler is made up too. A line drawn from the data can't be, and it tells a reader something about him.

## 6.7 Word budgets

Removed: the owner's copy keeps its own length; new words follow §6.6.

## 6.8 Words added with the owner's say

Match the words around them: the same case as their neighbours (Title Case buttons, sentence-case card text) and the same tone. Draw them from the data (§6.6). No em dashes.

## 6.9 Designed, not generated

Removed: the owner's visual style keeps uppercase labels, subtitles under titles, gradient text, gradient bars under headings, "Featured" and status pills, card shadows and centred headers. §3 to §5 describe that style.

## Checklist

- [ ] Every state the change can be in has its words (§6.1 to §6.3).
- [ ] Dates go through `format.ts` (§6.5).
- [ ] No owner copy was changed, and any new visible thing has his say (§6.6).
- [ ] New lines are facts from the data, and labels claim only what the data says (§6.6).
