---
title: "Conway's Game of Life"
description: "Interactive canvas implementation of Conway's cellular automaton with drawing controls and presets."
category: "fun"
tags: ["TypeScript", "HTML5 Canvas", "Algorithms", "Simulation"]
heroImage: "/thumbnails/game-of-life.webp"
showcase:
  type: "game-of-life"
  caption: "Interactive Conway's Game of Life simulation"
---

# Conway's Game of Life

An interactive HTML5 Canvas version of John Conway's zero-player cellular automaton, with continuous generation stepping, canvas painting controls, and a running generation count.

## Rules of Life

- **Underpopulation**: Any live cell with fewer than two live neighbors dies.
- **Survival**: Any live cell with two or three live neighbors lives on to the next generation.
- **Overpopulation**: Any live cell with more than three live neighbors dies.
- **Reproduction**: Any dead cell with exactly three live neighbors turns into a live cell.

## How It Works

### 1. Grid Representation & Double-Buffering
The grid lives in a 1D `Uint8Array` sized to the canvas dimensions and cell scale. Each generation reads from the current state and writes into an off-screen buffer, then swaps them, which avoids race conditions while evaluating neighbor states.

### 2. Torus Edge Wrapping
Every coordinate on the board checks its full Moore neighborhood, the 8 adjacent cells. Modulo math on the edges lets gliders and other patterns wrap around the screen instead of hitting a wall.

### 3. Batched Canvas Rendering
All live cells for a frame batch into one combined `beginPath()` / `rect()` / `fill()` sequence, which keeps frame rates steady even on large grids.

### 4. User Interaction & Lifecycle
Mouse clicks translate directly to grid coordinates, so you can draw or clear cells whether the simulation is running or paused. The tick loop runs on `requestAnimationFrame`, throttled to roughly 65ms per generation step. Astro's `astro:before-swap` and `astro:page-load` events cancel the animation loop on page navigation to avoid memory leaks.
