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

A fast, minimalist portfolio and gallery site built for photographer Sadie Marilyn, focused on high-res visual storytelling and instant load times.

## How It's Made

### 1. Framework & Architecture
- **Astro Core**: Generates pure static HTML at build time so the site stays lightning fast, loading zero unnecessary JavaScript on image gallery pages.
- **Tailwind CSS v4**: Utility styling integrated directly via `@tailwindcss/vite` for minimal CSS bundle size.
- **Strict TypeScript**: Ensures type safety across all components and page props.

### 2. Hosting & Infrastructure
- **Cloudflare Workers**: Deployed globally via Cloudflare Workers with fast edge caching and continuous deployment.
- **Environment Adapters**: Configured with `@astrojs/cloudflare` for production while keeping local development lightweight.

### 3. Media & Image Delivery
- **External Media CDN**: High-resolution photography and video assets are hosted on a dedicated CDN subdomain.
- **Responsive Images**: Custom image component generates responsive `srcset` widths (thumbnails vs. full-screen views) so viewers download only the exact resolution they need.
- **Video Grid**: Smooth inline video presentations formatted for both mobile and desktop screens.

### 4. Structure & Content
- **Clean Page Layouts**: Dedicated routes for photography, video showcases, and client contact.
- **SEO & Feeds**: Automated sitemap and RSS feeds generated with `@astrojs/sitemap` and `@astrojs/rss`.