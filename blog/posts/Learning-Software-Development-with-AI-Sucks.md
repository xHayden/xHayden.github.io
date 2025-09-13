---
title: Learning Software Development with AI Sucks
description: >-
  Over the past few years, I've had to interview and recruit many aspiring web
  developers into a student-run nonprofit I work at, Bits of Good. As AI tooling
  has increased in popularity (especially Agentic tooling), I've noticed a clear
  trend in developer skill.
date: 2025-09-13T04:00:00.000Z
tags:
  - Recruiting
  - AI
  - Software Development
slug: learning-software-development-with-ai-sucks
---

A common workflow students used to use when learning Software Development:

1. Have an idea for a skill to learn or a project to work on
2. Skim a few tutorials, maybe watch a video
3. Try creating something
4. Fail
5. Check StackOverflow
6. Create something worthwhile
7. Repeat steps 3 to 6 until you have a finished product and have learned a new skill

That workflow was very effective. Now the workflow looks more like this:

1. Have an idea for a skill to learn or a project to work on
2. Ask Claude to do it
3. End up with a lackluster finished product with inefficiencies, bad systems planning, and little idea of how it all works

It's a much more efficient workflow, but the trial and error and [cognitive effort that makes you learn and function at a high level](https://arxiv.org/abs/2506.08872) are gone.

When recruiting, there is nothing worse. You create written behavioral sections and takehome assignments just for someone to do them all in 20 minutes with AI, while other candidates spend hours to create what appears to be a "worse product". In reality, the candidate that tried their hardest almost always has a much broader skillset and a much stronger ability to learn than the candidate who used AI. For positions like internships and student roles, all you care about is a person's ability to learn and improve.

Time and time again I've interviewed people who perfectly completed a takehome assignment only to have them unable to write a single useEffect hook. It's incredibly frustrating.

I don't know how to solve recruiting and I don't know if anyone does. At this point, you have to get someone on-premises to test them without risk of them cheating. It's an underrated reason for the doom and gloom of recruting for Software Engineering roles these days. AI has made recruiting worse for developers and companies alike.

I had an applicant a few weeks ago, after confronting him about his lack of knowledge and use of AI, ask me how to learn to code with AI. After thinking about it more, I've come to the conclusion if you rely on AI as a crutch to write code, you will never push yourself hard enough to learn effectively. But even though I'm quick to criticise AI for learning, I use it almost constantly in my workflows to speed up the process of writing tests, refactoring, or covering edge cases. These days, it can understand a few files and how they connect to a degree that is good enough for these purposes. But there are three major drawbacks to AI in software development (as of September 2025).

### Local Minima—Agent gets "stuck"

If you've ever taken a class on statistics or basic AI, you'll be familiar with gradient descent, linear regression, or something of the like that might have the concept of local minima. These happen when an algorithm finds a solution that looks “good enough” in the short term but is actually far from the global best solution. It gets stuck, circling the same space, unable to escape without external guidance.

Large language models do the same thing when coding. If GPT or Claude tries an approach that doesn’t work, it often just keeps hammering away at the same angle: rephrasing, slightly tweaking, or reordering its attempts, but never really stepping back to rethink the architecture. The result is a loop of repetitive, mediocre solutions that never converge on the deeper fix.

This is where an experienced developer makes all the difference. A mature engineer knows when a path is fundamentally flawed and can redirect the agent onto a better trajectory. Instead of letting the AI go in a direction that will never achieve results, they act as the guide who lifts it out of the local minima and pushes it toward the “global optimum.” Used this way, AI becomes less of a crutch and more of a multiplier but only in the hands of someone who already knows how to recognize when the agent is stuck.

### Large Codebases

AI coding tools are excellent at handling small, self-contained snippets or even a couple of files at a time. The cracks start to show when you throw them into a sprawling codebase with hundreds of interconnected modules, layers of abstraction, and legacy code decisions made years ago. Context length limits and lack of deep architectural understanding mean the AI can’t hold the entire system in its reasoning.

So, while it might generate a clever fix for a single function, it won’t consider the ripple effects across the rest of the codebase. This creates a new kind of technical debt: not bugs you can see immediately, but subtle inconsistencies and architectural drift that only surface much later. Human developers normally catch these things because they’re mentally modeling the system as a whole, but as of now, AI fails to exhibit that complex behavior.

### Outside of Web Development

A large part of modern datasets for LLMs comes from developer code that's written in JavaScript, TypeScript, Java, or Python. There's some C and C++ too, but these languages generally have a lot more quirks that aren't covered broadly across developer projects. These languages are relatively simple, predictable, have large user adoption, and easy for LLMs to generate accurate code for. Projects built with traditional MERN stacks even more so.

Step outside of that comfort zone, however, and you quickly see the limits. Try to use AI to debug a distributed system, configure Kubernetes at scale, write optimized C++ for embedded hardware, or even just deal with YAML in a production CI/CD pipeline. The model’s confidence remains absolute, but the solutions hallucinate, oversimplify, or introduce catastrophic errors. Sometimes their solutions even involve [deleting entire databases](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/).

### Conclusion

It is possible to learn with AI, but I highly recommend against it when you're just starting out. The trial and error, the repeated failures, and the process of rethinking your approach is what actually builds lasting skill. With AI, that cycle gets skipped. Instead of wrestling with problems, you accept whatever the model gives you, even when it’s inefficient, poorly structured, or flat-out wrong. Beginners rarely have the experience to recognize these issues, so they end up with code that works but no understanding of why.

The risks are even bigger than they appear. AI tends to get stuck in local minima, circling weak solutions instead of rethinking the problem. It struggles with large, interconnected codebases where subtle mistakes create long-term technical debt. And outside of mainstream web development, its answers often collapse entirely. These are exactly the kinds of traps a beginner won’t catch, and why using AI as a crutch early on can be so damaging.

You might end up with a cool new toy at the end, or a project due on time, but you never took the time to learn. If you can manage to spend that time and break yourself off of the convenience of AI, you'll come out on the other side a more competent developer and learner that can leverage AI to assist rather than replace.
