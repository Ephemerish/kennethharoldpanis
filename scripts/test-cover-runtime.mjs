import assert from "node:assert/strict";
import { test } from "node:test";
import { visibleAnimation, coverSize } from "../src/app/features/article/pretext/animation.ts";

function platform() {
  let intersect;
  let visibility;
  let next = 0;
  const queue = new Map();
  const environment = {
    hidden: () => environment.isHidden,
    isHidden: false,
    request: (fn) => { queue.set(++next, fn); return next; },
    cancel: (id) => queue.delete(id),
    observe: (_, fn) => { intersect = fn; return () => { intersect = undefined; }; },
    onVisibility: (fn) => { visibility = fn; return () => { visibility = undefined; }; },
  };
  return {
    environment, queue,
    intersect: (value) => intersect(value),
    hide: (value) => { environment.isHidden = value; visibility(); },
    frame: (now) => { const callbacks = [...queue.values()]; queue.clear(); callbacks.forEach(fn => fn(now)); },
  };
}

test("offscreen and hidden animations schedule no frames; visibility resumes them", () => {
  const p = platform();
  const frames = [];
  const dispose = visibleAnimation({}, dt => frames.push(dt), 20, p.environment);
  assert.equal(p.queue.size, 0);
  p.intersect(true);
  p.frame(100);
  p.frame(150);
  assert.equal(frames.length, 1);
  p.intersect(false);
  assert.equal(p.queue.size, 0);
  p.intersect(true);
  p.hide(true);
  assert.equal(p.queue.size, 0);
  p.hide(false);
  p.frame(10000);
  p.frame(10050);
  assert.equal(frames.length, 2);
  assert.equal(frames[1], 0.05);
  dispose();
  assert.equal(p.queue.size, 0);
});

test("animation respects the frame limit and leaves only one pending callback", () => {
  const p = platform();
  let count = 0;
  visibleAnimation({}, () => { count++; }, 20, p.environment);
  p.intersect(true);
  p.intersect(true);
  for (let now = 0; now <= 1000; now += 10) p.frame(now);
  assert.equal(count, 20);
  assert.equal(p.queue.size, 1);
});

test("large Retina covers have a bounded drawing surface and keep their aspect ratio", () => {
  const big = coverSize(1920, 1080, 3);
  assert.equal(big.width, 640);
  assert.equal(big.height, 360);
  assert.equal(big.pixelWidth, 960);
  assert.equal(big.pixelHeight, 540);
  const small = coverSize(355, 200, 2);
  assert.equal(small.width, 355);
  assert.ok(small.pixelWidth <= 960);
  const tall = coverSize(1000, 2000, 2);
  assert.equal(tall.height, 360);
  assert.equal(tall.width, 180);
});
