# Portfolio

## Architecture & Tech Stack

- **Framework**: Astro (Static Site Generation)
- **Client Islands**: SolidJS (`@astrojs/solid-js`) for interactive client-side components
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Content**: Astro Content Collections (`astro:content`) with Markdown/MDX
- **Hosting**: Cloudflare Workers via `@astrojs/cloudflare` and Wrangler

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
order: 1 # Sort order (default: 99)
tags: ["TypeScript", "Canvas"] # Array of technology tags
link: "https://example.com" # Optional external live demo link
github: "https://github.com/alex-papineau/repo" # Optional repository link
pubDate: 2026-01-01 # Optional publication date
heroImage: "/path/to/image.png" # Optional image path (overrides automated thumbnail)
hideThumbnail: false # Set true to hide preview card on homepage
featured: false # Optional featured status
showcase:
  type: "live-preview" # "live-preview" | "game-of-life" | "image" | "none"
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

This executes `scripts/generate-thumbnails.mjs`, captures desktop snapshots, and saves compressed WebP files to `public/thumbnails/`.

## Commands

All commands run from the project root:

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start development server (`http://localhost:4321`) |
| `npm run build` | Build static production output to `./dist/` |
| `npm run preview` | Build and run local Cloudflare Wrangler preview |
| `npm run check` | Run Astro build, TypeScript typecheck, and Wrangler dry-run |
| `npm run deploy` | Deploy to Cloudflare Workers via Wrangler |
| `npm run cf-typegen` | Generate Cloudflare Worker TypeScript bindings |
| `npm run thumbs` | Generate local WebP thumbnails for project links |
