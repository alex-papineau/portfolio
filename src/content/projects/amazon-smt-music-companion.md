---
title: "Amazon SMT Music Companion"
description: "A Firefox extension that plays shop and black market music from Atlus games while browsing Amazon."
category: "fun"
order: 2
tags: ["Firefox Add-on", "WebExtension", "JavaScript", "Web Audio"]
github: "https://github.com/alex-papineau/amazon-smt-music-companion"
---

# Amazon SMT Music Companion

A Firefox extension that plays shop and "black market" music from *Atlus* games while you browse Amazon. Made as a joke for friends.

## Features

- **Contextual Playback**: Music starts automatically when navigating to Amazon domains (`amazon.ca`, `amazon.com`, `amazon.co.uk`, `amazon.de`, `amazon.fr`, `amazon.it`, `amazon.es`, `amazon.co.jp`) and automatically pauses when switching to non-Amazon tabs.
- **Deck Shuffle Queue**: Uses a Fisher-Yates shuffle queue to cycle through all 32 available tracks before repeating, stored in session storage.
- **Playback Controls**: The toolbar popup provides full controls: power toggle, song selection, seek bar, time display, volume adjustment, restart track, next random track, and single-track repeat.
- **Now Playing Notification**: Injects a custom styled toast notification into the Amazon page whenever a track starts or changes.
- **Audio Streaming**: Streams audio tracks directly from GitHub Pages (`.webm` format) to keep the extension bundle lightweight.