# Alex Papineau Portfolio

### Core Components

*   **Astro**: Static site generator / framework
*   **Tailwind CSS**: Utility-first CSS framework
*   **Cloudflare Workers**: Deployment and hosting via `@astrojs/cloudflare` adapter and Wrangler
*   **MDX**: Markdown with JSX support (`@astrojs/mdx`)
*   **TypeScript**: Type-safe development
*   **RSS & Sitemap**: Content syndication and SEO (`@astrojs/rss`, `@astrojs/sitemap`)

## Commands

All commands are run from the root of the project:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts local development server on `http://localhost:4321` |
| `npm run build` | Builds the static production site to `./dist/` |
| `npm run preview` | Builds the site and runs Cloudflare Wrangler local preview |
| `npm run check` | Runs Astro build, TypeScript type checking, and Cloudflare dry-run validation |
| `npm run deploy` | Deploys the application via Cloudflare Wrangler |
| `npm run cf-typegen` | Generates TypeScript types for Cloudflare Workers runtime |
| `npm run thumbs` | Scans `src/content/projects/` and captures optimized 1920×1080 WebP thumbnails |

## Project Thumbnails & Screenshots

Project cards on the home page display high-resolution 1920×1080 desktop previews for external websites, with built-in fallbacks.

### Frontmatter Configuration

Add any of the following fields to your project Markdown file (`src/content/projects/*.md`):

```yaml
---
title: "Project Title"
description: "Project description..."
category: "professional" # or "fun"
link: "https://example.com/" # External URL used to generate screenshot
heroImage: "/path/to/custom-image.png" # Optional: overrides automated screenshot
hideThumbnail: true # Optional: completely omits the thumbnail preview card
---
```

### Thumbnail Resolution & Fallback Order

1. **Custom `heroImage`** if specified in frontmatter.
2. **Local snapshot** at `public/thumbnails/{project-id}.webp`.
3. **Cloud snapshot CDN fallback** (`https://s0.wp.com/mshots/v1/...`).
4. **Site logo** (`/favicon.svg`) with 50% opacity in a wireframe box if no URL exists or an image fails to load.

### Generating or Refreshing Thumbnails

To fetch or refresh desktop screenshots for all external project links:

```bash
npm run thumbs
```

This runs `scripts/generate-thumbnails.mjs`, which captures a 1920×1080 desktop snapshot and compresses it to lightweight WebP format (~20–150 KB) inside `public/thumbnails/`. Commit these generated `.webp` files so production builds have instant local assets.


