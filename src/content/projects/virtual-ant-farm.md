---
title: "Virtual Ant Farm"
description: "2D Langton's ants (vants) simulation drawn on HTML5 Canvas pixel buffers."
category: "fun"
tags: ["JavaScript", "Canvas", "Simulation"]
link: "https://virtualantfarm.alexpapineau.com"
github: "https://github.com/alex-papineau/virtual-ant-farm"
showcase:
  type: "live-preview"
  url: "https://virtualantfarm.alexpapineau.com"
---

# Virtual Ant Farm

A 2D cellular automaton simulation of Virtual Ants (*vants*, or generalized Langton's ants), drawn with the HTML5 2D Canvas API and raw pixel buffer manipulation.

## How it works

### Grid state and pixel blitting
Board state is a 1D `Uint8Array` of size `width * height` holding binary cell values (`0` or `1`). Each frame writes into an `ImageData.data` buffer (`Uint8ClampedArray`) and flushes it to the canvas with `ctx.putImageData()`.

### Ant rules
Each ant tracks its `(x, y)` coordinate, heading (up, right, down, left), internal state, and a randomized transition table (`rules[state][color] -> [newColor, turn, newState]`). On every tick, an ant reads the color under it, flips that pixel's color, turns 90 degrees, and steps forward. Ants that walk off an edge wrap to the opposite side. If an ant paces inside a 4x4 area for more than 100 steps, a small turn perturbation breaks the loop.

### Controls
You can change how many steps run per `requestAnimationFrame` frame and how many ants spawn with random rulesets. You can also play, pause, single-step, re-seed, or clear the grid at any time.
