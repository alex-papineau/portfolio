---
title: "Amazon SMT Music Companion"
description: "A Firefox extension that plays shop and black market music from Atlus games while browsing Amazon."
category: "fun"
tags: ["Firefox Add-on", "WebExtension", "JavaScript", "Web Audio"]
github: "https://github.com/alex-papineau/amazon-smt-music-companion"
---

# Amazon SMT Music Companion

A Firefox extension that plays shop and "black market" background music from *Atlus* games while you browse Amazon. Originally built as a joke for friends.

## How It Works

### 1. Tab Tracking & Playback
Background scripts watch tab navigation and activation across international Amazon domains (`amazon.ca`, `amazon.com`, `amazon.co.uk`). Music starts the moment you switch to an Amazon tab and pauses the second you switch away.

### 2. Audio Streaming & Small Footprint
Tracks stream on demand as compressed `.webm` files from GitHub Pages, which keeps the add-on's own download under a few kilobytes. Buffering, volume, and seek position all run through the standard HTML5 Web Audio API.

### 3. Shuffle & Session State
A Fisher-Yates shuffle cycles through 32 curated tracks without repeats until the whole playlist has played. Your playlist position, repeat toggle, and volume preference persist in `sessionStorage`.

### 4. Overlays & Controls
A small "Now Playing" banner pops up on the page whenever a new track starts. The Firefox toolbar popup gives you controls to skip tracks, toggle shuffle, adjust volume, or turn the extension off.

## Installation

1. Clone or download the repo from GitHub.
2. Open `about:debugging` in Firefox.
3. Click **This Firefox** > **Load Temporary Add-on**.
4. Select `manifest.json`.
5. Head to any Amazon site to hear it in action.
