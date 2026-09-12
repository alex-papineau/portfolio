---
title: "Virtual Ant Farm"
description: "A 2D cellular automaton simulation based on generalized Langton's ants (vants) rendered directly using HTML5 Canvas pixel buffers."
category: "fun"
tags: ["JavaScript", "HTML5 Canvas", "Simulation", "Cellular Automata"]
link: "https://virtualantfarm.alexpapineau.com"
github: "https://github.com/alex-papineau/virtual-ant-farm"
showcase:
  type: "live-preview"
  url: "https://virtualantfarm.alexpapineau.com"
  caption: "Interactive Virtual Ant Farm Simulation"
---

# Virtual Ant Farm

A 2D cellular automaton simulation based on Virtual Ants (*vants*, or generalized Langton's ants), rendered directly using the HTML5 2D Canvas API and raw pixel buffer manipulation.

## How It Works

### 1. Grid State & Direct Pixel Blitting
Board state lives in a 1D `Uint8Array` of size `width * height`, tracking binary cell values (`0` or `1`). Each frame writes directly into an `ImageData.data` buffer (`Uint8ClampedArray`) and flushes it to the canvas with `ctx.putImageData()`.

### 2. Ant Automaton (Vant) Rules
Each ant tracks its `(x, y)` coordinate, heading (up, right, down, left), current internal state, and a randomized transition table (`rules[state][color] -> [newColor, turn, newState]`). On every tick, an ant reads the color under its feet, flips that pixel's color, turns 90 degrees, and steps forward. Ants that walk off the edge wrap around to the opposite side of the screen. If an ant gets stuck pacing inside a 4x4 area for more than 100 steps, a small turn perturbation kicks in to break the loop.

### 3. Interactive Controls
You can adjust how many steps run per `requestAnimationFrame` frame, change the number of active ants spawned with random rulesets, and play, pause, single-step, re-seed, or clear the grid at any time.
