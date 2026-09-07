---
title: "Virtual Ant Farm"
description: "A 2D cellular automaton simulation based on generalized Langton's ants (vants) rendered directly using HTML5 Canvas pixel buffers."
category: "fun"
order: 2
tags: ["JavaScript", "HTML5 Canvas", "Simulation", "Cellular Automata"]
link: "https://virtualantfarm.alexpapineau.com"
github: "https://github.com/alex-papineau/virtual-ant-farm"
showcase:
  type: "live-preview"
  url: "https://virtualantfarm.alexpapineau.com"
  caption: "Interactive Virtual Ant Farm Simulation"
---

# Virtual Ant Farm

A 2D cellular automaton simulation based on Virtual Ants (*vants* / generalized Langton's ants) rendered directly using the HTML5 2D Canvas API and raw pixel buffers.

## How It Works

### 1. State & Grid Representation
- **Buffer Storage**: The simulation grid is stored in a 1D `Uint8Array` of size `width * height`, where each element represents binary cell state (`0` or `1`).
- **Direct Canvas Blitting**: Frame pixels are directly manipulated inside an `ImageData.data` buffer (`Uint8ClampedArray`) and blitted to the canvas on every animation frame via `ctx.putImageData()`.

### 2. Ant Automaton (Vant) Mechanics
- **State Machine**: Each ant tracks its `(x, y)` position, `orientation` (Up, Right, Down, Left), an internal `state`, and a randomized 3D transition rule table (`rules[state][color] -> [newColor, turn, newState]`).
- **Stepping Loop**: On each step, the ant reads the underlying cell color, updates the grid pixel color according to its rules, adjusts heading by `turn * 90°`, and advances forward.
- **Torus Wrapping**: Coordinates wrap around the canvas boundaries seamlessly.
- **Deadlock Perturbation**: If an ant remains confined within a 4x4 bounding box for more than 100 consecutive steps, a perturbation rotation is applied to break repetitive loops.

### 3. Simulation Controls
- **Speed**: Configures how many simulation steps execute per `requestAnimationFrame` cycle.
- **Population**: Adjusts the number of concurrent ants spawned with randomized rulesets and seeds.
- **Playback**: Interactive play, pause, step, restart, and clear actions to reset the simulation grid dynamically.
