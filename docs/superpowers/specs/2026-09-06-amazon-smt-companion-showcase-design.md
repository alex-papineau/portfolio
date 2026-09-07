# Architecture Design Specification: 1:1 Amazon SMT Music Companion Showcase

**Date:** 2026-09-06  
**Status:** In Review  
**Author:** AI Agent & Alex Papineau  

---

## 1. Overview & Goals

This specification details the architecture for integrating the **Amazon SMT Music Companion** Firefox extension ([`alex-papineau/amazon-smt-music-companion`](https://github.com/alex-papineau/amazon-smt-music-companion)) into the portfolio website as a fully functional, 1:1 interactive project showcase.

### Key Objectives:
1. **1:1 Code Execution**: The extension's original source code (`popup.html`, `popup.css`, `popup.js`, `background.js`, `config.js`, `Content.js`, `Content.css`, `font/`, `assets/`) runs completely intact without converting or re-implementing its core logic in React or Astro components.
2. **Simulated Browser Sandbox**: A browser window component styled to match the portfolio's retro-cyber aesthetic, featuring a tab bar (`amazon.ca`, `wikipedia.org`, `google.com`), an address bar, and a toolbar extension button.
3. **WebExtension API Bridge**: A lightweight runtime shim (`chrome-runtime-shim.js`) that provides standard `chrome.*` APIs (`chrome.storage.local`, `chrome.runtime`, `chrome.tabs`, `chrome.windows`, `chrome.alarms`) across the background coordinator, the toolbar popup, and the active webpage viewport.
4. **Authentic Extension Mechanics**:
   - **Tab-Aware Playback**: Audio streams directly from GitHub Pages (`https://alex-papineau.github.io/amazon-smt-music-companion/music/`) while `amazon.ca` is active. Switching to non-Amazon tabs pauses playback; returning resumes it.
   - **Toolbar Popup HUD**: Clicking the Press Turn icon in the toolbar toggles the authentic SMT HUD (`popup.html`) with song selection, seek bar, time display, neon play/pause toggle, volume slider, restart, random, and repeat controls.
   - **Content Script Toast**: Visiting or switching to `amazon.ca` triggers `Content.js`, which renders the samurai `#smt4-toast` notification ("Now Playing: [Track Name]") in the bottom-right corner using the authentic `Megaten20XX` font.
5. **Lifecycle & Teardown**: Proper suspension and teardown of audio and event listeners upon Astro view transitions (`astro:before-swap`).

---

## 2. File Organization & 1:1 Asset Placement

The extension source files will reside in `public/showcases/amazon-smt-companion/`, served as raw static assets so HTML, CSS, fonts, and scripts resolve relative paths naturally:

```text
public/showcases/amazon-smt-companion/
├── manifest.json
├── config.js                       # 1:1 track definitions and helpers
├── background.js                   # 1:1 background script audio engine
├── Content.js                      # 1:1 Amazon page content script
├── Content.css                     # 1:1 samurai toast notification styles
├── runtime/
│   └── chrome-runtime-shim.js      # WebExtension API bridge
├── assets/
│   └── press-turn.png              # Status / toolbar action icon
├── font/
│   └── Megaten20XX.woff            # SMT font used by Content.css and popup.css
└── popup/
    ├── popup.html                  # 1:1 popup layout
    ├── popup.css                   # 1:1 HUD styling and glitch effects
    └── popup.js                    # 1:1 popup event handling and progress polling
```

---

## 3. WebExtension Runtime Shim (`chrome-runtime-shim.js`)

To enable `background.js`, `popup.js`, and `Content.js` to execute without a real browser extension harness, a shared runtime shim provides standard Chrome extension APIs:

### 3.1 Storage API (`chrome.storage.local`)
* In-memory / session state backing:
  - `enabled`: boolean (default: `true`)
  - `volume`: number (default: `50`)
  - `track`: string (default: initial random track from `config.js`)
  - `repeat`: boolean (default: `false`)
* `get(keys, callback)`: returns requested state slices asynchronously.
* `set(items, callback)`: updates storage and dispatches `onChanged` events to all registered listeners.
* `onChanged.addListener(cb)`: triggers when storage updates occur from either the popup or background script.

### 3.2 Runtime Messaging API (`chrome.runtime`)
* `sendMessage(message, callback)`: routes messages between contexts (`popup`, `content`, `background`).
  - `AMAZON_VISITED` -> invokes `background.js` handler to return `{ trackName }`.
  - `FORCE_PLAY`, `FORCE_PAUSE`, `RANDOMIZE_TRACK`, `RESTART_TRACK`, `SEEK_TRACK`.
  - `GET_PROGRESS` -> returns `{ currentTime, duration, paused }`.
  - `USER_INTERACTED` -> unlocks audio playback after first user click.
* `onMessage.addListener(cb)`: registers background and popup message receivers.
* `connect({ name })` & `onConnect.addListener(cb)`: mock port for Firefox keep-alive pings.

### 3.3 Tabs & Windows APIs (`chrome.tabs`, `chrome.windows`)
* Maintains simulated browser window state:
  - `activeTab`: `{ id: 1, url: 'https://www.amazon.ca', active: true }`
* `tabs.onActivated`, `tabs.onUpdated`: fired when user switches or changes tabs in the mock browser.
* `windows.getLastFocused({ populate: true }, callback)`: returns `{ tabs: [activeTab] }`.
* `windows.onFocusChanged`: tracks window focus.

---

## 4. Showcase Component Architecture

### 4.1 Component Hierarchy
* `src/components/showcases/AmazonSmtShowcase.astro`: Main showcase container.
  * **Browser Header & Tab Bar**:
    - Tabs: `[ amazon.ca ]`, `[ wikipedia.org ]`, `[ google.com ]`
    - New tab / switch tab actions.
  * **Toolbar**:
    - Back / Forward / Refresh buttons.
    - URL bar showing active domain.
    - Extension toolbar icon (`press-turn.png`) with active/glow state.
  * **Popup Dropdown Overlay**:
    - Embedded `<iframe>` pointing to `/showcases/amazon-smt-companion/popup/popup.html`.
    - Positioned directly below the toolbar icon.
  * **Viewport Frame**:
    - Active simulated page view.
    - When `amazon.ca` is active, displays a lightweight mock Amazon page and executes `Content.js` & `Content.css`.
    - Shows authentic `#smt4-toast` notification on load or track change.
  * **Source Code Inspector**:
    - Collapsible source viewer (`[ SOURCE CODE: background.js | popup.js | Content.js ]`) matching [`GameOfLifeShowcase.astro`](file:///C:/Dev/portfolio/src/components/showcases/GameOfLifeShowcase.astro).

---

## 5. Audio Playback & Browser Autoplay Strategy

1. **GitHub Pages Stream**: Tracks stream directly from `https://alex-papineau.github.io/amazon-smt-music-companion/music/*.webm`.
2. **Autoplay Policy Handling**: Modern browsers block audio until user interaction. The sandbox displays an initial subtle banner or auto-activates audio on the first user click anywhere inside the simulated browser (firing `USER_INTERACTED` to `background.js`).
3. **Astro Navigation Cleanup**:
   - Audio is paused and event listeners detached during `astro:before-swap` to prevent audio leaking into other portfolio pages.

---

## 6. Content Collection Schema & Project Page Updates

1. **`src/content.config.ts`**:
   - Expand `showcase.type` enum:
     ```typescript
     type: z.enum([
       "live-preview",
       "game-of-life",
       "amazon-smt-companion",
       "image",
       "none",
     ]).default("image"),
     ```
2. **`src/components/showcases/ProjectShowcase.astro`**:
   - Add conditional rendering for `showcaseType === 'amazon-smt-companion'`.
3. **`src/content/projects/amazon-smt-music-companion.md`**:
   - Update frontmatter:
     ```yaml
     showcase:
       type: "amazon-smt-companion"
     ```
   - Update markdown content with comprehensive project description, features, architecture breakdown, and links.

---

## 7. Verification & Testing Plan

1. **Audio Playback Test**: Confirm tracks play smoothly from `alex-papineau.github.io` on user interaction.
2. **Domain Switch Test**:
   - Start on `amazon.ca` -> music plays, SMT toast displays.
   - Switch to `wikipedia.org` -> music automatically pauses, popup status updates to `OFFLINE`.
   - Return to `amazon.ca` -> music automatically resumes, popup status returns to `ONLINE`.
3. **Popup Controls Test**:
   - Open popup menu -> verify Song Select dropdown contains all 32 tracks.
   - Test Seek bar, Play/Pause toggle, Volume slider, Restart, Random, and Repeat buttons.
4. **Toast Notification Test**:
   - Confirm `#smt4-toast` appears with `Megaten20XX` font and fades out after 5 seconds.
5. **Astro Lifecycle Test**:
   - Navigate away to another portfolio page -> confirm audio stops cleanly and no memory leaks occur.
