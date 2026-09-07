---
title: "Amazon SMT Music Companion"
description: "A Firefox extension that plays shop and black market music from Atlus games while browsing Amazon."
category: "fun"
order: 5
tags: ["Firefox Add-on", "WebExtension", "JavaScript", "Web Audio"]
github: "https://github.com/alex-papineau/amazon-smt-music-companion"
---

# Amazon SMT Music Companion

A Firefox browser extension that automatically streams shop and "black market" background music from *Atlus* games while you browse Amazon domains.

A Firefox extension that plays shop and "black market" music from *Atlus* games while you browse Amazon. Made as a joke for friends.

## How It Works

### 1. Background Service & Contextual Tab Tracking
- **Domain Whitelist**: Background scripts monitor tab activation and navigation events across international Amazon top-level domains (`amazon.ca`, `amazon.com`, `amazon.co.uk`, `amazon.de`, `amazon.fr`, `amazon.it`, `amazon.es`, `amazon.co.jp`).
- **Contextual Playback**: Audio playback starts automatically upon entering an Amazon tab and seamlessly pauses whenever the user switches away to other tabs or windows.

### 2. Audio Streaming & Lightweight Distribution
- **Remote Streaming**: Streams compressed `.webm` audio tracks on-demand directly from GitHub Pages rather than bundling heavy media files locally, keeping the extension download footprint under a few kilobytes.
- **HTML5 Web Audio**: Manages stream buffering, volume normalization, and seek positioning via native HTML5 Audio elements.

### 3. Deck Shuffle State Machine
- **Fisher-Yates Deck Queue**: Employs an in-memory Fisher-Yates deck shuffle algorithm to cycle through all 32 curated tracks without repeats until the entire queue is exhausted.
- **Session Persistence**: Maintains shuffle queue index, repeat toggle, and volume preferences in `sessionStorage` across page reloads.

### 4. In-Page Overlays & Toolbar Controls
- **Toast Notifications**: Dynamically injects styled "Now Playing" notification banners into the active webpage DOM when tracks transition.
- **Toolbar Popup UI**: Full browser action popup providing quick track jumping, shuffle toggles, volume sliders, seek controls, and power toggles.

## Installation

1. Clone or download the repository from GitHub.
2. Navigate to `about:debugging` in Firefox.
3. Click **This Firefox** > **Load Temporary Add-on**.
4. Select `manifest.json`.
5. Visit any Amazon domain to activate background audio.