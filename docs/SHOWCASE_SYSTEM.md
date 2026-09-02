# Project Showcase System Guide

This guide explains how project showcases work in the portfolio theme and how to integrate code, demos, and live websites from other repositories.

---

## 1. Architecture Overview

Every project in `src/content/projects/` is dynamically routed and rendered by `src/pages/portfolio/[...slug].astro`.

Above each project's Markdown body, the dynamic template mounts the central dispatcher component:
`src/components/showcases/ProjectShowcase.astro`

Based on the `showcase.type` specified in the project's Markdown frontmatter, the dispatcher renders the corresponding showcase component:

```
src/
├── content/
│   └── projects/
│       ├── sadie-portfolio.md          # showcase.type: "live-preview"
│       ├── game-of-life.md             # showcase.type: "game-of-life"
│       ├── map-stuff.md                # showcase.type: "map-explorer"
│       └── ...
├── components/
│   └── showcases/
│       ├── ProjectShowcase.astro       # Central dispatcher
│       ├── LivePreviewShowcase.astro   # Browser mockup + on-demand lazy iframe
│       ├── GameOfLifeShowcase.astro    # Conway's Game of Life simulation + Source code inspector
│       ├── MapExplorerShowcase.astro   # Leaflet geospatial map
│       └── ImageShowcase.astro         # Standard hero image fallback
└── pages/
    └── portfolio/
        └── [...slug].astro             # Unified dynamic project page
```

---

## 2. Frontmatter Schema Reference

Configured in `src/content.config.ts`:

| Field | Type | Default | Description |
|---|---|---|---|
| `showcase.type` | `enum` | `"image"` | `"live-preview"`, `"game-of-life"`, `"map-explorer"`, `"image"`, `"none"` |
| `showcase.url` | `string` (optional) | `undefined` | Target URL for live previews (e.g. `https://sadiemarilyn.com/`) |
| `showcase.previewImage` | `string` (optional) | `heroImage` | Poster image / SVG mockup displayed prior to user interaction |
| `showcase.aspectRatio` | `string` (optional) | `"16/9"` | Aspect ratio of the media container |
| `showcase.caption` | `string` (optional) | `undefined` | Subtle caption displayed beneath the showcase container |

---

## 3. Built-in Showcase Types

### 3.1. `live-preview` (On-Demand Sandboxed Iframe)
Used for live external sites and deployed web applications.
- Displays a retro-wireframe browser mockup with window dots, address bar, and an **"Open External ↗"** quick link.
- Shows a lightweight preview graphic (`previewImage`) with a **`[ Launch Interactive Preview ▶ ]`** button.
- Loads an `<iframe>` only when clicked, eliminating initial network payload and preventing frame-blocking errors.

**Example Markdown:**
```markdown
---
title: "Sadie's Portfolio"
description: "Bespoke digital portfolio and creative gallery."
category: "professional"
order: 1
heroImage: "/projects/sadie-portfolio-preview.svg"
link: "https://sadiemarilyn.com/"
github: "https://github.com/alex-papineau"
showcase:
  type: "live-preview"
  url: "https://sadiemarilyn.com/"
  previewImage: "/projects/sadie-portfolio-preview.svg"
  caption: "Interactive preview of Sadie's portfolio. Click launch to load live frame."
---
```

### 3.2. `game-of-life`
Embeds the cellular automata simulation canvas with Play/Pause, Randomize, and Clear controls, along with an expandable **Source Code Inspector** showing the complete `src/scripts/portfolio/game-of-life.ts` file contents.

### 3.3. `map-explorer`
Embeds the interactive geospatial Leaflet map with dark Carto tiles.

### 3.4. `image` (Default Fallback)
Renders the project's `heroImage` inside a bordered wireframe figure.

### 3.5. `none`
Disables media showcases for text-only or CLI writeups.

---

## 4. Displaying Source Code Files in Showcases

To display the source code powering any theme demo (such as `game-of-life.ts`), use Astro's `?raw` import syntax combined with Astro's built-in `<Code />` component:

```astro
---
import { Code } from 'astro:components';
import scriptSourceCode from '../../scripts/portfolio/your-script.ts?raw';
---

<details class="group border-t border-border bg-[#090812]">
  <summary class="flex items-center justify-between px-4 py-3 cursor-pointer font-mono text-xs text-text-secondary hover:text-accent">
    <div class="flex items-center gap-2">
      <span class="text-accent group-open:rotate-90 transition-transform">▶</span>
      <span>[ VIEW SOURCE: src/scripts/portfolio/your-script.ts ]</span>
    </div>
    <span class="text-text-muted text-[11px] group-open:hidden">[ Expand Code ]</span>
    <span class="text-text-muted text-[11px] hidden group-open:inline">[ Collapse Code ]</span>
  </summary>
  <div class="border-t border-border p-4 bg-[#050508] max-h-[460px] overflow-auto text-xs font-mono">
    <Code code={scriptSourceCode} lang="ts" theme="github-dark" />
  </div>
</details>
```

---

## 5. How to Plug in Code from Other Repositories

### Scenario A: Showcasing a Deployed Web App or External Website
1. Put a preview graphic (PNG, JPG, or SVG) into `public/projects/your-project-preview.svg`.
2. In `src/content/projects/your-project.md`, set:
   ```markdown
   showcase:
     type: "live-preview"
     url: "https://your-live-demo.com/"
     previewImage: "/projects/your-project-preview.svg"
   ```

---

### Scenario B: Bringing in an Interactive Canvas Game / Simulation from Another Repo
If you have a canvas game (e.g., Chrome Dino, Ant Farm, or another TS/JS simulation):

1. **Copy the script**: Place the TypeScript or JavaScript simulation code into `src/scripts/portfolio/your-simulation.ts`.
2. **Create a showcase component**: Create `src/components/showcases/YourSimulationShowcase.astro`:
   ```astro
   ---
   import { Code } from 'astro:components';
   import simCode from '../../scripts/portfolio/your-simulation.ts?raw';
   ---
   <div class="your-simulation-container mb-10 w-full rounded-[2px] border border-border bg-[#0c0c12] overflow-hidden">
     <div class="flex items-center justify-between px-4 py-2.5 bg-[#141320] border-b border-border font-mono text-xs text-text-secondary">
       <span class="text-accent uppercase font-bold">[ SIMULATION NAME ]</span>
     </div>
     <div class="flex flex-col items-center bg-black p-4">
       <canvas id="sim-canvas" width="700" height="400" class="max-w-full border border-border"></canvas>
     </div>
     <!-- Source code inspector -->
     <details class="group border-t border-border bg-[#090812]">
       <summary class="px-4 py-3 cursor-pointer font-mono text-xs text-text-secondary hover:text-accent">
         [ VIEW SOURCE: src/scripts/portfolio/your-simulation.ts ]
       </summary>
       <div class="border-t border-border p-4 bg-[#050508] max-h-[460px] overflow-auto text-xs font-mono">
         <Code code={simCode} lang="ts" theme="github-dark" />
       </div>
     </details>
   </div>

   <script src="../../scripts/portfolio/your-simulation.ts"></script>
   ```
3. **Register in schema**: In `src/content.config.ts`, add `"your-simulation"` to `z.enum([...])`.
4. **Register in dispatcher**: In `src/components/showcases/ProjectShowcase.astro`, import and render:
   ```astro
   {showcaseType === 'your-simulation' && (
     <YourSimulationShowcase />
   )}
   ```
5. **Set frontmatter**: In `src/content/projects/your-simulation.md`:
   ```markdown
   showcase:
     type: "your-simulation"
   ```

---

## 6. Lifecycle & Performance Rules

Astro uses client-side navigation (`astro:page-load` / `astro:before-swap`). To ensure scripts don't leak memory or duplicate animation frames:

1. **Initialization (`astro:page-load`)**:
   Always attach initialization hooks to `astro:page-load` as well as standard DOM loading:
   ```typescript
   document.addEventListener("astro:page-load", initSimulation);
   if (document.readyState === "complete" || document.readyState === "interactive") {
     initSimulation();
   } else {
     document.addEventListener("DOMContentLoaded", initSimulation);
   }
   ```

2. **Teardown (`astro:before-swap`)**:
   Always cancel `requestAnimationFrame`, destroy Leaflet map instances, and clean up active event listeners inside `astro:before-swap`:
   ```typescript
   document.addEventListener("astro:before-swap", () => {
     if (animationId) cancelAnimationFrame(animationId);
     if (window._currentLeafletMap) {
       window._currentLeafletMap.remove();
       window._currentLeafletMap = null;
     }
   });
   ```
