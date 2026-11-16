# Glossary (internal)

What we call things on this site, in code, in docs and on screen. One thing, one word (KHP §1.3, §6.7). Read it before naming anything; add a new term here in the same change that introduces it. Internal only: it is not published.

`pnpm check:copy` reads the **Not** column of the first table and fails when one of those words appears in text a reader sees (a quoted string with a space in it, or text between tags) in the templates, the UI library or `src/data/`. Code names (`ArticleLayout`, `AnyEntry`) are not checked; they are named in the second table.

## Words on screen

| Say | Means | Not |
| --- | ----- | --- |
| tech | A named tool with a logo: a language, framework, library, cloud service, platform or device (React, Go, Amazon S3, LoRa). Shown as one flat row of chips, in the data's order, on projects, posts, roles and certifications alike. Registered in `src/data/taxonomy/technologies.ts`; every one is carried by a project, post, role or certification. The plural is "tech"; "technologies" only in the owner's heading "Technologies I Work With" | skill, skills, tech stack, tools used, focus areas, categories |
| tag | A theme that groups two or more items across tools (Web App, Thesis). Never a tool's name. Registered in `src/data/taxonomy/tags.ts` | topic, topics, keyword |
| project | A thing he built, with its own page under `/projects` | case study, portfolio piece, work sample |
| post | One piece of his writing, under `/blogs`. The section is "Blog" (nav: "Blogs", his word) | article, write-up, write-ups, writeup |
| role | A job on his timeline (Software Engineer at Alphaus) | job, position |
| school | A place he studied, on the same timeline as roles. A timeline entry tagged `education` | education entry |
| experience | The section on `/bio` that holds roles and schools ("My Experience") | work history, career |
| certification | An exam he passed, with its badge and public credential | cert, certs, certificate |
| badge | The issuer's image for a certification | logo (for a certification) |
| credential | The issuer's public record of a certification ("Verify credential") | certificate link |
| release notes | What changed in one of his live apps, mirrored from the app | patch notes, changelog |
| live app | An app of his that people use today (Pundo, Pidada) | live product |
| Current | A role still held: its years read "2024 – Current" | Present, Now |

## Names in code and docs

| Name | Means |
| ---- | ----- |
| entry | A project or a post (`AnyEntry`, `EntryCard`). Never shown to readers; on screen say "project" or "post" |
| bio record | A role, school or certification (`BioRecord`), shown on tag and tech pages under "From my bio" |
| timeline entry | One role or school in `src/data/bio/experience.ts` (`TimelineEntry`) |
| taxonomy | Tags and tech together, and `loadTaxonomy`, which collects everything that carries them |
| card | A bordered surface (`Card`). A card that opens is an `AccordionItem` |
| chip | A small bordered label (`Chip`): a tech, a tag or a status |
| label | The small uppercase line naming a group (`Label`) |
| subtitle | A fact from the data under a page title (a count, a latest release). Never written words: no taglines (§6.7) |
| marquee | The home page's two draggable rows of tech tiles (`Marquee`) |
| article engine | How a post's body renders (`prose`, `pretext`); see docs/systems/article-engines.md |

## Adding a term

1. Look here first. If the thing has a word, use it.
2. If not, add a row with the word, what it means, and the words it replaces (the **Not** column), then use it.
3. Run `pnpm check:copy`.

There are two ways to sort things, and only two: **tech** and **tags** (KHP §1.7). Anything else ("categories", "focus areas", a cloud's "services" list) was tried and removed because it didn't hold for every item.

*Why:* on November 16, 2026 the owner asked for one set of names, used everywhere and mandatory, after the site called the same things "write-ups", "posts" and "blogs", and "focus areas", "tech" and "tags".
