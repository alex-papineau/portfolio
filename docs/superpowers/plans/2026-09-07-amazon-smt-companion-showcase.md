# 1:1 Amazon SMT Music Companion Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the Amazon SMT Music Companion Firefox extension into the portfolio website as an interactive, 1:1 showcase featuring a simulated browser with tab switching, toolbar popup HUD, live audio streaming from GitHub Pages, and in-page samurai toast notifications.

**Architecture:** The extension files (`background.js`, `popup/*`, `content.*`, `config.js`, fonts, assets) run directly without code translation inside a sandboxed WebExtension runtime (`chrome-runtime-shim.js`). A simulated browser component (`AmazonSmtShowcase.astro`) hosts tabs (`amazon.ca`, `wikipedia.org`, `google.com`), an address bar, an extension toolbar button that toggles the authentic popup HUD iframe, and injects `content.js` to trigger samurai toasts.

**Tech Stack:** Astro, Tailwind CSS, TypeScript, Web Audio API / HTML5 Audio, WebExtension API Shim, Node.js built-in test runner (`node --test`).

**Spec:** [`docs/superpowers/specs/2026-09-06-amazon-smt-companion-showcase-design.md`](file:///C:/Dev/portfolio/docs/superpowers/specs/2026-09-06-amazon-smt-companion-showcase-design.md)

## Global Constraints

- Extension files must run 1:1 without rewriting business logic or UI in React/Astro.
- Audio streams directly from `https://alex-papineau.github.io/amazon-smt-music-companion/music/`.
- All background audio and event listeners must be safely torn down during `astro:before-swap` transitions.
- Styling must conform to the portfolio theme's cyber/terminal dark aesthetic (`border-border`, Atkinson/monospace fonts, `#0c0c12`, `#141320`).

---

### Task 1: Ingest 1:1 Extension Files into Public Directory

**Files:**
- Create: `public/showcases/amazon-smt-companion/manifest.json`
- Create: `public/showcases/amazon-smt-companion/config.js`
- Create: `public/showcases/amazon-smt-companion/background.js`
- Create: `public/showcases/amazon-smt-companion/content.js`
- Create: `public/showcases/amazon-smt-companion/content.css`
- Create: `public/showcases/amazon-smt-companion/popup/popup.html`
- Create: `public/showcases/amazon-smt-companion/popup/popup.css`
- Create: `public/showcases/amazon-smt-companion/popup/popup.js`
- Create: `public/showcases/amazon-smt-companion/assets/press-turn.png`
- Create: `public/showcases/amazon-smt-companion/font/Megaten20XX.woff`

**Interfaces:**
- Consumes: Raw files from repository `alex-papineau/amazon-smt-music-companion`
- Produces: Static directory `public/showcases/amazon-smt-companion/` served by Astro at `/showcases/amazon-smt-companion/`

- [ ] **Step 1: Download binary font and asset files**

Download `Megaten20XX.woff` and `press-turn.png` from `https://raw.githubusercontent.com/alex-papineau/amazon-smt-music-companion/main/` into their respective directories under `public/showcases/amazon-smt-companion/`.

- [ ] **Step 2: Write manifest, config, background, content, and popup files**

Populate the 8 text/code files verbatim from the GitHub repository into `public/showcases/amazon-smt-companion/`:
- `manifest.json`
- `config.js`
- `background.js`
- `content.js`
- `content.css`
- `popup/popup.html`
- `popup/popup.css`
- `popup/popup.js`

- [ ] **Step 3: Verify all 10 assets exist and are non-empty**

Run: `node -e "const fs = require('fs'); const files = ['manifest.json', 'config.js', 'background.js', 'content.js', 'content.css', 'popup/popup.html', 'popup/popup.css', 'popup/popup.js', 'assets/press-turn.png', 'font/Megaten20XX.woff']; files.forEach(f => { const p = 'public/showcases/amazon-smt-companion/' + f; if (!fs.existsSync(p) || fs.statSync(p).size === 0) throw new Error('Missing or empty: ' + f); }); console.log('All 10 extension assets verified!');"`
Expected: "All 10 extension assets verified!"

- [ ] **Step 4: Commit**

```bash
git add public/showcases/amazon-smt-companion/
git commit -m "feat: add 1:1 Amazon SMT Music Companion extension assets"
```

---

### Task 2: Build and Test the WebExtension Runtime Shim

**Files:**
- Create: `public/showcases/amazon-smt-companion/runtime/chrome-runtime-shim.js`
- Create: `tests/chrome-runtime-shim.test.mjs`

**Interfaces:**
- Consumes: Standard WebExtension calls made by `background.js`, `popup.js`, and `content.js`
- Produces: Global `window.chrome` object implementing:
  - `chrome.storage.local` (`get`, `set`, `onChanged.addListener`)
  - `chrome.storage.session` (`get`, `set`)
  - `chrome.runtime` (`onInstalled.addListener`, `onMessage.addListener`, `sendMessage`, `connect`, `onConnect.addListener`)
  - `chrome.tabs` (`query`, `sendMessage`, `onActivated.addListener`, `onUpdated.addListener`, `onRemoved.addListener`)
  - `chrome.windows` (`getLastFocused`, `onFocusChanged.addListener`, `WINDOW_ID_NONE`)
  - `chrome.alarms` (`create`, `onAlarm.addListener`)
  - `window.__smt_runtime`: Coordinator object exposing `setActiveTab(url)`, `teardown()`, and event dispatchers.

- [ ] **Step 1: Write the failing unit test for the WebExtension shim**

Create `tests/chrome-runtime-shim.test.mjs` verifying:
1. `storage.local` get/set and `onChanged` listener notification.
2. `storage.session` get/set.
3. `runtime.sendMessage` and `runtime.onMessage` request/response flow.
4. `runtime.connect` port message and disconnect events (focus holding).
5. `tabs.query` returning the active simulated tab.
6. `tabs.sendMessage` routing messages to content script listeners.

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const shimCode = fs.readFileSync('public/showcases/amazon-smt-companion/runtime/chrome-runtime-shim.js', 'utf-8');

function createEnv() {
  const window = {};
  const fn = new Function('window', shimCode + '; return window.chrome;');
  const chrome = fn(window);
  return { window, chrome, runtime: window.__smt_runtime };
}

test('storage.local get and set triggers onChanged', async () => {
  const { chrome } = createEnv();
  let changeFired = false;
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.volume) {
      changeFired = true;
    }
  });

  await chrome.storage.local.set({ volume: 80 });
  const data = await chrome.storage.local.get('volume');
  assert.equal(data.volume, 80);
  assert.equal(changeFired, true);
});

test('runtime messaging routes between sender and receiver', async () => {
  const { chrome } = createEnv();
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'PING') {
      sendResponse({ status: 'PONG' });
    }
  });

  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'PING' }, (resp) => {
      assert.equal(resp.status, 'PONG');
      resolve();
    });
  });
});

test('tabs.query and tabs.sendMessage route to active tab', async () => {
  const { chrome, runtime } = createEnv();
  runtime.setActiveTab('https://www.amazon.ca');

  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  assert.equal(tabs.length, 1);
  assert.equal(tabs[0].url, 'https://www.amazon.ca');

  let trackReceived = null;
  runtime.onContentMessage((msg) => {
    if (msg.type === 'TRACK_CHANGED') {
      trackReceived = msg.trackName;
    }
  });

  chrome.tabs.sendMessage(tabs[0].id, { type: 'TRACK_CHANGED', trackName: 'Test Track' });
  assert.equal(trackReceived, 'Test Track');
});
```

- [ ] **Step 2: Run test to verify it fails before implementation**

Run: `node --test tests/chrome-runtime-shim.test.mjs`
Expected: FAIL (file not found or empty).

- [ ] **Step 3: Implement `chrome-runtime-shim.js`**

Write `public/showcases/amazon-smt-companion/runtime/chrome-runtime-shim.js` providing full implementations of `chrome.storage.local`, `chrome.storage.session`, `chrome.runtime`, `chrome.tabs`, `chrome.windows`, and `chrome.alarms`, sharing state across `window.__smt_runtime` so that child iframes (popup) and the parent window communicate seamlessly.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/chrome-runtime-shim.test.mjs`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add public/showcases/amazon-smt-companion/runtime/chrome-runtime-shim.js tests/chrome-runtime-shim.test.mjs
git commit -m "feat: implement WebExtension runtime shim with test coverage"
```

---

### Task 3: Content Collection Schema & Showcase Routing

**Files:**
- Modify: `src/content.config.ts:22-35`
- Modify: `src/components/showcases/ProjectShowcase.astro:15-37`
- Modify: `src/content/projects/amazon-smt-music-companion.md:1-14`

**Interfaces:**
- Consumes: Project content collection schema
- Produces: `showcase.type: "amazon-smt-companion"` supported across content loader and showcase router

- [ ] **Step 1: Update `src/content.config.ts`**

Add `"amazon-smt-companion"` to the `showcase.type` enum in `src/content.config.ts`:
```typescript
showcase: z
	.object({
		type: z
			.enum([
				"live-preview",
				"game-of-life",
				"amazon-smt-companion",
				"image",
				"none",
			])
			.default("image"),
		url: z.string().optional(),
		previewImage: z.string().optional(),
		aspectRatio: z.string().default("16/9"),
		caption: z.string().optional(),
	})
	.optional(),
```

- [ ] **Step 2: Update `src/components/showcases/ProjectShowcase.astro`**

Import and render `AmazonSmtShowcase.astro` when `showcaseType === 'amazon-smt-companion'`:
```astro
---
import type { CollectionEntry } from 'astro:content';
import LivePreviewShowcase from './LivePreviewShowcase.astro';
import GameOfLifeShowcase from './GameOfLifeShowcase.astro';
import AmazonSmtShowcase from './AmazonSmtShowcase.astro';
import ImageShowcase from './ImageShowcase.astro';

interface Props {
	project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
const { title, heroImage, link, showcase } = project.data;
const showcaseType = showcase?.type || (heroImage ? 'image' : 'none');
---

{showcaseType === 'live-preview' && (
	<LivePreviewShowcase 
		url={showcase?.url || link} 
		previewImage={showcase?.previewImage} 
		title={title}
		aspectRatio={showcase?.aspectRatio}
		caption={showcase?.caption}
	/>
)}

{showcaseType === 'game-of-life' && (
	<GameOfLifeShowcase />
)}

{showcaseType === 'amazon-smt-companion' && (
	<AmazonSmtShowcase />
)}

{showcaseType === 'image' && heroImage && (
	<ImageShowcase 
		image={heroImage} 
		title={title} 
		caption={showcase?.caption} 
	/>
)}
```

- [ ] **Step 3: Update `src/content/projects/amazon-smt-music-companion.md`**

Update the frontmatter to set `showcase.type: "amazon-smt-companion"` and provide comprehensive project writeup (features, Shin Megami Tensei black market track list, WebExtension MV3 architecture, Fisher-Yates shuffle queue, audio synchronization).

- [ ] **Step 4: Verify schema validation**

Run: `node -e "import('./src/content.config.ts').then(() => console.log('Schema valid!'))"` or `npx astro check`
Expected: PASS with no schema errors.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/components/showcases/ProjectShowcase.astro src/content/projects/amazon-smt-music-companion.md
git commit -m "feat: register amazon-smt-companion showcase type in content schema and router"
```

---

### Task 4: Implement Simulated Browser Component & Teardown

**Files:**
- Create: `src/components/showcases/AmazonSmtShowcase.astro`
- Create: `src/scripts/portfolio/amazon-smt-showcase.ts`

**Interfaces:**
- Consumes:
  - Static assets from `/showcases/amazon-smt-companion/`
  - WebExtension shim from `/showcases/amazon-smt-companion/runtime/chrome-runtime-shim.js`
- Produces:
  - Interactive retro-cyber browser mockup with:
    - Tab navigation (`amazon.ca`, `wikipedia.org`, `google.com`)
    - Address bar display and refresh button
    - Extension toolbar icon (`press-turn.png`) with active/pulsing state
    - Popup dropdown overlay loading `popup.html` 1:1 inside an iframe
    - Active viewport displaying mock Amazon page with injected `content.css` and `content.js` (rendering `#smt4-toast`)
    - Collapsible Source Code Inspector displaying `background.js`, `popup.js`, and `content.js`

- [ ] **Step 1: Write `src/scripts/portfolio/amazon-smt-showcase.ts`**

Implement the client controller:
1. Initialize `window.chrome` via the runtime shim.
2. Load `config.js` and `background.js` in the parent coordinator.
3. Bind tab click events: switching between `https://www.amazon.ca`, `https://en.wikipedia.org`, and `https://www.google.com`.
4. Trigger `chrome.tabs.onActivated` and `chrome.tabs.onUpdated` upon tab switch so `background.js` pauses/resumes audio.
5. Bind extension toolbar button to toggle the popup dropdown iframe (`popup/popup.html`).
6. Listen for `chrome.runtime` messages to display `#smt4-toast` in the mock Amazon viewport when on Amazon.
7. Register `astro:before-swap` listener to pause audio and clean up timers and event listeners.

- [ ] **Step 2: Write `src/components/showcases/AmazonSmtShowcase.astro`**

Create the component with:
- Cyber-themed browser chrome (`#0c0c12`, `border-border`, Atkinson bold header `[ SMT.MUSIC_COMPANION.EXE ]`).
- Tab bar with active indicators and address bar with lock icon.
- Toolbar button with `press-turn.png` and neon glow when active.
- Absolute-positioned popup iframe container (width: 368px, height: 440px) with SMT HUD border styling.
- Mock viewport:
  - On `amazon.ca`: authentic Amazon-styled minimal banner/search header with mock SMT merchandise cards and toast container.
  - On non-Amazon tabs: clean informational placeholder noting the extension is dormant.
- Collapsible `<details>` source code viewer highlighting `background.js`, `popup.js`, and `content.js` using `<Code />`.

- [ ] **Step 3: Run build to verify component compilation**

Run: `npm run build`
Expected: Build succeeds with 0 errors and creates `/portfolio/amazon-smt-music-companion/index.html`.

- [ ] **Step 4: Commit**

```bash
git add src/components/showcases/AmazonSmtShowcase.astro src/scripts/portfolio/amazon-smt-showcase.ts
git commit -m "feat: implement AmazonSmtShowcase simulated browser component"
```

---

### Task 5: End-to-End Verification and Verification Suite

**Files:**
- Create: `tests/e2e-showcase-verification.test.mjs`

**Interfaces:**
- Consumes: Built assets in `dist/` and unit test runner
- Produces: Complete verification of HTML generation, route output, static asset presence, and runtime shim tests

- [ ] **Step 1: Write comprehensive verification test**

Create `tests/e2e-showcase-verification.test.mjs`:
1. Verify `dist/portfolio/amazon-smt-music-companion/index.html` was generated.
2. Verify all 10 extension assets exist in `dist/showcases/amazon-smt-companion/`.
3. Verify the generated HTML contains the mock browser tabs, toolbar icon, popup iframe reference, and source code inspector.

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('production build contains amazon-smt-companion page and assets', () => {
  const htmlPath = 'dist/portfolio/amazon-smt-music-companion/index.html';
  assert.ok(fs.existsSync(htmlPath), 'Page HTML must exist');

  const html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('amazon.ca'), 'HTML must include amazon.ca tab');
  assert.ok(html.includes('popup.html'), 'HTML must include popup iframe');
  assert.ok(html.includes('press-turn.png'), 'HTML must include press turn icon');

  const assetFiles = [
    'manifest.json',
    'config.js',
    'background.js',
    'content.js',
    'content.css',
    'popup/popup.html',
    'popup/popup.css',
    'popup/popup.js',
    'assets/press-turn.png',
    'font/Megaten20XX.woff',
    'runtime/chrome-runtime-shim.js',
  ];

  for (const file of assetFiles) {
    const p = `dist/showcases/amazon-smt-companion/${file}`;
    assert.ok(fs.existsSync(p), `Asset must be present in dist: ${file}`);
  }
});
```

- [ ] **Step 2: Run verification tests**

Run: `node --test tests/e2e-showcase-verification.test.mjs`
Expected: All tests PASS.

- [ ] **Step 3: Run full repository check**

Run: `npm run check`
Expected: `astro build`, `tsc`, and `wrangler deploy --dry-run` all pass cleanly.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e-showcase-verification.test.mjs
git commit -m "test: add end-to-end verification for amazon-smt-companion showcase"
```
