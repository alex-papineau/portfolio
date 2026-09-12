---
title: "sadiemarilyn.com"
description: "Clean portfolio and gallery website built for photographer Sadie Marilyn."
category: "professional"
tags: ["Portfolio", "Web Design", "Responsive Design", "Gallery"]
link: "https://sadiemarilyn.com/"
showcase:
  type: "live-preview"
  url: "https://sadiemarilyn.com/"
  caption: "Portfolio website for Sadie Marilyn"
---

# sadiemarilyn.com

A fast, minimalist portfolio and gallery site built for photographer Sadie Marilyn, focused on high-resolution visual storytelling and quick load times.

## How It's Made

### 1. Framework & Architecture
Astro generates static HTML at build time, so gallery pages load without shipping unnecessary JavaScript. Tailwind CSS v4 handles styling through `@tailwindcss/vite` for a minimal CSS bundle, and TypeScript is set to strict mode across all components and page props.

### 2. Hosting & Infrastructure
The site deploys globally on Cloudflare Workers with edge caching and continuous deployment, using `@astrojs/cloudflare` for production while keeping local development simple.

### 3. Media & Image Delivery
High-resolution photography and video assets are hosted on a dedicated CDN subdomain. A custom image component generates responsive `srcset` widths, thumbnails versus full-screen views, so viewers only download the resolution they actually need. Video is presented inline in a grid formatted for both mobile and desktop.

### 4. Structure & Content
Dedicated routes cover photography, video showcases, and client contact. `@astrojs/sitemap` and `@astrojs/rss` generate the sitemap and RSS feeds automatically.
