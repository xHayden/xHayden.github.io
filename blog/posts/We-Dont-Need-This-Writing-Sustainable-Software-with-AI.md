---
title: '"We Don''t Need This": Writing Sustainable Software with AI'
description: >-
  AI is incredibly good at solving the problem in front of it, and almost every
  change it makes is reasonable on its own. But complexity doesn't live in any
  single change. It builds up across dozens of them.
date: 2026-11-11T05:00:00.000Z
tags:
  - AI
  - Software Development
  - Software Design
slug: we-dont-need-this
visible: true
---

In my past 5 months working at [Goodlabs](https://goodlabs.com), I've been trying to figure out how to write sustainable software with AI. This article attempts to consolidate my thinking and learning over that time.

The core idea is this: AI is incredibly good at solving the problem in front of it, and almost every change it makes is reasonable on its own. But complexity doesn't live in any single change. It builds up across dozens of them, and no single diff or code review will show it to you. AI solves every problem fresh, rediscovering the problem with every new solution. Seeing how those changes add up, and noticing when today's problem has already been solved, is still the software engineer's job.

## Complexity was never about the code

For a long time, the common argument against complexity in software was that it's more code, and code is expensive to write and maintain. That interpretation was always a bit of a proxy for the real problem with complexity. The real cost of complexity is *understanding*. Every extra moving part is something a person (or agent) has to hold in their head to change the system safely. Using the AI colloquialisms, complex systems require more "context" to understand and maintain.

When writing code was slow, that proxy worked well enough. If you were going to hand-write something, you'd build the MVP first and only expand outward when the feature demanded it. The slowness forced you to judge what was worth building, and because you wrote it, you understood it well enough to criticize it and evaluate risk. AI removed the slowness but not the cost. Code is effectively free now, but understanding it isn't. So the discipline that used to come from hand-writing has to be applied on purpose, every time, and that's a much harder battle to win with yourself.

A big part of that discipline is accepting compromises. Everything doesn't have to be perfect, and there are always compromises in software. When code was expensive, you made compromises by default because you couldn't afford not to (usually due to lack of time). But since code is cheap now, AI would rather build more than accept a compromise. A lot of my code review on AI-written code comes down to the same comment: "we don't need this".

None of this is new. Engineering has known complexity is expensive for decades: the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) (and Brian Kernighan's *UNIX: A History and a Memoir*), John Ousterhout's [*A Philosophy of Software Design*](https://web.stanford.edu/~ouster/cgi-bin/book.php), [Gall's Law](https://en.wikipedia.org/wiki/John_Gall_%28author%29), and [The Grug Brained Developer](https://grugbrain.dev/) all talk about this complexity problem in their own way. AI has just taken away the remaining limit of time that any individual has in their day to work on something.

## How AI makes fighting complexity worse

AI makes complexity worse in a few predictable ways. Here's an example of each.

### 1. It rebuilds what already exists

Say you want an API that serves data from a source to a React client. You ask the AI to build it, then you try it and it's not fast enough, so you ask it to speed things up. It starts right away and builds a custom cache layer with its own invalidation policy and state management. Then you ask it to make sure the data is always fresh, so it adds revalidation on top of that.

Your plan was to build an API but now you've created a cache invalidation pipeline and a state management system, most of which you don't understand. AI will try to cover every edge case if you let it, and each one is more to maintain.

Meanwhile, most of what you asked for already exists. Request caching and revalidation on the client is exactly what libraries like [SWR](https://swr.vercel.app/) or [React Query](https://tanstack.com/query/latest) do. Asking for features one at a time makes this worse, because the AI solves each request locally instead of stepping back to ask "is there a standard tool for this whole category of problem?". This extends to using patterns your codebase already uses and has tested.

### 2. It patches the symptom instead of questioning the requirement

When we moved our blog off of Framer and onto a custom frontend with data from [Payload CMS](https://payloadcms.com), we needed to make sure our new pages and the articles from our old CMS were loaded during initial deployment.

Before deciding upon Payload, we had been using Airtable as a CMS initially, and so the first plan was not to use our new CMS but instead just pull from Airtable. After we decided to switch off, that Airtable import became a deterministic seed with its own JSON format for content.

Over time, development on the CMS continued, and normal problems started to arise. Each problem received a patch. Some examples:

- Reconcile the seed when it reruns
- Track which rows the seed owns so it doesn't overwrite editors' changes
- Preserve where imported posts came from
- Make relationships idempotent
- Verify and repair images missing from storage

Around 50 seed commits were made over three months, and every one was a "reasonable" answer to the problem we were experiencing.

At no point did the agent (or I, unfortunately) ask whether this needed to be a seeding system at all. But the launch content data was just data every database needs and it could follow our existing pattern: migrations. After noticing this weird system that had been contrived, that's where the data ended up. The launch articles are now rows a simple `pg_dump` wrote, replayed as a plain SQL migration that only applies when the database is first being set up. There's no custom format, no reruns, no ownership tracking, or anything else that was overengineered for the task.

Our requirement for moving the initial data over was never "build a seeding system." An experienced engineer can figure out which of those they're solving before writing anything, but AI, in its current iteration, just solves.

### 3. It adds when it should remove

Our CMS saves rich text as [Lexical](https://lexical.dev) JSON, the format its editor uses, and our frontend can only render some of what Lexical supports. We already handled this when a page is saved: any content the frontend can't render gets rejected before it's ever published.

On top of what already worked to filter our invalid content, the agent kept adding more layers of protection between the CMS and the frontend:

- Its own format for page content
- A normalizer to translate Lexical into that format
- A separate projection for media
- Shared types for all of it

Each layer was another guarantee that bad content wouldn't reach the site, and another thing to keep in sync every time the content model changed.

But the save-time validation already gave us the guarantee that the system was safe from corruption in this way. Once we noticed, we deleted the extra layers and served Lexical exactly as it was saved.

When something might go wrong, AI adds another layer of protection. It rarely asks whether an existing layer already covers it.

### 4. It wanders out of scope

Give an agent a broad goal and it will often fix things you didn't ask about along the way: a typo here, a dependency bump there, some copy it thought could be clearer. Open-ended tools like `/goal` are especially prone to this. Each change might be an objective improvement, but incidental copy, spelling, dependency, and UX changes are still scope changes. They make the diff harder to review, mix unrelated risks into one PR, and hide the change you actually wanted. Keep goals controlled and specific, and audit the diff before and after so you fully understand what happened.

We ran into this during the development of the new blog. The task was to cache CMS content on the frontend. To do that, the agent turned on Next.js's [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), a setting that changes how every page in the app renders, and then edited eleven critical infrastructure files to make the rest of the app compatible with that change. None of those files had anything to do with the CMS, and each edit was a simple and reasonable fix for the setting it had just turned on.

Next's existing [data cache](https://nextjs.org/docs/app/guides/caching-without-cache-components) already did everything the CMS needed. But this change the AI had justified as being "cleaner" had become a significantly wider-scoped change that had to be audited on the rest of the app. We quickly ended up reverting this back to the existing caching pattern to reel in scope and prevent having to heavily audit our existing critical infrastructure to fit this change.

## Good engineers need to supply the friction themselves

If the slowness of writing code used to be the forcing function, we need to put that friction back deliberately, both before the AI writes anything and before it's accepted.

Good software engineers should:

- **Plan requirements.** Diagram and write down the intended scope and deliverables.
- **Plan incrementally.** No one will know the full context of a system when they start. Writing the best guess as a spec on your own, going back and forth with other engineers on the details, then revisiting it together once working with the code has made the real constraints clear. Only then do you have a solid foundation for a large feature.
- **Keep it small enough to understand all at once.** If a change can't be fully understood without significant time, merge it in stages. You should only be working on things where you can hold the whole system in your head without reasoning across many features.

Before accepting changes, we should ask:

1. **Does this already exist?** Is there a library, a platform feature, or an existing pattern in our codebase that already solves this category of problem?
2. **Should this requirement exist?** Am I fixing a symptom of a decision that should be revisited?
3. **Can I remove something instead?** Is the best fix a deletion or a consolidation rather than an addition?
4. **Is this the minimum?** Would I have built this much if I had to write it by hand? If not, what's the smallest version, and what risk justifies going further?
5. **What am I choosing not to handle?** Which edge cases or nice-to-haves am I deliberately leaving out, and am I okay with that compromise?
6. **Is everything here in scope?** Anything unrelated, even an improvement, goes in its own PR.
7. **Can I explain it without the AI?** If I couldn't walk a teammate through this change on my own, I don't understand it well enough to maintain it.

## Rediscovering the problem

AI isn't bad at writing software, but it's bad at saying no and recognizing when today's problem is one we solved decades ago. Every new paradigm in AI-driven software rediscovers that complexity is the enemy and the only way to maintain the code produced by these tech debt accelerators is recognizing where to say "we don't need this".

All of this being said, I do strongly believe that AI will only get better at knowing when not to overengineer. I'm not the first one to point this out and people smarter than me are working on these exact issues at the major AI labs. The purpose of this article was mainly to solidify my own understanding on where I still need to push back to agents.
