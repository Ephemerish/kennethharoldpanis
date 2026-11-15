---
title: "Pundo"
description: "A personal budgeting app for tracking income, expenses, and transfers across your accounts. Set monthly budgets, see where your money goes over time, and keep your data yours. A side project I built and took into closed beta."
image: "pundo/logo.svg"
gallery: ["pundo/02-first-transaction.png", "pundo/04-budget-plan.png", "pundo/05-before-after.png", "pundo/07-roadmap.png"]
tags: ["fintech", "budgeting", "50-30-20", "beta", "side-project", "web-app"]
tech: ["Svelte 5", "TypeScript", "Tailwind CSS", "Drizzle ORM", "Neon", "PostgreSQL", "better-auth", "pnpm", "Vite", "Docker", "Cloud Run", "Paraglide", "shadcn", "Lottie", "ESLint", "Prettier"]
featured: true
status: "in-progress"
startDate: 2026-03-22
links:
  live: "https://pundo.kennethharoldpanis.com/"
overview:
  keyFeatures:
    - "Income, expense, and transfer transactions across multiple accounts and parent and child categories"
    - "Monthly budgets with full per-peso control, with an optional 50/30/20 needs, wants, and savings split"
    - "Transfer transactions with fees and proper savings transfer rules"
    - "Spending, donut, and monthly trend charts with daily cash flow per account"
    - "Recurring transactions, export, and a full JSON backup and restore engine"
    - "Money Manager and Pundo CSV import with a preview screen before anything is committed"
    - "Activity history that logs every create, edit, and delete, with undo on recent changes"
    - "Privacy mode that masks every amount on screen with one toggle"
    - "Partner linking with bill splitting, a shared balance view, and counter-offers"
    - "Onboarding flow with preferences and starter categories"
    - "In-app feedback system, roadmap, and contextual help links"
  challenges:
    - "Distributing budget cents across buckets so the totals always add up (largest remainder method)"
    - "Replacing a manual export flow with a real backup engine for JSON import and restore"
    - "Keeping the app feeling instant while staying cheap to run on scale-to-zero infrastructure"
    - "Splitting bills between partners with counter-offers while keeping each account's balance correct"
    - "Carrying account and category metadata cleanly through import and export"
    - "Reducing clutter on the busier screens without dropping the detail people rely on"
  team: ["Kenneth Harold Panis"]
---

A small app I built to keep track of my own money, or at least that is how it started.

![The dashboard, mid-month and lived in.](/images/pundo/01-hero.png)

## Why I built it

I had tried a lot of budgeting apps over the years, the popular ones on the Play Store and a few of those slick subscription ones that look great in screenshots, and on paper they all worked but in practice none of them really fit the way I wanted to think about my money, and after a while I would just end up frustrated with whichever one I had picked that month.

It was the same loop every time, where I would sit down one weekend with a bit of motivation and set everything up, use it for maybe a week or two, and then quietly stop, sometimes because a paywall was sitting on top of a feature I needed, sometimes because the structure of the app forced me to record things in a way that did not match how I actually spent, and sometimes because the screens were busy enough that opening the app felt like a chore, and at that point what was even the point of it, so I would give up, and a few months later I would be back in the same spot, no idea where my money had gone.

So in March I decided to stop hunting and build something for myself, because I wanted to track my spending and plan a budget the way I actually think about it.

The first time I really sat down with my own app, I logged all of my accounts, the cash in my wallet and the money in the bank, then recorded my expenses as they happened over the next few days, and when I checked the balances and they matched what I actually had, exactly, I could not get over it, because something I had built myself only days earlier was getting my real money right down to the last number, and from then on I kept opening it through the day, logging even the smallest expenses just to watch the totals stay true, and that is what turned a weekend experiment into something I wanted to keep building.

![Recording a transaction, the everyday action.](/images/pundo/02-first-transaction.png)

## A second pair of eyes

About a month in I asked my girlfriend to try it, and she had been a Money Manager person for years so honestly I figured she would humor me for a few days and then quietly switch back, but instead she stayed, moved her records across, and started using Pundo as her main app, which changed pretty much everything about how the project felt from that point onward.

![Two people using it day to day, not one.](/images/pundo/03-two-of-us.png)

Suddenly there were two people opening it every day, and her feedback hit completely different from my own, because the things I had stopped seeing thanks to having built them she would notice immediately, the things she liked I now had a real reason to make better, the loop got shorter, the questions got sharper, and development sped up in a way that would have been impossible if I were the only one looking at it.

She was the one who suggested the closed beta, and her thinking was that if it works for the two of us then maybe it can work for a small group of people we know, and their honest reactions will tell us whether Pundo has a real future or whether it is just a thing for the two of us, and I am not against that at all, because I think it could help the app a lot, and I really do hope it ends up being useful to the people who try it, the way it has been for the two of us.

## What Pundo is

Pundo is a personal budgeting app for keeping track of your own money. You log what comes in and what goes out, move balances between your accounts when you transfer money, group everything under categories you create, and set a budget at the start of each month, and from there Pundo does the running totals, measures them against the budget you set, and lays out where your money went across the weeks.

The records inside it are yours, stored under your account and not shared with anyone, because Pundo is something you use to look at your own finances and not a service that holds your money or moves it for you. It gives no financial advice, offers no credit or banking, and falls under none of the rules that real financial products carry, so nothing it shows you is meant to be read as guidance from anyone but yourself.

Pundo is also still a work in progress, with screens that are busier than I would like and corners that ask more of you than they should, and a good share of every release goes toward smoothing those down rather than adding anything new.

![The monthly budget screen, with 50/30/20 as a starting split.](/images/pundo/04-budget-plan.png)

## A history map

The repository tells most of the story in dates, and here is the rough shape of it, pulled straight from the commits.

![Early March, next to the same screen today.](/images/pundo/05-before-after.png)

### Foundations (March 22 to April 4)

- **March 22**, the very first commit went in, and login landed the same day, which set the tone for how fast things would move during this stretch.
- **March 29**, one long Sunday of building, where the sidebar, header, accounts, categories, and transactions with add, edit, and delete all came together, along with the first table component, the money and date formatters, ConfirmModal so deletes never felt accidental, a UUID-based schema so records could move between environments cleanly, settings, scroll-to-top after navigation, lazy database init, and a Dockerfile for deployment, and by the end of that day Pundo was a real app you could actually use.
- **April 3 and 4**, when the reusable Select, the ColorPicker, a custom calendar, email verification with resend, Google OAuth, the first PR template, and the first design system notes all landed together, and the project finally started looking like something deliberate rather than a pile of weekend code.

### Becoming usable (April 7 to April 19)

- **April 7 through 9**, when inline "Add new" inside dropdowns went in so you would never lose your place mid-form, transfer transactions with fees became a real thing, the MonthPicker arrived, parent and child categories were added, and the Money Manager import landed with a preview screen so you could check what would come in before committing it, and that was the version that made it possible for someone to actually move their existing records into Pundo.
- **April 18**, when filtering, the daily SpendingChart, the PatchNotesModal, the Help and Guide page, form state that survives reloads, and proper grouping for parent and child categories all shipped together in what was probably the most concentrated polish day of the whole project.
- **April 19**, when the pie and donut charts for categories went in, mobile responsiveness landed across the whole app, recurring transactions and export both shipped, and the app finally got renamed from Budget to **Pundo**, because it really did need a name by that point.

### Filling it out (April 19 to May 5)

- **April 19 to 23**, when Pundo grew past a solo tracker, with safer deletes that let you reassign records instead of orphaning them and an orphan fixer for anything already loose, and then partner linking with bill splitting, a shared balance view, and counter-offers, which is the piece that fits the two of us most directly, followed a few days later by partner spending charts and the AccountListCard.
- **April 27 and 28**, when the draggable Quick Tools calculator landed for quick math without leaving the page, activity logging went in behind every create, edit, and delete so the new History page could show and undo them, and streamed data with a Loading component and pagination kept the heavier pages feeling quick as the records piled up.
- **April 30 to May 5**, when Purge arrived for wiping an account clean when you want a fresh start, AmountInput brought expression-aware money entry so you can type 100+50 or 5000/4 straight into a field, child transactions started carrying transfer fees and loan repayment interest as their own linked rows, and Pundo got a custom logo, a unified Categories table, and breadcrumb navigation.

### Polish and identity (May 6 to May 20)

- **May 6**, when the budget planner got a draggable split bar for distributing your allocation by hand, Profile and Account settings came together with Google linking, Pundo CSV import joined the Money Manager one, and the Terms and Privacy page got its first real write-up with footer links.
- **May 7**, the development guidelines were finally written down for the first time, including the no-rounded-corners rule and the no-em-dashes rule that I am genuinely serious about, and AccountFlowCard for daily cash flow per account, cash denomination tracking, and the onboarding flow with preferences and starter categories all landed in the same window.
- **May 8**, the feedback system went live, with a submission form and history for the user and admin tools for me, the Terms and Privacy page got a proper layout, and the partner info page picked up daily account flow at the same time.
- **May 10**, privacy mode arrived with a single toggle that masks every amount on screen, savings tracking with proper transfer rules went in, and the roadmap got both a redesign and a release filter.
- **May 11 and 12**, when the largest remainder method finally fixed how budget cents distribute across buckets in a way that actually adds up, a real backup engine for JSON import and restore replaced the old manual flow, HelpLink went across the pages, activity history rows showed up, account and category metadata started carrying through import and export, and Question icons were added next to budgets so help would always be one click away.
- **May 13**, version 0.9.4 shipped and the long files finally got a cleanup and reordering pass.
- **May 20**, version 0.9.5 went out with a friendlier onboarding experience and richer account and category suggestions, and at this point I am mostly just excited to put it in front of people and hear what they think.

That is about eight weeks from the very first commit to where Pundo sits now.

## The tech, and why

I picked each piece for a practical reason: it kept the project shippable by one person, or made the app quick to use.

![Architecture sketch: Svelte 5, Drizzle, Neon, better-auth, Docker, Cloud Run.](/images/pundo/06-architecture.png)

| Choice | Why |
| ------ | --- |
| **Svelte 5** | Reactivity reads like plain JavaScript, so a feature is usually one or two files instead of the providers, hooks, and contexts the same thing took in React. |
| **TypeScript** | Catches type mistakes on save, which matters in a money app where a wrong number lands straight in someone's balance. |
| **Tailwind CSS** | Styling sits next to the markup, so the design rules (no rounding, neutral palette, sharp edges) stay consistent without a separate stylesheet to keep in sync. |
| **Drizzle ORM** | The TypeScript I write maps directly to the SQL it runs, with plain migration files in the repo, so there is no guessing what hits the database. |
| **Neon** | Serverless Postgres that scales to zero, with branching to test against a copy of production data without risking the real one. |
| **PostgreSQL** | A relational database with real constraints and transactions, which the data needs since accounts, categories, and transfers are all related. |
| **better-auth** | Sessions, bcrypt password hashing, and Google OAuth running in my own codebase, with no third-party auth provider in the login flow. |
| **pnpm and Vite** | Fast installs from a shared package store, and fast dev reloads from Vite under SvelteKit. |
| **Docker** | One image that runs the same on my laptop, staging, and production. |
| **Cloud Run** | Deploys the container and scales from zero up to whatever traffic shows up, so it costs almost nothing at the current size. |
| **Paraglide** | Type-safe translations compiled into the bundle, with English and Tagalog both maintained in the codebase. |
| **shadcn-svelte** | Components copied into the repo on top of bits-ui, so every primitive matches the sharp-edged look without fighting upstream defaults. |
| **Lottie** | Lightweight vector animations for a few spots like empty states and a finished import. |

The common thread is that each piece is small enough to understand on its own and stays out of the way once it is set up, which leaves most of my time for the product instead of the tooling around it.

## Where Pundo is headed

This is a beta, and things will keep changing, with some parts getting better, some getting removed, and some getting replaced entirely with something that fits better, and the current version still lives on the web and depends on the network being there to do anything useful.

If the closed beta tells us that Pundo has merit beyond the two of us, the next chapter is pretty clear, and it has three pieces that all matter:

1. **Offline first**, where your data lives on your device, the app works on the bus and during a brownout and with no signal, and sync becomes a feature you turn on when you want it rather than a requirement you cannot escape.
2. **A more polished release**, with smoother onboarding, sharper visual details across the whole app, and far fewer rough edges around the imports and exports and other things that touch the boundary of the app.
3. **Open source**, where the code is readable by anyone, runnable by anyone, and forkable by anyone, because a budgeting tool that asks you to trust it with every peso you make should be something you can verify yourself if you ever want to.

That is the direction we want to go, and whether we actually get there depends on what the next few people who try Pundo end up telling us.

![The in-app roadmap, where offline-first and open-source are tracked.](/images/pundo/07-roadmap.png)

## An invitation

If you are reading this, you are probably someone we know already, or someone whose opinion we trust enough to ask for, and we would really like you to try Pundo for a while.

A few honest things you should know going in, because we would rather over-share now than have you find out later. This is a beta, so you will run into rough edges, some screens are still being shaped, some features are newer than they look, and things might move around between versions as we learn from how people actually use the app. Your data inside Pundo is real, and we have backups and exports and a privacy mode that masks every number on screen with one click, but we would still ask you to keep your own export every now and then, the way you would with any early tool, just to be safe.

The most useful thing you can give us is honest feedback, whether that is what confused you, or what you wanted to do but could not figure out how, or what felt good in a way you did not expect, and even small notes help a lot, and there is a feedback form built right into the app so you do not need to message us to send something through. We are not asking for anything in return either, no payment and no subscription and no upsell quietly hiding behind a feature, just your time and your honest reactions to what you see.

If it ends up working for you the way it has worked for the two of us, you might find yourself keeping up with it day to day, which is really all we are hoping for. And if Pundo grows past the two of us, we want to keep it the way it started, calm and honest and built for the person looking at the numbers, not for anyone else.

![Onboarding, the first screen a new tester sees.](/images/pundo/08-welcome.png)

Thanks for trying it, and welcome to Pundo.

You can try it live at [pundo.kennethharoldpanis.com](https://pundo.kennethharoldpanis.com/).
