# Portfolio

## Architecture & Tech Stack

- **Framework**: Astro (Static Site Generation)
- **Client Islands**: SolidJS (`@astrojs/solid-js`) for interactive client-side components
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Content**: Astro Content Collections (`astro:content`) with Markdown/MDX (`@astrojs/mdx`)
- **Sitemap**: Auto-generated via `@astrojs/sitemap` (site URL configured in `astro.config.mjs`)
- **Hosting**: Cloudflare Workers via `@astrojs/cloudflare` and Wrangler, serving static assets from `./dist` with cache-control rules in `public/_headers`
- **Testing**: Vitest, unit tests colocated with source (e.g. `*.test.ts`/`*.test.mjs`)

## Client Islands (`src/components/islands/`)

### `ProjectCatalog.tsx` (`client:load`)
Handles project search and category filtering on the homepage:
- Server-renders the full project list into static HTML at build time for SEO.
- Hydrates on load to provide real-time search across titles, descriptions, tags, and category aliases (`professional`, `work`, `fun`, `experiments`).
- Updates category counts (`All`, `Professional`, `For Fun`) based on matching results.
- Synchronizes search query and category filters to URL parameters (`?category=...&q=...`) and supports browser history navigation (`popstate`).
- Listens for `/` keypress to focus the search input.

### `LivePreviewIsland.tsx` (`client:visible`)
Handles embedded site previews on project detail pages:
- Displays static poster image until user triggers interactive preview.
- Mounts sandboxed iframe (`allow-scripts allow-same-origin allow-popups allow-forms`) on click.
- Enforces desktop viewport threshold: interactive frame loads only on screens >= 1280px wide; smaller viewports open the link in a new tab.
- Includes loading state and fallback UI if embedding is blocked by target site security headers (`X-Frame-Options` / CSP).

### `ImageLightbox.tsx` (`client:idle`)
Handles image inspection on project detail pages:
- Clicking the showcase image opens a modal overlay.
- Supports zoom levels (`Fit`, `100%`, `200%`) with pan scrolling.
- Closes via `Escape` key or backdrop click; locks body scrolling while active.

## Showcase System (`src/components/showcases/`)

The `ProjectShowcase.astro` component conditionally renders a showcase banner based on the `showcase.type` defined in project frontmatter:

- `live-preview`: Renders `LivePreviewShowcase.astro` wrapping `LivePreviewIsland.tsx`.
- `game-of-life`: Renders `GameOfLifeShowcase.astro` with an interactive HTML5 canvas simulation (`src/scripts/portfolio/game-of-life.ts`) and collapsible source code inspector.
- `image`: Renders `ImageShowcase.astro` wrapping `ImageLightbox.tsx`.
- `none`: Omits the showcase banner entirely.

## Project Content Schema

Projects are defined in `src/content/projects/*.md`. Schema configuration is defined in `src/content.config.ts`:

```yaml
---
title: "Project Title"
description: "Brief summary of the project."
category: "professional" # "professional" | "fun"
tags: ["TypeScript", "Canvas"] # Array of technology tags, default []
link: "https://example.com" # Optional external live demo link
github: "https://github.com/alex-papineau/repo" # Optional repository link
heroImage: "/path/to/image.png" # Optional image path (overrides automated thumbnail)
hideThumbnail: false # Set true to hide preview card on homepage
showcase: # Optional block; omit entirely to skip the showcase banner
  type: "live-preview" # "live-preview" | "game-of-life" | "image" | "none" (default: "image")
  url: "https://example.com" # Preview URL for iframe
  previewImage: "/thumbnails/project-id.webp" # Poster image before launch
  aspectRatio: "16/9" # Frame aspect ratio (default: "16/9")
  caption: "Optional caption text below preview"
---

Markdown content here.
```

## Thumbnail Pipeline

Homepage project cards resolve thumbnails using the following priority order:

1. `heroImage` defined in frontmatter.
2. Local WebP snapshot at `public/thumbnails/{project-id}.webp`.
3. WordPress mshots CDN snapshot (`https://s0.wp.com/mshots/v1/{url}?w=800`).
4. Default site logo fallback (`/favicon.svg`).

To generate or refresh local 1920x1080 WebP snapshots for all external project URLs:

```bash
npm run thumbs
```

This runs `scripts/generate-thumbnails.mjs` (captures desktop snapshots to `public/thumbnails/`) followed by `scripts/optimize-images.mjs` (uses `sharp` to resize thumbnails to 720x405 and re-compress as WebP, quality 80). Both scripts also run automatically as a `prebuild` step before `npm run build`.

## Commands

All commands run from the project root:

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start development server (`http://localhost:4321`) |
| `npm run build` | Generate thumbnails, optimize images, then build static production output to `./dist/` |
| `npm run build:quick` | Build without regenerating thumbnails/images (skips `prebuild`) |
| `npm run preview` | Build and run local Cloudflare Wrangler preview |
| `npm run check` | Run Astro build, TypeScript typecheck, and Wrangler dry-run |
| `npm run deploy` | Deploy to Cloudflare Workers via Wrangler |
| `npm run cf-typegen` | Generate Cloudflare Worker TypeScript bindings |
| `npm run thumbs` | Generate local WebP thumbnails and optimize them for all project links |
| `npm run optimize:thumbs` | Re-optimize existing thumbnails only (skip snapshot capture) |
| `npm test` | Run unit tests with Vitest |
