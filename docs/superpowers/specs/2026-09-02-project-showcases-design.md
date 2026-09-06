# Architecture Design Specification: Unified Project Showcase System

**Date:** 2026-09-02  
**Status:** Approved  
**Author:** AI Agent & User Pair Programming  

---

## 1. Overview & Objectives

This specification outlines the architecture for a dynamic, performant, and extensible Project Showcase system for the portfolio website built with Astro and Tailwind CSS.

### Key Goals:
1. **Dynamic Showcase Presentation**: Consolidate all project pages under a unified dynamic template (`src/pages/portfolio/[...slug].astro`) driven by Content Collections frontmatter, replacing standalone route files like `game-of-life.astro`.
2. **On-Demand Live Previews for External Sites**: Provide a wireframe browser mockup with an interactive, lazy-loaded sandboxed `<iframe>` launcher for live external websites (e.g., Sadie's Portfolio at `https://sadiemarilyn.com/`), eliminating initial page load overhead and avoiding CSP/X-Frame-Options blocking.
3. **Consolidated & Extensible Showcase Components**: Build modular, self-contained showcase components (`LivePreviewShowcase.astro`, `GameOfLifeShowcase.astro`, `ImageShowcase.astro`) that embed cleanly into the unified dynamic project layout.
4. **Zero-Overhead & Strict Lifecycle Management**: Ensure all interactive canvases and scripts initialize only when visible or triggered, and cleanly teardown on Astro page transitions (`astro:before-swap`).
5. **Theme-Relative Documentation**: Document the integration workflow, showcase configuration, and lifecycle best practices in `docs/SHOWCASE_SYSTEM.md` using theme-relative paths.

---

## 2. Content Schema & Frontmatter Design

Update `src/content.config.ts` to support structured showcase configuration:

```typescript
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["professional", "fun"]),
    order: z.number().default(99),
    tags: z.array(z.string()).default([]),
    link: z.string().optional(),
    github: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
    
    // Structured Showcase Settings
    showcase: z.object({
      type: z.enum([
        "live-preview",    // Interactive wireframe browser frame with on-demand iframe embed
        "game-of-life",    // Conway's cellular automata canvas simulation
        "image",           // Standard hero image preview (fallback)
        "none"             // No media showcase header
      ]).default("image"),
      url: z.string().optional(),          // Target URL for live-preview / external demo
      previewImage: z.string().optional(), // Static image/SVG mockup shown prior to interaction
      aspectRatio: z.string().default("16/9"),
      caption: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { projects };
```

---

## 3. Component Architecture

```
src/
├── components/
│   ├── showcases/
│   │   ├── ProjectShowcase.astro       # Central registry & dispatcher component
│   │   ├── LivePreviewShowcase.astro    # Wireframe browser mockup with lazy iframe
│   │   ├── GameOfLifeShowcase.astro    # Conway's Game of Life canvas component
│   │   └── ImageShowcase.astro         # Standard hero image fallback showcase
│   ├── BackToProjects.astro
│   ├── BaseHead.astro
│   └── Footer.astro
├── pages/
│   └── portfolio/
│       ├── [...slug].astro             # Unified dynamic project detail route
│       └── index.astro                 # Portfolio redirect to home
```

### 3.1. `ProjectShowcase.astro` (Registry Dispatcher)
Accepts the `project` collection entry prop and dynamically renders the appropriate showcase component based on `project.data.showcase?.type`:
- `live-preview` → `<LivePreviewShowcase url={...} previewImage={...} title={...} />`
- `game-of-life` → `<GameOfLifeShowcase />`
- `image` / undefined → `<ImageShowcase heroImage={...} title={...} />`

### 3.2. `LivePreviewShowcase.astro`
- **Wireframe Header Bar**: Includes simulated window controls, monospace URL bar with domain text, and action buttons:
  - `[ Open in New Tab ↗ ]` (direct link to external target).
  - `[ Reload ]` (reloads iframe if active).
- **Preview Mockup State**:
  - Displays `previewImage` (or `heroImage` fallback, e.g. `/projects/sadie-portfolio-preview.svg`).
  - Overlay action button: `[ Launch Live Embed ▶ ]`.
- **On-Demand Iframe State**:
  - Injects `<iframe src={url} sandbox="allow-scripts allow-same-origin allow-popups allow-forms" loading="lazy" ...>`.
  - Loading spinner overlay during network load.
  - Fallback prompt if iframe embedding is blocked by CORS/CSP/X-Frame-Options headers.

### 3.3. `GameOfLifeShowcase.astro`
- Self-contained showcase component that encapsulates the canvas container, styling, controls, and script initialization.
- State and animation frames safely attached on `astro:page-load` and destroyed on `astro:before-swap`.

---

## 4. Lifecycle & Performance Management

To ensure high performance and prevent memory leaks across Astro's client router transitions:
1. **Lifecycle Event Hooks**:
   - `astro:page-load`: Initializes DOM listeners and canvas animation loops.
   - `astro:before-swap`: Cancels `requestAnimationFrame`, resets timers, and removes event listeners.
2. **IntersectionObserver**:
   - Canvas animation loops only run when the showcase element is within the active browser viewport.

---

## 5. Developer Documentation: `docs/SHOWCASE_SYSTEM.md`

A dedicated guide with theme-relative paths covering:
1. **Adding a New Project**: How to create a `.md` file in `src/content/projects/` and set `showcase.type`.
2. **Plugging in Code from Other Repositories**:
   - **Scenario A (External Web Apps)**: Use `type: "live-preview"` with the external URL and a mockup SVG/PNG.
   - **Scenario B (Canvas / Vanilla JS Demos)**: Copy script to `src/scripts/portfolio/`, wrap in a new showcase component in `src/components/showcases/`, and register in `ProjectShowcase.astro`.
   - **Scenario C (Browser Extensions / CLI Tools)**: Guidelines for providing simulated widgets or screenshots.
3. **Lifecycle Checklist**: Rules for event listener cleanup and `astro:before-swap`.

---

## 6. Migration & Cleanup Plan

1. Update `src/content.config.ts` with the new showcase schema.
2. Update existing markdown files (e.g. `src/content/projects/sadie-portfolio.md`, `game-of-life.md`) with their respective `showcase` configurations.
3. Remove `src/components/GithubRepoEmbed.astro` from the theme.
4. Create `src/components/showcases/` modules:
   - `ProjectShowcase.astro`
   - `LivePreviewShowcase.astro`
   - `GameOfLifeShowcase.astro`
   - `ImageShowcase.astro`
5. Update `src/pages/portfolio/[...slug].astro` to embed `<ProjectShowcase />`.
6. Remove obsolete standalone routes `src/pages/portfolio/game-of-life.astro` now that dynamic routing covers them.
7. Create `docs/SHOWCASE_SYSTEM.md`.
8. Verify build with `npm run build`.
