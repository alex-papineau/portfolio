---
title: "Chrome Dino Game Clone"
description: "Browser remake of Chrome's offline T-Rex runner."
category: "fun"
tags: ["JavaScript", "Canvas"]
link: "https://chromedinogame.alexpapineau.com"
github: "https://github.com/alex-papineau"
showcase:
  type: "live-preview"
  url: "https://chromedinogame.alexpapineau.com"
---

# Chrome Dino Game Clone

A browser remake of Chrome's offline T-Rex runner, built from scratch with vanilla JavaScript and the HTML5 2D Canvas API.

## How it works

### Game loop and frame timing
`requestAnimationFrame` runs on delta-time calculations, so game speed and jump physics stay the same on 60Hz, 120Hz, and 144Hz monitors. A state machine handles start, running, and game-over, resetting the board and spawning obstacles as needed.

### Movement and physics
Jumping applies constant gravity plus an initial upward velocity, which gives a smooth arc. Pressing the down arrow halves the collision box so you can duck under flying pterodactyls.

### Obstacles and difficulty
Cactus patches and flying obstacles spawn at random heights and positions. Running speed increases as your score climbs.

### Collisions and high scores
Every frame, axis-aligned bounding box checks compare the dinosaur sprite against active obstacles. Your all-time high score is saved in `localStorage`.
