---
title: 'Soo I tried pretext'
author: 'Kenneth Harold Panis'
pubDate: 2026-06-20
image: 'I-Put-Pretext-to-the-Test.png'
description: 'I tried pretext, a little tool that figures out how text fits before the page even draws it, and this whole post is the demo, so see for yourself.'
tags: ['performance', 'developer-tools']
tech: ['TypeScript', 'React', 'Astro', 'pretext.js']
engine: pretext
---

So I tried pretext, and instead of just telling you about it, I figured it would be way cooler to let it build this whole page, so the letter and words are flowing around, and the big letter at the start of each part keeps growing and shrinking while the text shuffles to make room, none of this is a picture, it's all happening right now, so just scroll slow and watch the words move.

## What is pretext

Okay so the simple way to put it, [pretext](https://pretextjs.dev/) is a little tool that figures out how text is going to sit on a page, how big it is and where each line breaks and all of that, before the page even draws it, and it does the whole thing with quick math.

Normally, if you want to know how much room some text takes up, you have to draw it first and then go measure it, which makes everything stop and wait for a moment, but pretext just works it out ahead of time, so there's no drawing first and no waiting around.

## What it can do

Because it already knows the shape of the text before anything shows up, you can do stuff that's normally kind of a pain, like wrapping words around custom shapes, growing text so it fills a space properly, or knowing how tall a block will be before you render it.

It's also quick enough to recalculate layout many times a second when things move or resize, so animated text effects stay responsive instead of breaking layout.

Without something like pretext, the usual loop in a text heavy page goes, change something, let the browser draw, measure the DOM, update styles, draw again, then repeat that every frame, and that gets expensive fast.

With pretext, the layout math happens before anything gets painted, so instead of asking the browser to redraw just to find out where a line breaks, each frame mostly just moves things to where they already know they go.

The browser stops getting interrupted with measure requests, so motion stays smooth even on weaker devices or when a lot of animated text is on screen at once.

## Why I like it

Since ever, we've kind of been fighting css to do simple things with text, lining it up, fitting it, wrapping it, figuring out how big it is, and pretext takes all that little stuff and turns it into easy math instead of guessing and hoping it looks right.

Once you see it work, the old way just feels stupid for anything where the text really matters. I messed with it for a weekend, and yeah, I'm sold.
