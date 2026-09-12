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
`requestAnimationFrame` runs on delta-time calculations, so game speed and jumping physics stay consistent whether the monitor is 60Hz, 120Hz, or 144Hz. A state machine handles transitions between start, running, and game-over, resetting the board and spawning obstacles as needed.

### 2. Movement & Physics
Jumping applies constant gravity plus an initial upward velocity for a smooth arc. Pressing the down arrow shrinks the collision box by half so you can duck under flying pterodactyls.

### 3. Procedural Obstacles & Scaling Difficulty
Cactus patches and flying obstacles spawn at random heights and positions. Running speed increases gradually as your score climbs.

### 4. Collisions & High Scores
Axis-aligned bounding box checks run between the dinosaur sprite and active obstacles on every animation frame. Your all-time high score is saved in `localStorage`.
