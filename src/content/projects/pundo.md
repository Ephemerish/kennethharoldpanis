---
title: "Pundo"
description: "A personal budgeting app for Filipinos who want clarity over their money without the complexity other apps pile on. You record income, expenses, and transfers, set monthly budgets, and track your spending over time, with the data staying yours. This is the story of why I built it, how it grew from a one-person weekend project into a closed beta, and where it is headed."
image: "pundo/01-hero.png"
gallery: ["pundo/02-first-transaction.png", "pundo/04-budget-plan.png", "pundo/05-before-after.png", "pundo/07-roadmap.png"]
tags: ["Personal Finance", "Budgeting", "50/30/20", "Svelte 5", "Beta", "Side Project", "Web App", "Fintech"]
technologies: ["Svelte 5", "TypeScript", "Tailwind CSS", "Drizzle ORM", "Neon", "PostgreSQL", "better-auth", "Bun", "Docker", "Cloud Run", "Paraglide", "shadcn/ui", "Lottie"]
category: "web"
demoUrl: ""
videoUrl: ""
githubUrl: ""
featured: true
status: "in-progress"
startDate: 2025-03-22
keyFeatures:
  - "Monthly budgets with full per-peso control, with an optional 50/30/20 needs, wants, and savings split"
  - "Income, expense, and transfer transactions across multiple accounts and parent and child categories"
  - "Transfer transactions with fees and proper savings transfer rules"
  - "Money Manager import with a preview screen before anything is committed"
  - "Privacy mode that masks every amount on screen with one toggle"
  - "Spending, pie, and donut charts with daily cash flow per account"
  - "Recurring transactions, export, and a full JSON backup and restore engine"
  - "Onboarding flow with preferences and starter categories"
  - "In-app feedback system, roadmap, and contextual help links"
challenges:
  - "Distributing budget cents across buckets so the totals always add up (largest remainder method)"
  - "Replacing a manual export flow with a real backup engine for JSON import and restore"
  - "Keeping the app feeling instant while staying cheap to run on scale-to-zero infrastructure"
  - "Carrying account and category metadata cleanly through import and export"
  - "Closing the gap between a busy dashboard and a notebook that quietly does the math"
team: ["Kenneth Harold Panis"]
---

A small app for thinking about money clearly, or at least trying to.

![The dashboard, mid-month and lived in.](/images/pundo/01-hero.png)

## Why I built it

I had tried a lot of budgeting apps over the years, the popular ones on the Play Store and a few of those slick subscription ones that look great in screenshots, and on paper they all worked but in practice none of them really fit the way I wanted to think about my money, and after a while I would just end up frustrated with whichever one I had picked that month.

It was the same loop every time, where I would sit down one weekend with a bit of motivation and set everything up, use it for maybe a week or two, and then quietly stop, sometimes because a paywall was sitting on top of a feature I needed, sometimes because the structure of the app forced me to record things in a way that did not match how I actually spent, and sometimes because the screens were busy enough that opening the app felt like a chore, and at that point what was even the point of it, so I would give up, and a few months later I would be back in the same spot, no idea where my money had gone.

So in March I decided to stop hunting and just build the thing I wished existed, not for an audience and not as some side project I was hoping to launch one day, but for me, because I wanted to track my own spending, plan a budget the way I actually think about it, and look at my numbers without anything getting in the way.

The first time I added a real transaction in my own app and watched it land in the table I had built that same morning, something clicked in a way that is honestly hard to explain, because suddenly I was excited to open the app, excited to record, excited to look at the numbers at the end of the day, not because I had to but because I wanted to see what the day looked like, and any time something felt off I could just go fix it right then, and that feeling is most of what kept this whole project moving.

![Recording a transaction, the everyday action.](/images/pundo/02-first-transaction.png)

## A second pair of eyes

About a month in I asked my girlfriend to try it, and she had been a Money Manager person for years so honestly I figured she would humor me for a few days and then quietly switch back, but instead she stayed, moved her records across, and started using Pundo as her main app, which changed pretty much everything about how the project felt from that point onward.

![Two people using it day to day, not one.](/images/pundo/03-two-of-us.png)

Suddenly there were two people opening it every day, and her feedback hit completely different from my own, because the things I had stopped seeing thanks to having built them she would notice immediately, the things she liked I now had a real reason to make better, the loop got shorter, the questions got sharper, and development sped up in a way that would have been impossible if I were the only one looking at it.

She was the one who suggested the closed beta, and her thinking was simple, that if it works for the two of us then maybe it can work for a small group of people we know, and their honest reactions will tell us whether Pundo has a real future or whether it is just a thing for the two of us, and I am not against that at all, because I think it could help the app a lot, and I really do hope it ends up helping the people who try it the way it has helped both of us, that little pull to record at the end of the day, that small bit of excitement to look at your own numbers and see the shape of your month.

## What Pundo is, basically

Pundo is a personal budgeting app, the kind you open to record an income, an expense, or a transfer, set a monthly budget against, and watch your spending take shape over time, and the data you put into it belongs to you and nobody else, because Pundo is a tool you use to think about your own money, not a financial service sitting between you and it.

Pundo does not give financial advice, it does not offer credit or banking or anything that lives under that regulated umbrella, and nothing on any screen in the app should be read as professional guidance, because the whole point is that the person looking at the numbers is you, and Pundo is just the quiet thing helping you see them clearly.

Simple and easy is what I am building toward, and I want to be honest that Pundo is not there yet, since there is still clutter on certain screens and parts of the app that take more thinking than they should, but the picture in my head is for it to feel less like a dashboard fighting for your attention and more like a notebook that quietly does the math for you while you think, and most of what ships from one version to the next is really just slowly closing the gap between where Pundo is now and that picture.

![The monthly budget screen, with 50/30/20 as a starting split.](/images/pundo/04-budget-plan.png)

## A history map

The repository tells most of the story in dates, and here is the rough shape of it, pulled straight from the commits.

![Early March, next to the same screen today.](/images/pundo/05-before-after.png)

### Foundations (March 22 to early April)

- **March 22**, the very first commit went in, and login landed the same day, which set the tone for how fast things would move during this stretch.
- **March 29**, one long Sunday of building, where the sidebar, header, accounts, categories, and transactions with add, edit, and delete all came together, along with the first table component, the money and date formatters, ConfirmModal so deletes never felt accidental, a UUID-based schema so records could move between environments cleanly, settings, scroll-to-top after navigation, lazy database init, and a Dockerfile for deployment, and by the end of that day Pundo was a real app you could actually use.
- **April 3 and 4**, when the reusable Select, the ColorPicker, a custom calendar, email verification with resend, Google OAuth, the first PR template, and the first design system notes all landed together, and the project finally started looking like something deliberate rather than a pile of weekend code.

### Becoming usable (April 7 to April 19)

- **April 7 through 9**, when inline "Add new" inside dropdowns went in so you would never lose your place mid-form, transfer transactions with fees became a real thing, the MonthPicker arrived, parent and child categories were added, and the Money Manager import landed with a preview screen so nothing ever surprises you, and that was the version that made it possible for someone to actually move their financial life into Pundo.
- **April 18**, when filtering, the daily SpendingChart, the PatchNotesModal, the Help and Guide page, form state that survives reloads, and proper grouping for parent and child categories all shipped together in what was probably the most concentrated polish day of the whole project.
- **April 19**, when the pie and donut charts for categories went in, mobile responsiveness landed across the whole app, recurring transactions and export both shipped, and the app finally got renamed from Budget to **Pundo**, because it really did need a name by that point.

### Polish and identity (May 6 to May 13)

- **May 7**, the development guidelines were finally written down for the first time, including the no-rounded-corners rule and the no-em-dashes rule that I am genuinely serious about, and AccountFlowCard for daily cash flow per account, cash denomination tracking, and the onboarding flow with preferences and starter categories all landed in the same window.
- **May 8**, the feedback system went live, with a submission form and history for the user and admin tools for me, the Terms and Privacy page got a proper layout, and the partner info page came together at the same time.
- **May 10**, privacy mode arrived with a single toggle that masks every amount on screen, savings tracking with proper transfer rules went in, and the roadmap got both a redesign and a release filter.
- **May 11 and 12**, when the largest remainder method finally fixed how budget cents distribute across buckets in a way that actually adds up, a real backup engine for JSON import and restore replaced the old manual flow, HelpLink went across the pages, activity history showed up, account and category metadata started carrying through import and export, and Question icons were added next to budgets so help would always be one click away.
- **May 13**, cleanup and reordering of long files, branch 0.9.5, almost at 1.0, which is honestly kind of wild to type out.

That is roughly seven weeks from the very first commit to where Pundo sits now.

## The tech, and why

I did not pick any of this to look impressive on a resume, I picked it because each piece either kept the project shippable as a one-person thing, or made the app feel quicker to use than the apps I had already given up on, or moved a whole category of bugs from "you find them in production" down to "the compiler tells you before you commit," and the best pieces did all three at once.

![Architecture sketch: Svelte 5, Drizzle, Neon, better-auth, Docker, Cloud Run.](/images/pundo/06-architecture.png)

| Choice | Why |
| ------ | --- |
| **Svelte 5** | I had spent years in React and the muscle memory of useState and useEffect and useMemo had become a kind of background noise I had stopped noticing, but the first afternoon in Svelte 5 something quietly clicked, because the reactive bits read like normal JavaScript and a feature ended up being one folder of one or two files instead of a small constellation of providers, hooks, and contexts spread across the project. |
| **TypeScript** | A money app is a place where small mistakes feel huge, because a number being a string for one render is a bug a user will see in their balance, and a compiler that catches that kind of thing on save means I get to ship a feature in the afternoon instead of spending the next morning chasing a bug report about a peso that quietly disappeared. |
| **Tailwind CSS** | I did not want a separate stylesheet to keep in sync with the markup, and I did not want to invent a hundred class names that all describe roughly the same kind of card, so Tailwind lets the spacing and color sit right next to the element they belong to, which means the design rules of Pundo (no rounding, neutral palette, sharp edges) live in the markup itself and break loudly the moment I try to slip past them. |
| **Drizzle ORM** | There is a particular kind of ORM that hides what query it is actually running, and the first time something is slow in production you end up doing detective work just to find out what the database is being asked to do, and Drizzle is the opposite of that, where the TypeScript I write maps cleanly onto the SQL it runs and the migrations are plain readable files in the repo, and when the data is someone's money I want zero gap between what I think is happening and what is actually happening. |
| **Neon** | A serverless Postgres that scales all the way to zero, which is exactly right for an app with two daily users, and branching means I can spin up a copy of production data for an afternoon of experimentation and throw it away when I am done, with no fear of breaking the database the people actually using it depend on. |
| **PostgreSQL** | A real relational database with real constraints and real transactions, because the data inside Pundo has real relationships, where accounts hold categories and categories hold transactions and some of those transactions move between accounts with fees attached, and a key-value store pretending to be a database would just push the work of keeping all of that consistent up into application code where it has no business being. |
| **better-auth** | Sessions in httpOnly cookies, bcrypt for passwords, Google OAuth in a few lines, and all of it lives in my own codebase running against my own database, with no third-party identity provider sitting in the middle of the login flow and no surprise pricing page waiting for Pundo to grow past somebody else's free tier. |
| **Bun** | A faster install and a faster dev server in a single binary that I do not have to assemble out of three other tools, and when you are running the dev loop a few dozen times in an afternoon the seconds it shaves off every reload are most of what decides whether a feature ships that same day or the next one. |
| **Docker** | One image that runs the same way on my laptop, on a staging branch, and in production, which removes the entire genre of bug where the app works perfectly on your machine and then something subtle about the production environment makes it not. |
| **Cloud Run** | Hand Google the container and it handles the rest, scaling up when traffic actually shows up and all the way back down to zero when nobody is around, which is exactly the deployment story I want for an app that has two people using it today and might have two hundred next month and should not cost me anything in between. |
| **Paraglide** | Type-safe translation keys with the messages compiled straight into the bundle, so the compiler tells me when I forgot to translate a string instead of the user being the one to find a half-translated screen, and Tagalog and English can sit side by side in the codebase without either one becoming an afterthought. |
| **shadcn/ui** | Components you copy into your own repository rather than install from a package, which means every primitive in Pundo is mine to shape, where the buttons and dialogs and selects all bend to the no-rounding, sharp-edged look without me having to override anyone else's defaults to get there, and nothing about my UI is held hostage to an upstream maintainer's plans for it. |
| **Lottie** | Tiny vector animations for the few moments in the app that should feel a little alive, like the empty state on a fresh account or the small flourish after a successful import, light enough to never slow the page down and expressive enough that those moments stop feeling like a static screen nobody bothered to finish. |

The thread running through all of these is that each piece is small enough to understand end to end, opinionated enough that I am not making the same shape of decision twenty different times in twenty different places, and quiet enough to stay out of the way once it is set up, and the combined effect is that most days I get to spend my time on the actual product instead of the scaffolding holding it up.

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

If it ends up working for you the way it has worked for the two of us, you might catch yourself getting a little excited to record a transaction at the end of the day, and that small bit of excitement is the whole feeling we are trying to share with this thing. And if Pundo grows past the two of us, we promise to keep it the way it started, calm and honest and built for the person looking at the numbers, not for anyone else.

![Onboarding, the first screen a new tester sees.](/images/pundo/08-welcome.png)

Thanks for trying it, and welcome to Pundo.
