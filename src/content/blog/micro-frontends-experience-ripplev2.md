---
title: "Our Journey Building an App with Micro Frontends: The Good, Bad, and Ugly"
author: "Kenneth Harold Panis"
pubDate: 2025-08-16
image: "image2.png"
tags: ["micro-frontends", "architecture", "frontend", "module-federation", "nx", "react"]
---

## Introduction

So, we decided to build a pretty complex application using micro frontends. Was it worth it? Well... that's complicated. 

Like most developers, we started with big dreams and a solid plan. We were going to rebuild this legacy application using modern architecture that would solve all our problems. The thing is, as the requirements kept growing and we learned more about the pain points of the old system, we realized our traditional approach wasn't going to cut it. 

This is the story of how we ended up going down the micro frontend rabbit hole with Module Federation, React, and NX. Spoiler alert: it wasn't always smooth sailing, but we learned a ton along the way.

Oh, and did I mention that right at the beginning, our main developer - the one who actually started this whole project - left the team? Yeah, that happened. So there we were: me and my 3 teammates, staring at this partially built micro frontend architecture, trying to figure out what the hell was going on. Good times.

## The Problem We Were Trying to Solve

We had this legacy application that was... well, let's just say it was a proper monolith. Think of one of those massive codebases where changing a single feature could mysteriously break three other completely unrelated things. You know the type - where you'd spend hours trying to figure out why updating a user profile form somehow broke the reporting system.

The old app was a nightmare to work with. The build times were absolutely brutal - we're talking no hot reload, no incremental builds, nothing. You'd change a single letter and then have to rebuild the entire application just to see if your change worked. And that build? It took forever. Like, seriously, go-get-coffee-and-maybe-lunch-and-check-your-emails forever. The development feedback loop was so slow it was crushing our productivity.

But the build times were just the tip of the iceberg. The real killer was the unpredictable side effects. You'd touch one feature and something completely unrelated would break. The interconnected nature of the monolith meant that even the simplest changes could have cascading effects that were nearly impossible to predict or debug. We'd spend entire afternoons trying to figure out why changing a validation rule in one form broke a completely different part of the application.

Multiple developers couldn't work on different features without constantly stepping on each other. Git conflicts were a daily occurrence, and deployments were anxiety-inducing events because everything was all-or-nothing. One broken feature meant rolling back everything, even if the other features were working perfectly.

Our upper management saw what was happening and decided we needed to break this thing apart. The idea was to split the application into distinct business domains that could be developed and deployed independently. Each area was complex enough on its own, but they all needed to work together seamlessly.

That's when we started thinking... maybe we don't need to cram everything into one giant codebase?

## Why We Thought Micro Frontends Would Save Us

### The Reality Check

Honestly, we didn't choose micro frontends because we're architecture astronauts (though some of us might be). We had real problems that needed solving, and micro frontends seemed like the answer to our prayers.

The first big issue was that we had too many cooks in the kitchen. Different teams were working on different parts of the application, and they kept stepping on each other's toes. The analytics team would change something that would somehow break the processing team's work. Sound familiar? It's the classic monolith problem where everything is so interconnected that you can't make changes without affecting someone else's code.

Then there was the release chaos. Some parts of the app needed quick fixes, especially when critical business processes were affected, but teams couldn't deploy their fixes because other teams were in the middle of big feature rollouts. Imagine having a critical bug in production but being unable to fix it because another team is halfway through deploying a major feature. That was our reality.

We also had what I like to call technology paralysis. Everyone agreed on React, but beyond that? Some people loved Redux, others wanted to try Zustand, and don't even get me started on the styling debates. We needed some flexibility to experiment with different approaches without creating complete anarchy in our codebase.

And then there was the future growth concern. We knew this application was going to get much bigger and more complex. Adding new features to the existing monolith was already becoming painful, and we were just getting started. The thought of managing this thing as it grew to 10x its current size was terrifying.

Here's the thing though, and this is really important - we were a startup with just one team working on this entire project. After our lead developer left, there were only 4 of us. In hindsight, micro frontends probably work way better when you actually have multiple teams with clear ownership boundaries. But hey, we were committed to this architecture by then, and sometimes you just gotta make it work with what you've got.

## How We Actually Built This Thing

### The Tech Stack (AKA Our Frankenstein)

We ended up with this technology stack that looked really good on paper. NX 21.1.2 was supposed to make monorepo management easy (spoiler alert: it did, eventually, but there was definitely a learning curve). Vite 6.2 promised fast builds and a great dev server, and this part actually lived up to the hype. Module Federation was the magic that would make micro frontends work (and occasionally break everything in mysterious ways). And React 18.3 was the one thing everyone on the team could actually agree on.

Our architecture ended up looking like this: one host application that acts as the main shell and pulls everything together, four remote applications with each one handling a specific business area, and seven shared libraries because we learned the hard way that duplicating code across micro frontends is an absolute nightmare.

### The Module Federation Dance

Getting Module Federation working was... well, let's call it an experience. Each micro frontend had to expose its main component in a very specific way. The configuration looked simple enough - you basically tell each app "hey, you can use me!" by exposing certain components. And then the host app dynamically loads these remote apps by saying "I'll take one of everything, please."

It seems straightforward when you write it down like that, but wait until you start debugging why one of your micro frontends won't load because of some weird webpack configuration issue that makes absolutely no sense. Those were fun times.

### Our Shared Library Strategy (AKA How We Stayed Sane)

One thing we actually got right early on was building a solid foundation of shared libraries. We created a UI library with over 40 components so we wouldn't end up with 15 different button styles scattered across our apps. We had a constants library to keep all our configuration stuff in one place because hardcoded values are evil. Our HTTP service provided one consistent way to talk to APIs with authentication and error handling built right in.

We also built a hooks library with shared React patterns so we wouldn't have to reinvent useEffect for the millionth time, a utils library for all those little functions you end up copying between projects, an icons library because consistent iconography actually matters (fight me on this), and an internationalization library for multi-language support that actually works.

This shared foundation saved our butts more times than I can count. There's nothing worse than having to fix the same bug in four different places because you didn't centralize your code properly.

## What Actually Worked (Surprisingly Well)

### Teams Could Finally Work Without Fighting

The first major win was that teams could actually work on their features without constantly dealing with merge conflicts from hell. The analytics team could add new charts and dashboards while the processing team refactored their workflows, and nobody stepped on anyone's toes. This was such a relief compared to the old monolith where every change seemed to conflict with someone else's work.

We also ended up with smaller codebases that actually made sense. Instead of one massive repository where you needed a map just to find anything, each team had their own focused codebase. New developers could actually understand what was going on without spending weeks learning the entire system. This was a huge improvement for onboarding and general productivity.

Another unexpected benefit was that teams could experiment with different technologies without creating chaos. Some teams used Zustand for state management while others went with React Query for server state. As long as everyone stuck to our shared component library, everything played nice together. This flexibility was something we'd never had with the monolith.

### Deployment Became Way Less Scary

One of the biggest wins was being able to deploy hotfixes without coordination nightmares. When one team discovered a critical bug in their domain, they could fix and deploy just their app without waiting for other teams to finish their sprints. This was a game-changer compared to the old system where a single bug could block everyone's releases.

Rollbacks also became much more sensible. When a new feature broke something, we could roll back just that specific micro frontend instead of reverting the entire application. This saved us more than once and gave everyone much more confidence in our deployment process.

Each team could also handle their own feature rollouts based on their specific needs and risk tolerance. Some teams preferred gradual rollouts with feature flags, while others were comfortable with immediate releases. This flexibility made everyone more productive.

### The System Actually Started to Scale

Each micro frontend had a clear business purpose, which meant when someone had a question about a specific feature domain, they knew exactly which team and codebase to look at. This clear ownership was something we'd never had before, and it made collaboration much smoother.

Our shared UI library meant that even though teams were working independently, the app still looked like one cohesive product. Users couldn't tell where one micro frontend ended and another began, which was exactly what we wanted. The design consistency was maintained without requiring constant coordination between teams.

Build times also stopped being a major pain point. NX's intelligent caching meant we only rebuilt what actually changed. As the project grew, our build times stayed reasonable instead of becoming the 30-minute coffee break they used to be with the old monolith.

### Developer Experience Improved Dramatically

Developers could work on individual micro frontends with super fast hot reload. No more waiting for the entire application to compile just to see if a simple button color change worked. This immediate feedback loop was addictive once you got used to it.

Test suites became smaller and ran much faster. When tests failed, it was usually obvious which team needed to fix them, rather than having to debug a massive test suite to figure out what broke. This made the development cycle much more pleasant.

The shared library system also made dependencies crystal clear. We could see exactly what each micro frontend depended on, which prevented the usual "why is this random utility function breaking our app" mysteries that plagued the old codebase.

## What Nearly Broke Us (The Pain Points)

### The Learning Curve From Hell

The combination of Module Federation, NX, Vite, and micro frontend patterns created a learning curve that was honestly pretty brutal. We're talking about a lot of new concepts for developers to wrap their heads around all at once. New team members spent weeks just understanding the setup before they could actually be productive. When you're already down to just four people and one of them needs weeks to get up to speed, that's a significant hit to your team's velocity.

Configuration became a nightmare of its own. We had Vite configurations for each individual app, Module Federation settings that needed to be just right, and NX workspace configuration files scattered everywhere. When something broke (and things broke regularly in those early days), figuring out which configuration file was the culprit became this detective game that nobody wanted to play. Was it the host app's config? A remote app's setup? Some weird interaction between NX and Vite? Good luck figuring that out at 3 PM on a Friday.

Debugging became an art form that required way more skill than it should have. When something went wrong, the possibilities were endless. Was it the host app? A remote app? A shared dependency? The Module Federation configuration? Some weird caching issue with NX? Yes, we eventually got good at debugging this stuff, but man, those first few months were really rough.

### Dependency Hell, But Make It Distributed

Keeping all the shared dependencies at the same version across four different applications was like herding cats. Someone would update React in one app and forget about the others, leading to these weird runtime errors that were incredibly hard to track down. We thought we'd solved dependency hell by moving to micro frontends, but we'd just distributed it across multiple apps.

Bundle sizes were another surprise. We assumed that sharing dependencies would automatically make our bundles smaller, but without careful management, we sometimes ended up with larger bundles than a well-optimized monolith would have had. Oops. Turns out that micro frontends don't automatically solve performance problems - you still need to think about what you're doing.

Getting the build pipeline right so everything built in the correct order with proper dependency resolution took way more iterations than we'd like to admit. The build order actually matters a lot, and figuring out the right sequence while ensuring all dependencies were properly resolved was trickier than expected.

### Communication Between Apps Was Tricky

We used custom events for micro frontends to communicate with each other, which worked fine until it didn't. Debugging "why isn't this event firing?" became a regular Thursday afternoon activity. Event-based communication sounds clean in theory, but in practice, it can be surprisingly difficult to debug when things go wrong.

Authentication, user permissions, and global application state needed to be shared across all micro frontends, and getting this right without creating tight coupling was harder than we expected. You want these apps to be independent, but they still need to share some fundamental state. Finding that balance is tricky.

Making sure the browser back button worked correctly and deep linking still functioned across different micro frontends required some pretty creative solutions. Users expect navigation to just work, regardless of your internal architecture, so you have to make sure all the browser APIs behave correctly even when you're swapping entire applications in and out.

### Testing Became... Interesting

Testing the complete application meant running all micro frontends together, which was significantly more complex than testing a single application. Our CI/CD pipeline definitely gained a few gray hairs during this process. Integration tests that used to be straightforward became multi-step orchestration exercises.

End-to-end tests had to wait for micro frontends to load asynchronously, handle Module Federation failures gracefully, and account for all the moving parts. Tests became flakier than we wanted because there were just so many more things that could go wrong. A test might fail because of a network timeout loading a remote, a Module Federation configuration issue, or just bad timing.

Testing individual micro frontends often meant mocking the shared libraries and services, which added a lot of complexity to test setup and maintenance. What used to be a simple unit test now required careful mocking of shared dependencies and services.

### Performance Wasn't Always Great

The host application had to bootstrap first, then load the appropriate micro frontend, and then that micro frontend had to initialize. This multi-step process wasn't always as fast as we hoped, especially on slower connections. The old monolith might have been a pain to develop, but it could load pretty quickly once it was built.

Each micro frontend might make its own API calls during startup, leading to more network activity than a well-optimized monolith would generate. More network requests mean more opportunities for things to go wrong and potentially slower overall load times.

Running multiple React applications, even with a shared runtime, used more memory than we expected. This was especially noticeable during development when all apps were running locally. Your laptop fans definitely get a workout when you're running five different React applications simultaneously.

### The Small Team Reality Check

We quickly realized that micro frontends really shine when you have multiple teams, but with just four of us trying to manage four different apps plus shared libraries, the overhead was pretty significant. We were constantly context-switching between micro frontends, which was mentally exhausting.

Since we were such a small team, we ended up with situations where only one person really understood a particular micro frontend. This isn't great for bus factor - what happens when that person goes on vacation or leaves the company? Knowledge silos became a real problem.

Even though the apps were supposed to be "independent," we still needed to coordinate changes constantly, especially in shared libraries. The communication overhead didn't disappear just because we had micro frontends. If anything, it sometimes felt like we had more coordination to do, not less.

## What We Learned (The Hard Way)

### Invest in the Foundation Early (Like, Really Early)

Building a solid design system first was probably our best decision throughout this entire project. Having a robust shared UI library from the very beginning prevented the "why do we have 12 different button styles" problem that plagues most micro frontend projects. When teams are working independently, it's incredibly easy for design to drift apart, but our shared component library kept everything consistent.

We should have spent way more time getting the build system right from the start. We ended up fighting with NX and Module Federation configurations for months when we could have invested that time upfront to understand them properly. Once we finally mastered these tools, everything became much smoother. The lesson here is that complex tooling requires serious upfront investment to pay dividends later.

Centralizing the boring stuff like API communication, authentication, and error handling turned out to be crucial. Trust me, you don't want to debug why the login flow works differently in each micro frontend. Having these foundational services shared across all apps eliminated a whole category of potential bugs and inconsistencies.

### Boundaries Matter More Than You Think

We aligned our micro frontends with business functions rather than technical layers like components or services, and this made so much more sense for development and maintenance. When you organize around business domains, the boundaries feel natural and teams can own entire features end-to-end.

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

Making subroutes work across three different scenarios nearly broke our brains:

1. **Development mode (single app)**: When you're working on just the dashboard app locally, the routes need to work
2. **Local integration mode**: When you're running the full micro frontend system locally to see how everything interacts
3. **Production deployment**: Making sure everything still works when deployed with our chosen setup

Each scenario had different base paths, different ways the apps got loaded, different URL structures. We ended up with this complex routing configuration that had to account for all three modes. It worked, but it was not pretty.

The amount of time we spent debugging "why does this route work locally but not in production" was... substantial. Let's just say that.

## Should You Use Micro Frontends? (The Honest Answer)

Based on our experience, here's when micro frontends actually make sense and when you should probably think twice.

You should seriously consider micro frontends if you have multiple teams that keep stepping on each other's toes. And we're talking about actual separate teams here, not just four people wearing different hats like we were. The organizational benefits really shine when you have distinct teams with clear ownership boundaries who need to move independently.

Complex business domains that are actually separate also make great candidates for micro frontends. If your application has distinct areas that don't heavily overlap, micro frontends can help you manage that complexity. But if everything depends on everything else, you're not going to get much benefit from the architectural separation.

Different release schedules are another strong indicator. When some parts of your application need hotfixes while others can wait for planned releases, the ability to deploy independently becomes incredibly valuable. This was one of the biggest wins for us, even with our small team.

If you're building a long-term project that will be maintained by different teams over years, micro frontends can provide good organizational structure. The clear boundaries make it easier to hand off ownership and onboard new teams. You're also setting yourself up well if you know the application will grow significantly in scope and complexity.

However, you should think twice if you're a small team that can coordinate easily. The overhead might not be worth it when you can just walk over and talk to your teammates. Simple applications that don't really need the architectural complexity will probably be better served by a well-structured monolith.

Tightly coupled features are another red flag. If everything in your application depends on everything else, micro frontends won't help and might actually make things worse. Performance-critical applications where every millisecond matters might also suffer from the additional overhead.

Limited frontend expertise is a real concern too. Micro frontends add significant complexity that requires solid frontend skills to manage properly. If your team is still learning the basics, adding architectural complexity on top might not be the best idea.

Finally, if deployment simplicity matters to you and you want to keep your operational overhead low, a monolith might be a better choice. Our deployment struggles were real, and the operational complexity was definitely higher than a traditional application.

## Other Options We Considered (And Why We Didn't Pick Them)

### Just Build a Monolith

The monolith approach definitely has its merits. Deployment is straightforward, testing is easier, and you'll probably get better performance out of the box. There's something to be said for the simplicity of building one application, deploying one thing, and not having to worry about complex orchestration.

But the downsides that drove us away from this approach were significant. Team coordination becomes a nightmare as the application grows, deployments are all-or-nothing affairs, and one team's bug can block everyone else's release. We'd lived through this pain with our legacy application, and we really didn't want to go back.

### Monorepo with Shared Components (But No Micro Frontends)

This middle-ground approach would have given us shared components and allowed teams to work somewhat independently while avoiding the complexity of micro frontends. It's definitely simpler than full micro frontends and still provides some of the organizational benefits.

The problem is that you still need to coordinate deployments, and the shared runtime means one team's changes can break another team's code. You get some of the benefits of separation without actually solving the fundamental coupling problems.

### Completely Separate Apps with a Shared Design System

At the other extreme, we could have built completely separate applications that just shared a design system. This would have given us total independence with no technical coupling, and teams could use whatever technology they wanted.

But this approach brings its own problems. You lose all shared state, which means users have to log in to each application separately. Navigation between apps feels janky and broken. And the operational overhead is enormous - you're essentially running multiple products instead of one cohesive application.

## Would We Do It Again?

Honestly? It's complicated.

For our specific situation - a small team building a complex app - micro frontends solved some problems but created others. We definitely learned a ton, and the architecture is pretty solid now. But if I'm being completely honest, a well-structured monolith might have been faster to build and deploy for a team our size.

The thing is, we're a startup. We have other teams and they'll probably need to work on this product eventually. So in that sense, the micro frontend architecture is setting us up for future scaling. But right now, with just 4 people, the overhead is real.

The deployment complexity was definitely harder than we expected. A regular website? Build, deploy, done. This thing? We had to figure out routing across multiple environments, coordinate builds, and make sure everything worked together. Not impossible, but definitely more work.

That said, some things worked really well. The shared component library kept our UI consistent. The domain boundaries made sense and helped us organize the code. And when we did need to make changes to just one area (like fixing a critical bug), the isolation was nice.

For teams thinking about micro frontends: seriously consider your team size and operational complexity tolerance. The technology is mature, but it's not free. You're trading development complexity for architectural benefits, and that trade-off needs to make sense for your situation.

Also, plan your deployment strategy early. Like, really early. Don't do what we did and figure it out halfway through the project.

## The Technical Details (For the Curious)

If you're thinking about trying this yourself, here's what we actually used:

- **Framework**: React 18.3.1 with TypeScript 5.7.3 (type safety is non-negotiable)
- **Build System**: NX 21.1.2 with Vite 6.2.2 (NX for the monorepo magic, Vite for speed)
- **Module Federation**: @originjs/vite-plugin-federation (the Webpack version is more mature, but this worked for our Vite setup)
- **State Management**: Zustand + React Query (simple but powerful combo)
- **Styling**: Tailwind CSS 3.4.3 with Radix UI (utility-first styling with accessible primitives)
- **Package Manager**: pnpm (faster than npm, more reliable than yarn v1)
- **Testing**: Jest 29.7.0 with Cypress for E2E (because unit tests alone aren't enough)

This stack worked well for us, but your mileage may vary. The important thing is picking tools your team can actually master and maintain long-term.

---

*This is just our experience building one micro frontend app. Your situation might be totally different, and that's okay. Take what's useful, ignore what's not, and remember that perfect architecture only exists in blog posts - real projects always have tradeoffs.*
