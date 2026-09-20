---
title: "Conway's Game of Life"
description: "Canvas version of Conway's Game of Life with drawing controls and presets."
category: "fun"
tags: ["TypeScript", "Canvas", "Simulation"]
heroImage: "/thumbnails/game-of-life.webp"
showcase:
  type: "game-of-life"
---

# Conway's Game of Life

An interactive HTML5 Canvas version of John Conway's zero-player cellular automaton. It steps through generations continuously, lets you paint cells on the canvas, and shows a running generation count.

## Rules

- Underpopulation: a live cell with fewer than two live neighbors dies.
- Survival: a live cell with two or three live neighbors lives on.
- Overpopulation: a live cell with more than three live neighbors dies.
- Reproduction: a dead cell with exactly three live neighbors becomes alive.

## How it works

### Grid and double buffering
The grid is a 1D `Uint8Array` sized to the canvas dimensions and cell scale. Each generation reads the current state and writes to an off-screen buffer, then swaps them, so neighbor states are never read mid-update.

### Torus edge wrapping
Each cell checks its full Moore neighborhood, the 8 adjacent cells. Modulo math at the edges lets gliders and other patterns wrap around the screen instead of hitting a wall.

### Batched rendering
All live cells in a frame go into one `beginPath()` / `rect()` / `fill()` sequence, which keeps frame rates steady on large grids.

### Interaction and lifecycle
Mouse clicks map to grid coordinates, so you can draw or clear cells while the simulation runs or is paused. The tick loop runs on `requestAnimationFrame`, throttled to roughly 65ms per generation. Astro's `astro:before-swap` and `astro:page-load` events cancel the loop on page navigation to avoid memory leaks.
