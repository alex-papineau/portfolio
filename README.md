# Alex Papineau Portfolio

A developer portfolio and experiment showcase built with **Astro**, **SolidJS** islands, **Tailwind CSS v4**, and deployed on **Cloudflare Workers**.

---

## ⚡ Tech Stack & Architecture

- **Framework**: [Astro v7](https://astro.build/) (Static Site Generation / Server-Side Island Architecture)
- **UI Islands**: [SolidJS](https://www.solidjs.com/) via `@astrojs/solid-js` for high-performance reactive client components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with dark terminal typography and monospace aesthetics
- **Content Management**: Astro Content Collections (`astro/loaders` + Zod schema validation)
- **Deployment**: [Cloudflare Workers / Pages](https://workers.cloudflare.com/) via `@astrojs/cloudflare` and Wrangler
- **Syntax Highlighting & Markdown**: `@astrojs/mdx` and Astro `<Code />` component

---

## 🏝️ Astro Islands (`src/components/islands/`)

This theme uses the **Astro Island Architecture** to keep the site fast and lightweight with zero unnecessary client JavaScript:

### 1. `ProjectCatalog.tsx` (`client:load`)
- **Server-Rendered + Hydrated**: Pre-rendered into static HTML during build for instant initial paint and complete SEO discoverability, then hydrated on the client.
- **Instant Search & Category Filtering**: Real-time filtering across project titles, descriptions, tags, and category aliases (`professional`, `work`, `fun`, `experiments`).
- **Dynamic Count Badges**: Real-time project counts (`All [N]`, `Professional [N]`, `For Fun [N]`) that update as you type.
- **Two-Way URL Sync**: Keeps browser search parameters synchronized (`?category=fun&q=canvas`) and listens to browser Back/Forward navigation (`popstate`).
- **Keyboard Shortcut**: Press `/` from anywhere on the homepage to focus the search bar.

### 2. `LivePreviewIsland.tsx` (`client:visible`)
- **On-Demand Interactive Preview**: Sandboxed iframe runner (`allow-scripts allow-same-origin allow-popups allow-forms`) activated on demand with zero JavaScript overhead until scrolled into view.
- **Desktop Viewport & Fallback**: Renders interactive frames for desktop viewports (`≥1280px`) and gracefully opens direct live demo links in a new tab on smaller mobile/tablet screens.
- **Connection Indicator & Security Fallbacks**: Shows loading states and detects embedding restrictions (e.g. `X-Frame-Options` or CSP headers) with direct website links.

### 3. `ImageLightbox.tsx` (`client:idle`)
- **Fullscreen Image Inspection**: Click on any showcase image to open a fullscreen modal with backdrop blur.
- **Multi-Level Zoom & Pan**: Toggle between `Fit`, `100%`, and `200%` zoom modes with grab-to-pan scrolling.
- **Keyboard & Accessibility**: Full `Escape` key close listener and background scroll locking while open.

---

## 🎮 Showcase System (`src/components/showcases/`)

Projects support dedicated interactive showcases configured directly in frontmatter via `showcase.type`:

| Showcase Type | Component | Description |
| :--- | :--- | :--- |
| `live-preview` | `LivePreviewShowcase.astro` | Interactive desktop sandbox iframe with poster cover and on-demand launch |
| `game-of-life` | `GameOfLifeShowcase.astro` | Playable Conway's Game of Life canvas simulation with live animation controls and TypeScript source viewer |
| `image` | `ImageShowcase.astro` | Fullscreen zoomable lightbox viewer for architecture diagrams and high-res UI screenshots |
| `none` | N/A | Standard markdown article view without a showcase banner |

---

## 📄 Project Content Schema (`src/content/projects/*.md`)

Add Markdown or MDX files to `src/content/projects/`. Frontmatter fields:

```yaml
---
title: "Conway's Game of Life"
description: "Interactive zero-player cellular automata simulation running on HTML5 Canvas."
category: "fun" # "professional" | "fun"
order: 1
tags: ["Canvas", "TypeScript", "Algorithms"]
link: "https://game-of-life.demo" # Optional external live link
github: "https://github.com/alex-papineau/game-of-life" # Optional source repository
heroImage: "/path/to/image.png" # Optional image (defaults to automated screenshot)
hideThumbnail: false # Optional: hide thumbnail card on homepage
featured: false # Optional featured flag
showcase:
  type: "game-of-life" # "live-preview" | "game-of-life" | "image" | "none"
  url: "https://game-of-life.demo" # Optional URL for live preview
  previewImage: "/path/to/poster.webp" # Optional poster image
  aspectRatio: "16/9" # Aspect ratio for preview frame
  caption: "Interactive cellular automata canvas simulation"
---

Markdown body content here...
```

---

## 📸 Automated Thumbnail Pipeline

Project cards on the home page display high-resolution 1920×1080 desktop previews for external websites with multi-tier fallbacks:

1. **Custom `heroImage`** if specified in frontmatter.
2. **Local WebP snapshot** at `public/thumbnails/{project-id}.webp`.
3. **Cloud snapshot CDN fallback** (`https://s0.wp.com/mshots/v1/...`).
4. **Site logo** (`/favicon.svg`) with 50% opacity wireframe if no external URL is available or an image fails to load.

To fetch or refresh local snapshots for all external project links:

```bash
npm run thumbs
```

This runs `scripts/generate-thumbnails.mjs`, which captures a 1920×1080 desktop snapshot and compresses it to lightweight WebP format (~20–150 KB) inside `public/thumbnails/`.

---

## 🛠️ Development & Deployment Commands

All commands are run from the root of the project:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts local development server on `http://localhost:4321` |
| `npm run build` | Builds the static production site to `./dist/` |
| `npm run preview` | Builds the site and runs Cloudflare Wrangler local preview |
| `npm run check` | Runs Astro build, TypeScript type checking, and Wrangler dry-run validation |
| `npm run deploy` | Deploys the application via Cloudflare Wrangler |
| `npm run cf-typegen` | Generates TypeScript types for Cloudflare Workers runtime |
| `npm run thumbs` | Scans `src/content/projects/` and captures optimized 1920×1080 WebP thumbnails |
