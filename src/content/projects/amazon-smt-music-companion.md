---
title: "Amazon SMT Music Companion"
description: "Firefox extension. Plays Atlus music while you browse Amazon."
category: "fun"
tags: ["JavaScript"]
github: "https://github.com/alex-papineau/amazon-smt-music-companion"
---

# Amazon SMT Music Companion

## How it works

### Tab tracking and playback
Background scripts watch tab navigation and activation across Amazon domains (`amazon.ca`, `amazon.com`, `amazon.co.uk`). Music starts when you switch to an Amazon tab and pauses when you switch away.

### Streaming and small footprint
Tracks stream on demand as compressed `.webm` files from GitHub Pages, so the add-on itself is only a few kilobytes. Buffering, volume, and seek position use the standard HTML5 Web Audio API.

### Session state
Playlist position, repeat toggle, and volume persist in `sessionStorage`.

### Overlays and controls
A "Now Playing" banner appears on the page when a new track starts. The toolbar popup lets you skip tracks, toggle shuffle, adjust volume, or turn the extension off.

## Installation

1. Clone or download the repo from GitHub.
2. Open `about:debugging` in Firefox.
3. Click **This Firefox** > **Load Temporary Add-on**.
4. Select `manifest.json`.
5. Head to any Amazon site to hear it in action.

NOT A FULL PLUGIN YET SORRY