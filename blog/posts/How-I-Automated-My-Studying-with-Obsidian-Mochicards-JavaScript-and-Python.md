---
title: How I Automated My Studying with Obsidian and Mochi.cards
description: >-
  Notetaking is slow, but it can be faster with the proper strategies and tools.
  I type notes onto Obsidian and use Mochi.card for flashcards. But alone, they
  weren't enough.
date: 2023-10-13T04:00:00.000Z
tags:
  - Notetaking
  - Studying
  - JavaScript
  - Python
  - Mochi.cards
  - Obsidian
slug: automate-notetaking-obsidian-mochi
---

Beginning my fall semester in my freshman year of college, I was having a hard time adjusting to note-taking. I needed a workflow that supported the speed I heard information and my need to study it. My previous routine either left me without reliable notes or without an efficient way to review the material. To deal with this, I looked for alternatives.

## My Switch to Obsidian from Notion

For the past few years, I've used Notion to take notes. It provides a very structured approach to note-taking. While good for many, I found it to be restrictive. I wanted to be able to just start a note and go, dealing with the labeling and organizing later. Because of this, after hearing a lot about it on YouTube and TikTok, I switched to Obsidian.md. After a few weeks of fiddling around and tuning things to how I wanted, I was able to pivot from using Notion to Obsidian.

![My Obsidian Vault Image](https://img.hayden.gg/ec103c6a9085fb29c752f1306f83b8c9.png)

## Mochi for Flashcards

[Mochi](https://mochi.cards/) is like Anki or Quizlet, but allows some more programmability in how cards are created and used. I'm not going to go into all of it, but I use Mochi mostly because of its [spaced repetition](https://ncase.me/remember/) features. The main benefit for me of using spaced repetition is that I remember what I learn *after* an exam or course. I'm reminded of flashcards from topics I learned months ago semi-regularly, which helps put them into long-term memory.

![My Mochi.cards App View](https://img.hayden.gg/72028b03318f07f543ec3bd495ace878.png)

## Creating an Obsidian Plugin to Upload my Flashcards to Mochi.cards

There already exists [a plugin to export cards from Obsidian and put them into Mochi](https://github.com/kalibetre/mochi-cards-exporter) but you have to export the cards from Obsidian using the plugin and then import them manually into Mochi yourself. That's so slow! A much better approach is using Mochi's API to automatically sync your cards into a deck right in Obsidian (the API comes part of Mochi's pro plan which is $5/mo, but for me, that's worth it). So, I wrote a quick plugin to take a card in the format:

```
# Flashcard Name (one side)
description (other side)
```

And push it to Mochi from Obsidian. I used this for a few months, but it was mediocre at best. Some features include:

1. Hardcoded API keys 😬, mochi deck ids, and mochi template ids.
2. Didn't update existing cards, only created new ones.
3. Not even on GitHub.

So I took some more time and fixed all of those issues...and *voila*! An easy way to create a bunch of cards and export them into a mochi deck!

![Demo of My Obsidian Plugin that creates Mochi cards](https://img.hayden.gg/7dee8e8af29674e3a05273917223354f.gif)

I'm still working on the plugin, but if you want to check it out [it's on my GitHub](https://github.com/xHayden/obsidian-mochi-cards-pro).

## Screenshot Support

Obsidian is almost entirely run locally, so uploading images just saves them to your Obsidian vault. It doesn't create a url on Obsidian's servers like Notion does. So, if I take a screenshot and want it in my flashcards, I have to find a URL that hosts that image.

One of the more annoying things about MacOS, coming from Windows, is that the screenshot utilities are just not as good as [ShareX](https://getsharex.com/). A few years ago, I wrote code for a custom image hosting endpoint at [img.hayden.gg](img.hayden.gg). ShareX allows me to take screenshots and automatically send them to my image server to be processed and then sends me back the image url as a response. Isn't that amazing? As far as I can tell, there's no MacOS app that does quite the same for free. But that's exactly what I need!

So, to deal with this issue, I thought of an alternative. I could just use a quick script to read my screenshots folder and upload whatever's there to my image server! I asked ChatGPT to write a script to do just that and it worked (after some trial and error). Now, all I have to do is take a screenshot with the default MacOS screenshot utility and the URL is sent to my clipboard. Yay!

Now, I simply take a screenshot, the url gets added to my clipboard, and I add the image to my note with Markdown. So cool!

![Image upload to clipboard](https://img.hayden.gg/2332c5b9bc331ba80db482f0abf57821.gif)

The server code and script code will be published here once I make it presentable 🤪

## Conclusion: My New Setup

This setup has been saving me hours of my time creating notes already, and I've only used it a few times!

Now, to create flashcards, I can put my notes in a window next to a flashcards page and create away! No need for app switching or anything. Mochi has some tools to autogenerate content on top of created flashcards with a custom card template, so I might check those out next!
