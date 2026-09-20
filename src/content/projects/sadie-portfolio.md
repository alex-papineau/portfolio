---
title: "sadiemarilyn.com"
description: "Minimalist portfolio and gallery site for photographer Sadie Marilyn."
category: "professional"
tags: ["Astro", "Cloudflare"]
link: "https://sadiemarilyn.com/"
showcase:
  type: "live-preview"
  url: "https://sadiemarilyn.com/"
---

# sadiemarilyn.com

A fast, minimalist portfolio and gallery site for photographer Sadie Marilyn, built around high-resolution photography and quick load times.

## How it's made

### Framework
Astro generates static HTML at build time, so gallery pages ship little JavaScript. Tailwind CSS v4 handles styling through `@tailwindcss/vite`, which keeps the CSS bundle small. TypeScript runs in strict mode across all components and page props.

### Hosting
The site deploys on Cloudflare Workers with edge caching and continuous deployment, using `@astrojs/cloudflare` in production. Local development stays simple.

### Media
High-resolution photos and videos are hosted on a dedicated CDN subdomain. A custom image component generates responsive `srcset` widths, with separate thumbnail and full-screen sizes, so viewers only download the resolution they need. Video plays inline in a grid laid out for mobile and desktop.

### Structure
Dedicated routes cover photography, video, and client contact. `@astrojs/sitemap` and `@astrojs/rss` generate the sitemap and RSS feeds automatically.
