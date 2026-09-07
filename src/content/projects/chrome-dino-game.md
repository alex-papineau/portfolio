---
title: "Chrome Dino Game Clone"
description: "Browser reproduction of the classic Chrome offline T-Rex endless runner game."
category: "fun"
order: 3
tags: ["JavaScript", "HTML5 Canvas", "Game Development"]
link: "https://chromedinogame.alexpapineau.com"
github: "https://github.com/alex-papineau"
showcase:
  type: "live-preview"
  url: "https://chromedinogame.alexpapineau.com"
  caption: "Playable Chrome Dino Game clone"
---

# Chrome Dino Game Clone

A recreation of Chromium's iconic offline T-Rex endless runner game built using vanilla JavaScript and the HTML5 2D Canvas API.

## How It Works

### 1. Game Loop & Frame Timing
- **Decoupled Physics**: Utilizes `requestAnimationFrame` with delta-time calculation to ensure constant game velocity and physics calculations regardless of display refresh rates (60Hz, 120Hz, 144Hz+).
- **State Machine**: Tracks global game states (`START`, `RUNNING`, `GAME_OVER`) controlling background animations, obstacle spawners, and canvas overlay resets.

### 2. Kinematics & Player Physics
- **Jump Mechanics**: Applies vertical velocity and constant gravity factors to simulate realistic jumping arcs and apex float.
- **Ducking State**: Dynamic collision hitbox adjustment when holding the down arrow, halving character height to dodge airborne obstacles.

### 3. Procedural Obstacles & Difficulty Scaling
- **Spawn Generator**: Randomly generates variable-sized cactus clusters and flying pterodactyls with altitude variations (low, mid, high).
- **Progressive Speed Scaling**: Ground scroll velocity and obstacle frequency gradually increase as the player's score increases, creating increasing difficulty.

### 4. Bounding Box Collision Detection
- **AABB Hit Testing**: Evaluates Axis-Aligned Bounding Box (AABB) intersection tests between player sprite bounds and incoming obstacle coordinates on every frame.
- **Score Persistence**: Tracks current score alongside high score records preserved in `localStorage`.
