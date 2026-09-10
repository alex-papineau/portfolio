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
- **1D Array Grid**: Stores board states in a 1D `Uint8Array` of size `width * height`, tracking binary cell values (`0` or `1`).
- **Direct Canvas Blitting**: Writes directly into an `ImageData.data` buffer (`Uint8ClampedArray`) and flushes it onto the canvas every frame with `ctx.putImageData()` for fast rendering.

### 2. Ant Automaton (Vant) Rules
- **State Machine**: Each ant keeps track of its `(x, y)` coordinate, heading (Up, Right, Down, Left), current internal state, and a randomized transition table (`rules[state][color] -> [newColor, turn, newState]`).
- **Step Loop**: On each tick, the ant reads the color under its feet, flips the pixel color, changes its heading by 90°, and steps forward.
- **Torus Wrapping**: Ants that walk off the edge wrap smoothly around to the opposite side of the screen.
- **Anti-Loop Perturbation**: If an ant gets stuck pacing inside a 4x4 area for more than 100 steps, a small turn perturbation kicks in to break repetitive loops.

### 3. Interactive Controls
- **Simulation Speed**: Adjust how many steps run per `requestAnimationFrame` frame.
- **Population Slider**: Change the number of active ants spawned with random rulesets.
- **Playback Controls**: Play, pause, single-step, re-seed, or clear the grid anytime.
