---
title: 'Soo I tried pretext'
author: 'Kenneth Harold Panis'
pubDate: 2026-06-20
image: 'I-Put-Pretext-to-the-Test.png'
description: 'I tried pretext, a little tool that figures out how text fits before the page even draws it, and this whole post is the demo, so see for yourself.'
tags: ['side-project', 'developer-tools', 'pretext', 'performance']
tech: ['TypeScript', 'React', 'Astro']
engine: pretext
---

So I tried pretext this weekend, and instead of just telling you about it, I figured it would be way cooler to let it build this whole page, so the squares you see are real and the words are flowing around them while they move, and the big letter at the start of each part keeps growing and shrinking while the text shuffles to make room, none of this is a picture, it is all happening right now, so just scroll slow and watch the words move.

## What is pretext

Okay so the simple way to put it, [pretext](https://pretextjs.dev/) is a little tool that figures out how text is going to sit on a page, how big it is and where each line breaks and all of that, before the page even draws it, and it does the whole thing with quick math.

Normally, if you want to know how much room some text takes up, you have to draw it first and then go measure it, which makes everything stop and wait for a moment, but pretext just works it out ahead of time, so there is no drawing first and no waiting around.

## What it can do

Because it already knows the shape of the text before anything shows up, you can do stuff that is normally kind of a pain, like wrapping words around a shape, you can see it bending around the squares up top, or growing a word so it fills its spot just right, or knowing how tall a chunk of text will be before you even see it.

And it is quick, quick enough that it can redo the whole thing over and over, many times a second, which is why the squares can bounce around and the words just keep filling in whatever space is left, and why those big letters can puff up and shrink back down while the text keeps shuffling around them.

## Why I like it

Here is the honest reason, for years now we have kind of been fighting the usual tools just to do simple things with text, lining it up, fitting it, wrapping it, figuring out how big it is, and pretext takes all that little stuff and turns it into easy math instead of guessing and hoping it looks right.

Once you see it work, going back to the old way just feels silly, and for anything where the text really matters, I think doing it like this is going to keep winning, and after messing with it for a weekend, yeah, I am sold.
