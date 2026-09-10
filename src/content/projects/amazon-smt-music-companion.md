---
title: "Amazon SMT Music Companion"
description: "A Firefox extension that plays shop and black market music from Atlus games while browsing Amazon."
category: "fun"
order: 5
tags: ["Firefox Add-on", "WebExtension", "JavaScript", "Web Audio"]
github: "https://github.com/alex-papineau/amazon-smt-music-companion"
---

# Amazon SMT Music Companion

A Firefox extension that plays shop and "black market" background music from *Shin Megami Tensei* and *Persona* games while you browse Amazon. Originally built as a joke for friends.

## How It Works

### 1. Tab Tracking & Playback
- **Amazon Domain Detection**: Background scripts watch for navigation and active tab changes across international Amazon domains (`amazon.ca`, `amazon.com`, `amazon.co.uk`, `amazon.de`, `amazon.fr`, `amazon.it`, `amazon.es`, `amazon.co.jp`).
- **Contextual Playback**: Music starts automatically when switching to an Amazon tab and pauses the second you switch to something else.

### 2. Audio Streaming & Small Footprint
- **Remote Streaming**: Streams compressed `.webm` tracks on demand from GitHub Pages so the add-on download stays tiny (under a few kilobytes).
- **HTML5 Web Audio**: Handles buffering, volume adjustment, and seek positions using standard browser audio APIs.

### 3. Shuffle & Session State
- **Fisher-Yates Shuffle**: Cycles through 32 curated tracks without repeating any until the entire playlist has played.
- **Saved Settings**: Saves your current playlist spot, repeat toggle, and volume preference in `sessionStorage`.

### 4. Overlays & Controls
- **Toast Notifications**: Pops up a small "Now Playing" banner on the page whenever a new track starts.
- **Toolbar Popup**: Gives you controls right from the Firefox toolbar to skip tracks, toggle shuffle, adjust volume, or turn the extension off.

## Installation

1. Clone or download the repo from GitHub.
2. Open `about:debugging` in Firefox.
3. Click **This Firefox** > **Load Temporary Add-on**.
4. Select `manifest.json`.
5. Head to any Amazon site to hear it in action.