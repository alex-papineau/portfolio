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

An interactive HTML5 Canvas implementation of John Conway's famous zero-player cellular automaton, featuring continuous simulation loop stepping, real-time drawing controls, and generation tracking.

## Rules of Life

- **Underpopulation**: Any live cell with fewer than two live neighbours dies.
- **Survival**: Any live cell with two or three live neighbours lives on to the next generation.
- **Overpopulation**: Any live cell with more than three live neighbours dies.
- **Reproduction**: Any dead cell with exactly three live neighbours becomes a live cell.

## How It Works

### 1. Grid Representation & Double-Buffering
- **Typed Array State**: The grid is represented as a 2D matrix of `Uint8Array` columns (`cols * rows` calculated from canvas pixel dimensions and cell size).
- **Generation Swapping**: On every step, a fresh `next` grid buffer is computed and atomically assigned, preventing race conditions or premature state mutations during neighbor evaluation.

### 2. Torus Boundary & Neighbor Evaluation
- **Moore Neighborhood**: For each cell, the algorithm evaluates all 8 adjacent neighbors (`dx, dy ∈ [-1, 0, 1]`).
- **Seamless Edge Wrapping**: Torus topology is enforced using modulo arithmetic (`(x + dx + cols) % cols` and `(y + dy + rows) % rows`), allowing gliders and patterns to cross seamlessly across canvas edges.

### 3. Canvas Batch Rendering
- **Path Batching**: Rather than executing individual fill calls per cell, all active cells are queued into a single compound path using `ctx.beginPath()`, repeated `ctx.rect()`, and a single `ctx.fill()` invocation, maximizing rendering throughput.

### 4. Interactive Controls & Lifecycle Management
- **Interactive Painting**: Canvas click events map cursor coordinates relative to canvas bounding boxes, allowing users to toggle cell states live during playback or while paused.
- **Throttled Loop**: `requestAnimationFrame` loop maintains a steady 65ms generation tick interval.
- **Astro Lifecycle Integration**: Hooks into Astro's `astro:before-swap` and `astro:page-load` events to cleanly terminate animation frames and prevent memory leaks during SPA page transitions.
