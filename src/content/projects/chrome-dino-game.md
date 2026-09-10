---
title: "Chrome Dino Game Clone"
description: "Browser reproduction of the classic Chrome offline T-Rex endless runner game."
category: "fun"
tags: ["JavaScript", "HTML5 Canvas", "Game Development"]
link: "https://chromedinogame.alexpapineau.com"
github: "https://github.com/alex-papineau"
showcase:
  type: "live-preview"
  url: "https://chromedinogame.alexpapineau.com"
  caption: "Playable Chrome Dino Game clone"
---

# Chrome Dino Game Clone

A browser-based remake of Google Chrome's offline T-Rex runner game built from scratch with vanilla JavaScript and the HTML5 2D Canvas API.

## How It Works

### 1. Game Loop & Frame Timing
- **Delta-Time Physics**: Uses `requestAnimationFrame` with delta-time calculations so the game speed and jumping physics stay consistent across 60Hz, 120Hz, or 144Hz monitors.
- **State Flow**: Manages transitions between start, running, and game-over states to handle resets and obstacle spawning smoothly.

### 2. Movement & Physics
- **Jumping**: Applies constant gravity and upward velocity to create a smooth, responsive jump arc.
- **Ducking**: Pressing the down arrow shrinks the collision box by half so you can duck under flying pterodactyls.

### 3. Procedural Obstacles & Scaling Difficulty
- **Obstacle Spawns**: Randomly generates variable cactus patches and flying obstacles at varying heights.
- **Speed Ramping**: Running speed gradually increases as your score climbs, keeping the pacing challenging.

### 4. Collisions & High Scores
- **AABB Hit Detection**: Checks Axis-Aligned Bounding Box overlaps between the dinosaur sprite and active obstacles on every animation frame.
- **Saved High Scores**: Remembers your all-time high score in `localStorage`.
