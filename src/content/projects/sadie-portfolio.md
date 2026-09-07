---
title: "sadiemarilyn.com"
description: "Clean portfolio and gallery website built for photographer Sadie Marilyn."
category: "professional"
order: 1
tags: ["Portfolio", "Web Design", "Responsive Design", "Gallery"]
link: "https://sadiemarilyn.com/"
showcase:
  type: "live-preview"
  url: "https://sadiemarilyn.com/"
  caption: "Portfolio website for Sadie Marilyn"
---

# sadiemarilyn.com

## How It's Made

 ### 1. Framework & Core Architecture

  • **astro.config.mjs**: Serves as the static site generator / SSR framework. It renders HTML at build time for optimal performance while shipping zero
  JavaScript by default unless explicitly scoped to components.
  • **package.json:20-22**: Integrated via @tailwindcss/vite for utility-first styling without legacy PostCSS configuration overhead.
  • **tsconfig.json**: Enforces strict types across components and config scripts.
  ──────
  ### 2. Hosting & Deployment Pipeline

  • Cloudflare Workers & Assets: Configured in wrangler.json.
      • Build outputs to ./dist and runs via ./dist/_worker.js/index.js.
      • Node.js compatibility (nodejs_compat) is enabled with live source-map uploads and observability.
  • Adapter Switching: astro.config.mjs:7-18 dynamically attaches @astrojs/cloudflare when running in production or Cloudflare Pages (CF_PAGES=true), while
  keeping local dev lightweight.
  ──────
  ### 3. Media & Asset Pipeline

  • Remote Media CDN: High-resolution photography and video assets are hosted externally at https://media.sadiemarilyn.com.
  • Dynamic Image Optimization: CloudflareImage.astro wraps Astro's native <Image /> component with inferSize, dynamic srcset width generation ([400, 600,
  800] for thumbnails vs [800, 1200, 2000] for full-screen), and responsive sizes queries.
  • Video Handling: VideoGrid.astro manages videography presentations.
  ──────
  ### 4. Routing & Page Structure

  • File-Based Routing (pages):
      • index.astro – Homepage / featured showcase.
      • photography.astro – Photography grid view.
      • videography.astro – Video showcase view.
      • about.astro – Biography and contact page.
      • 404.astro – Custom error page.

  ──────
  ### 5. SEO & Integrations

  • Sitemap & RSS: Generated via @astrojs/sitemap and @astrojs/rss.
  • Markdown/MDX: Enabled via @astrojs/mdx for content authoring.
  • Spotlight: @spotlightjs/astro is configured for in-browser debugging during development.