---
title: "Conway's Game of Life"
description: "Interactive canvas implementation of Conway's cellular automaton with drawing controls and presets."
category: "fun"
order: 1
tags: ["TypeScript", "HTML5 Canvas", "Algorithms", "Simulation"]
heroImage: "/thumbnails/game-of-life.webp"
showcase:
  type: "game-of-life"
  caption: "Interactive Conway's Game of Life simulation"
---

# Conway's Game of Life

An interactive HTML5 Canvas version of John Conway's zero-player cellular automaton, featuring continuous generation stepping, canvas painting controls, and real-time generation counts.

## Rules of Life

- **Underpopulation**: Any live cell with fewer than two live neighbors dies.
- **Survival**: Any live cell with two or three live neighbors lives on to the next generation.
- **Overpopulation**: Any live cell with more than three live neighbors dies.
- **Reproduction**: Any dead cell with exactly three live neighbors turns into a live cell.

## How It Works

### 1. Grid Representation & Double-Buffering
- **Typed Arrays**: Stores the grid in a 1D `Uint8Array` based on the canvas dimensions and cell scale.
- **Buffer Swapping**: Reads from the current state and writes into an off-screen buffer before swapping them, avoiding race conditions while evaluating neighbor states.

### 2. Torus Edge Wrapping
- **Moore Neighborhood**: Evaluates all 8 adjacent cells for every coordinate on the board.
- **Wrapping Borders**: Uses modulo math on the edges so gliders and patterns wrap around the screen edges seamlessly instead of bumping into walls.

### 3. Batched Canvas Rendering
- **Single Path Draw**: Batches all live cells into one combined `beginPath()` / `rect()` / `fill()` sequence per frame, keeping frame rates rock-solid even on large grids.

### 4. User Interaction & Lifecycle
- **Click to Draw**: Translates mouse clicks directly to grid coordinates so you can draw or clear cells while the simulation runs or while paused.
- **Throttled Tick**: Runs on `requestAnimationFrame` throttled to roughly 65ms per generation step for comfortable viewing.
- **Astro SPA Clean-up**: Listens to Astro's `astro:before-swap` and `astro:page-load` events to cancel animation loops and avoid memory leaks during page navigation.
