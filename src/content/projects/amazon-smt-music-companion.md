---
title: "Amazon SMT Music Companion"
description: "A Firefox extension that dynamically plays shop and black market music from Shin Megami Tensei and Persona games while you browse Amazon."
category: "fun"
order: 2
tags: ["WebExtension", "JavaScript", "Web Audio", "Firefox Add-on", "Atlus"]
github: "https://github.com/alex-papineau/amazon-smt-music-companion"
showcase:
  type: "amazon-smt-companion"
---

# Amazon SMT Music Companion

**Amazon SMT Music Companion** is a Manifest V3 browser extension for Mozilla Firefox that brings the stylish, atmospheric shopping themes from ATLUS's legendary *Shin Megami Tensei* and *Persona* franchises directly into your everyday Amazon shopping experience.

---

## Core Mechanics & Architecture

### 1. Contextual Tab Detection
The background service coordinator monitors active browser tabs in real-time. Audio automatically begins when you navigate to supported Amazon domains (`amazon.ca`, `amazon.com`, `amazon.co.uk`, etc.) and automatically pauses the moment you switch to other tabs or minimize the browser window.

### 2. Fisher-Yates Shuffled Deck Queue
Instead of naive random selection that often repeats the same songs, the playback engine uses a Fisher-Yates deck shuffle queue persisted via `chrome.storage.session`. Every track in the 32-song collection plays before the deck is replenished and reshuffled.

### 3. Cyber HUD Popup Interface
Built with authentic ATLUS SMT aesthetics, custom `Megaten20XX` typography, and glitch headers:
- **Song Select**: Instant dropdown access to 32 tracks spanning *SMT IV*, *SMT III Nocturne*, *Devil Summoner*, *Majin Tensei*, *Digital Devil Saga*, *Persona 1/2/3*, and more.
- **Precision Seeking**: Real-time progress bar with seeking and `mm:ss` timestamp tracking.
- **Controls**: Neon power toggle, **Restart**, **Random** (advance queue), and **Repeat** (single track loop).
- **Master Volume**: Smooth volume mixer stored persistently in `chrome.storage.local`.

### 4. In-Page Samurai Toast Notification
When navigating Amazon or selecting a new track, the content script renders a customized fixed HUD notification banner in the bottom-right corner declaring the current active track with slide-in and fade-out animations.