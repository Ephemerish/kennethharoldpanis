---
title: 'Our Journey Building an App with Micro Frontends'
author: 'Kenneth Harold Panis'
pubDate: 2025-08-16
image: 'Microfrontend.png'
tags:
  [
    'micro-frontends',
    'architecture',
    'frontend',
    'module-federation',
    'nx',
    'react',
  ]
---

## Introduction

We spent 9 months building a complex application with micro frontends. The result? A working system that taught us more about architectural tradeoffs than we ever wanted to know.

Everyone told us micro frontends would solve our scaling problems. Independent teams, independent deployments, technology flexibility - it all sounded perfect, But from our experience micro frontends come with their own special brand of complexity that can make your life interesting in ways you didn't expect.

## The Problem We Were Trying to Solve

We had this legacy application that was... well, let's just say it was a proper monolith, it was a massive codebases where changing a single feature could break three other completely unrelated things.

The old app was a nightmare to work with, build times were absolutely brutal with no hot reload, no incremental builds, nothing. You'd change a single letter and then have to rebuild the entire application just to see if your change worked. And that build? It took forever. The development feedback loop was so slow it was crushing productivity.

The other real killer was the unpredictable side effects, You'd touch one feature and something completely unrelated would break. The interconnected nature of the monolith meant that even the simplest changes could have cascading effects that were nearly impossible to predict or debug. You would spend entire afternoons trying to figure out why changing a button in one form broke a completely different part of the application.

That's when they started thinking... maybe we don't need to cram everything into one giant codebase?

## Why We Thought Micro Frontends Would Save Us

Someone from the company had already explored micro frontends as a solution to our monolith problems. Then they brought in a senior developer to start rebuilding the application using this architecture, splitting it into distinct key features that could be developed and deployed independently. We joined the project to help him build this new system.

The main driver was escaping the nightmare of our legacy monolith. We were so tired of the brutal build times and the constant fear of breaking something completely unrelated when making simple changes. Micro frontends promised independent development and deployment, which sounded like exactly what we needed to break free from that cycle of pain.

The idea of having clear boundaries between different parts of the application was really appealing after dealing with the interconnected mess of the old system. We also knew this rebuilt application was going to get much bigger and more complex over time. Micro frontends felt like they would give us the architectural foundation to scale without repeating our past mistakes.

But after working together for a few months, the senior developer left the team, and we were left to take over a partially built micro frontend architecture. Here's the thing though, and this is really important - we were a startup with just one team working on this entire project. After he left, there were only 4 of us. In hindsight, micro frontends probably work way better when you actually have multiple teams with clear ownership boundaries. But hey, we were committed to this architecture by then, and sometimes you just gotta make it work with what you've got.

## How We Actually Built This Thing

### The Tech Stack

After a lot of back and forth and experimentation, this is the stack we finally settled on, Nx 21.1.2 made monorepo management bearable, Vite 6.2.2 delivered on fast builds and a smooth dev server, Vite Module Federation (@originjs/vite-plugin-federation) was the glue for our micro frontends—the Webpack version is more mature, but this worked perfectly with our Vite setup. React 18.3.1 was the one constant everyone agreed on.

Our final architecture: one host application as the main shell, four remote apps each handling a key feature, and seven shared libraries—because duplicating code across micro frontends is a nightmare we learned to avoid.

### The Module Federation Dance

Getting Module Federation working was... well, let's call it an experience. Each micro frontend had to expose its main component in a very specific way. The configuration looked simple enough - you basically tell each app "hey, you can use me!" by exposing certain components. And then the host app dynamically loads these remote apps by saying "I'll take one of everything, please."

It seems straightforward when you write it down like that, but wait until you start debugging why one of your micro frontends won't load because of some weird webpack configuration issue that makes absolutely no sense. Those were fun times.

### Our Shared Library Strategy

One thing we actually got right early on was building a solid foundation of shared libraries. We created a UI library with over 40 components so we wouldn't end up with 15 different button styles scattered across our apps. We had a constants library to keep all our configuration stuff in one place because hardcoded values are evil. Our HTTP service provided one consistent way to talk to APIs with authentication and error handling built right in.

We also built a hooks library with shared React patterns so we wouldn't have to reinvent useEffect for the millionth time, a utils library for all those little functions you end up copying between projects, an icons library because consistent iconography actually matters (fight me on this), and a shared internationalization library for multi-language support that actually works.

This shared foundation saved our butts more times than I can count. There's nothing worse than having to fix the same bug in four different places because you didn't centralize your code properly.

Now, there's a fair argument that having all these shared libraries goes against the "independence" principle of micro frontends. Some purists would say we're creating coupling and defeating the purpose. But honestly? I'd argue it's not worth the hassle. Without shared libraries, you'd have to hunt down and fix the same bug across multiple apps, and inevitably someone would forget to update one of them. That's a maintenance nightmare I wouldn't wish on anyone.

## What Actually Worked (Surprisingly Well)

### Teams Could Finally Work Without Fighting

We ended up with smaller codebases that actually made sense. Instead of one massive repository where you needed a map just to find anything, each team member had their own focused codebase.

Another unexpected benefit was that teams could experiment with different technologies without creating chaos. We used Zustand 5.0.0-rc.2 for state management combined with React Query (@tanstack/react-query) for server state. As long as everyone stuck to our shared component library, everything played nice together. This flexibility was something we'd never had with the monolith.

### The System Actually Started to Scale

Each micro frontend had a clear purpose, which meant when someone had a question about a specific feature, they knew exactly which team and codebase to look at. This clear ownership was something we'd never had before, and it made collaboration much smoother.

Our shared UI library meant that even though teams were working independently, the app still looked like one cohesive product. Users couldn't tell where one micro frontend ended and another began, which was exactly what we wanted. The design consistency was maintained without requiring constant coordination between teams.

Build times also stopped being a major pain point. Nx's intelligent caching meant we only rebuilt what actually changed. As the project grew, our build times stayed reasonable instead of becoming the 10-minute coffee break they used to be with the old monolith.

### Developer Experience Improved Dramatically

Developers could work on individual micro frontends with super fast hot reload. No more waiting for the entire application to compile just to see if a simple button color change worked. This immediate feedback loop was addictive once you got used to it.

The shared library system also made dependencies crystal clear. We could see exactly what each micro frontend depended on, which prevented the usual "why is this random utility function breaking our app" mysteries.

## What Nearly Broke Us (The Pain Points)

### The Learning Curve From Hell

The combination of Module Federation, Nx, Vite, and micro frontend patterns created a learning curve that was honestly pretty brutal. We're talking about a lot of new concepts for developers to wrap their heads around all at once. When you're already down to just four people and one of them needs weeks to get up to speed, that's a significant hit to your team's velocity.

Configuration became a nightmare of its own. We had Vite configurations for each individual app, Module Federation settings that needed to be just right, and Nx workspace configuration files scattered everywhere. When something broke (and things broke regularly in those early days), figuring out which configuration file was the culprit became this detective game that nobody wanted to play. Was it the host app's config? A remote app's setup? Some weird interaction between Nx and Vite? Good luck figuring that out at 3 PM on a Friday.

Debugging became an art form that required way more skill than it should have. When something went wrong, the possibilities were endless. Was it the host app? A remote app? A shared dependency? The Module Federation configuration? Some weird caching issue with Nx? Yes, we eventually got good at debugging this stuff, but man, those first few months were really rough.

### Communication Between Apps Was Tricky

We used custom events for micro frontends to communicate with each other, which worked fine until it didn't. Debugging "why isn't this event firing?" became a regular Thursday afternoon activity. Event-based communication sounds clean in theory, but in practice, it can be surprisingly difficult to debug when things go wrong.

Authentication, user permissions, and global application state needed to be shared across all micro frontends, and getting this right without creating tight coupling was harder than we expected. You want these apps to be independent, but they still need to share some fundamental state. Finding that balance is tricky.

Making sure the browser back button worked correctly and deep linking still functioned across different micro frontends required some pretty creative solutions. Users expect navigation to just work, regardless of your internal architecture, so you have to make sure all the browser APIs behave correctly even when you're swapping entire applications in and out.

### Testing Became... Interesting

Testing the complete application meant running all micro frontends together, which was significantly more complex than testing a single application.

End-to-end tests had to wait for micro frontends to load asynchronously, handle Module Federation failures gracefully, and account for all the moving parts. Tests became flakier than we wanted because there were just so many more things that could go wrong. A test might fail because of a network timeout loading a remote, a Module Federation configuration issue, or just bad timing.

Testing individual micro frontends often meant mocking the shared libraries and services, which added a lot of complexity to test setup and maintenance. What used to be a simple unit test now required careful mocking of shared dependencies and services.

### The Small Team Reality Check

We quickly realized that micro frontends really shine when you have multiple teams, but with just four of us trying to manage four different apps plus shared libraries, the overhead was pretty significant. We were constantly context-switching between micro frontends, which was mentally exhausting.

Since we were such a small team, we ended up with situations where only one person really understood a particular micro frontend. This isn't great for bus factor - what happens when that person goes on vacation or leaves the company? Knowledge silos became a real problem.

Even though the apps were supposed to be "independent," we still needed to coordinate changes constantly, especially in shared libraries. The communication overhead didn't disappear just because we had micro frontends. If anything, it sometimes felt like we had more coordination to do, not less.

## What We Learned (The Hard Way)

### Invest in the Foundation Early (Like, Really Early)

Building a solid design system first was probably our best decision throughout this entire project. Having a robust shared UI library from the very beginning prevented the "why do we have 12 different button styles" problem that plagues most micro frontend projects. When teams are working independently, it's incredibly easy for design to drift apart, but our shared component library kept everything consistent.

We should have spent way more time getting the build system right from the start. We ended up fighting with Nx and Module Federation configurations for months when we could have invested that time upfront to understand them properly. Once we finally mastered these tools, everything became much smoother. The lesson here is that complex tooling requires serious upfront investment to pay dividends later.

Centralizing the boring stuff like API communication, authentication, and error handling turned out to be crucial. Trust me, you don't want to debug why one API retains its data on remount while the others don't. Having these foundational services shared across all apps eliminated a whole category of potential bugs and inconsistencies.

### Boundaries Matter More Than You Think

We aligned our micro frontends with key features rather than technical layers like components or services, and this made so much more sense for development and maintenance. When you organize around feature areas, the boundaries feel natural and teams can own entire features end-to-end.

We learned to be really explicit about how micro frontends communicate with each other. Implicit contracts lead to pain when teams make changes, so writing down your communication contracts and keeping them updated is essential. This documentation becomes your lifeline when things go wrong.

Figuring out early what needs to be shared versus what should stay local to each micro frontend is critical. User authentication and permissions clearly need to be shared, but feature-specific state should stay local. Getting this wrong leads to either tight coupling between apps or data inconsistency issues that are hard to debug.

### Developer Experience Can Make or Break You

We built a single command that starts the entire system with one keystroke, and this was essential for integration testing and onboarding new developers. When someone new joins the team, they shouldn't have to read a 20-step setup guide just to see the application running.

But we also made sure developers could work on individual micro frontends without starting the entire system. This kept development cycles fast and let people focus on their specific area without the overhead of running everything. Finding this balance between integration and isolation is key.

Having an automated testing strategy that worked at both the individual micro frontend level and the integrated system level took us longer to figure out than it should have. You need both, and they need to work together seamlessly, but that's easier said than done.

### Monitoring and Debugging Are Essential

We started logging everything: Module Federation loading events, inter-app communication, shared state changes, the works. When things break in a micro frontend architecture (and they will), you'll be incredibly grateful for those breadcrumbs. The debugging complexity is just higher than a monolith, so you need better observability.

Error boundaries everywhere became our safety net. We implemented error boundaries that could handle failures in individual micro frontends without taking down the entire application. This saved users from seeing blank screens when one part of the app had issues, which is a much better experience than a complete system failure.

We had to keep a constant eye on bundle sizes, load times, and memory usage to make sure the micro frontend architecture wasn't hurting user experience. Some of our early assumptions about performance were completely wrong, so continuous monitoring became essential.

## The Deployment Headaches (Oh Boy)

This deserves its own section because deployment was probably our biggest struggle. With a traditional website, you build it, you deploy it, done. With micro frontends? Welcome to dependency hell on steroids.

### The Great Deployment Debate

We spent weeks arguing about how to deploy this thing:

**Option 1: Separate workloads for each app** - Each micro frontend gets its own container/pod. Sounds great in theory - true independence, can scale and deploy each app separately. But man, the operational complexity was scary. We'd need to manage 5 different deployments, 5 different sets of environment variables, 5 different monitoring setups...

**Option 2: Single workload, multiple ports** - Build everything together and expose different ports for each app. Much simpler to manage, but we lose a lot of the independence benefits that made us choose micro frontends in the first place.

We ended up going with Option 2 for now. Yeah, it's not the "pure" micro frontend approach, but as a small team, we needed to keep our operational overhead manageable. We recognize that the ability to deploy just the app with changes would be way better (less downtime, less risk), but we had to pick our battles.

### The Routing Nightmare

And then there's routing. Oh god, the routing.

Making subroutes work correctly across three different scenarios nearly broke our brains:

1. **Development mode (single app)**: When you're working on just the dashboard app locally, the routes need to work
2. **Local integration mode**: When you're running the full micro frontend system locally to see how everything interacts
3. **Production deployment**: Making sure everything still works when deployed with our chosen setup

Each scenario had different base paths, different ways the apps got loaded, and different URL structures. We ended up with this complex routing configuration that had to account for all three modes. It worked, but it was not pretty.

The amount of time we spent debugging "why does this route work locally but not in production" was... substantial. Let's just say that.

## Should You Use Micro Frontends?

Based on our experience, here's when micro frontends actually make sense and when you should probably think twice.

### When Micro Frontends Make Sense

**Multiple teams with stepping-on-toes syndrome.** And we're talking about actual separate teams here, not just four people wearing different hats like we were. The organizational benefits really shine when you have distinct teams with clear ownership boundaries who need to move independently.

**Complex, actually separate key features.** If your application has distinct areas that don't heavily overlap, micro frontends can help you manage that complexity. But if everything depends on everything else, you're not going to get much benefit from the architectural separation.

**Different release schedules.** When some parts of your application need hotfixes while others can wait for planned releases, the ability to deploy independently becomes incredibly valuable. This was one of the biggest wins for us, even with our small team.

**Long-term projects with changing ownership.** If you're building something that will be maintained by different teams over years, micro frontends provide good organizational structure. The clear boundaries make it easier to hand off ownership and onboard new teams.

### When You Should Think Twice

**Small teams that can coordinate easily.** The overhead might not be worth it when you can just walk over and talk to your teammates. We learned this the hard way.

**Simple applications.** If you don't really need the architectural complexity, a well-structured monolith will probably serve you better.

**Tightly coupled features.** If everything in your application depends on everything else, micro frontends won't help and might actually make things worse.

**Performance-critical applications.** If every millisecond matters, the additional overhead might be a problem.

**Limited frontend expertise.** Micro frontends add significant complexity that requires solid frontend skills to manage properly. If your team is still learning the basics, adding architectural complexity on top might not be the best idea.

**Deployment simplicity matters.** If you want to keep your operational overhead low, a monolith might be a better choice. Our deployment struggles were real, and the operational complexity was definitely higher than a traditional application.

## Other Options We Considered (And Why We Didn't Pick Them)

### Just Build a Monolith

The monolith approach definitely has its merits. Deployment is straightforward, testing is easier, and you'll probably get better performance out of the box. There's something to be said for the simplicity of building one application, deploying one thing, and not having to worry about complex orchestration.

But the downsides that drove us away from this approach were significant. Team coordination becomes a nightmare as the application grows, deployments are all-or-nothing affairs, and one team's bug can block everyone else's release. We'd lived through this pain with our legacy application, and we really didn't want to go back.

### Monorepo with Shared Components (But No Micro Frontends)

This middle-ground approach would have given us shared components and allowed teams to work somewhat independently while avoiding the complexity of micro frontends. It's definitely simpler than full micro frontends and still provides some of the organizational benefits.

The problem is that you still need to coordinate deployments, and the shared runtime means one team's changes can break another team's code. You get some of the benefits of separation without actually solving the fundamental coupling problems.

### Completely Separate Apps with a Shared Design System

At the other extreme, we could have built completely separate applications that just shared a design system. This would have given us total independence with no technical coupling, and teams could use whatever technology they wanted.

But this approach brings its own problems. Navigation between apps feels janky and broken since you lose the seamless single-page application experience. And the operational overhead is enormous - you're essentially running multiple products instead of one cohesive application.

## Would We Do It Again?

### The Honest Answer: It Depends

For our specific situation - a small team building a complex app - micro frontends solved some problems but created others. We definitely learned a lot, and the architecture is pretty solid now. But if I'm being completely honest, a well-structured monolith might have been faster to build and deploy for a team our size.

### What We'd Consider Next Time

**Team size matters more than we thought.** We're a startup with just 4 people. The micro frontend overhead is real when you're constantly context-switching between different apps. If we were still this size, we'd probably go with a monolith and extract micro frontends later when we actually have multiple teams.

**Plan deployment from day one.** The deployment complexity was definitely harder than we expected. A regular website? Build, deploy, done. This thing? We had to figure out routing across multiple environments, coordinate builds, and make sure everything worked together. Not impossible, but definitely more work.

**Future-proofing has value.** We're a startup that will probably grow. Other teams will likely need to work on this product eventually. In that sense, the micro frontend architecture is setting us up for future scaling, even if the overhead is high right now.

### What Actually Worked Well

The shared component library kept our UI consistent. The domain boundaries made sense and helped us organize the code. And when we did need to make changes to just one area (like fixing a critical bug), the isolation was nice.

### The Bottom Line

For teams thinking about micro frontends: seriously consider your team size and operational complexity tolerance. The technology is mature, but it's not free. You're trading development complexity for architectural benefits, and that trade-off needs to make sense for your situation.

Also, plan your deployment strategy early. Like, really early. Don't do what we did and figure it out halfway through the project.

## The Technical Stack (For the Curious)

If you're thinking about trying this yourself, here's what we actually used:

- **Framework**: React 18.3.1 with TypeScript 5.7.3 (type safety is non-negotiable)
- **Build System**: Nx 21.1.2 with Vite 6.2.2 (Nx for the monorepo magic, Vite for speed)
- **Module Federation**: @originjs/vite-plugin-federation 1.4.1 (the Webpack version is more mature, but this worked for our Vite setup)
- **State Management**: Zustand 5.0.0-rc.2 + React Query (@tanstack/react-query 5.77.1) (simple but powerful combo)
- **Styling**: Tailwind CSS 3.4.3 with Radix UI (utility-first styling with accessible primitives)
- **Package Manager**: pnpm (faster than npm, more reliable than yarn v1)
- **Testing**: Jest 29.7.0 with Cypress 14.4.0 for E2E (because unit tests alone aren't enough)

This stack worked well for us, but your mileage may vary. The important thing is picking tools your team can actually master and maintain long-term.

## Final Thoughts

Micro frontends aren't magic. They're a tool that solves specific problems while creating others. Whether they're right for your project depends on your team size, organizational structure, and tolerance for complexity.

Our advice? Start with a monolith. When you have actual multiple teams stepping on each other's toes, then consider breaking things apart. Don't build micro frontends because they sound cool or because you read about them in a blog post (including this one). Build them because you have a real organizational problem that they can solve.

And if you do go down this path, invest heavily in your shared foundation, plan your deployment strategy from day one, and prepare for a learning curve that's steeper than you think.
