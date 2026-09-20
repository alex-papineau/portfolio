---
title: "This Portfolio"
description: "This site. Astro 7 on Cloudflare Workers with Solid islands and Tailwind 4."
category: "professional"
tags: ["Astro", "TypeScript", "Cloudflare"]
link: "https://alexpapineau.com"
showcase:
  type: "none"
---

# This Portfolio

The site you're on. Each project is a Markdown file in `src/content/projects/`, checked by a Zod schema and built to static HTML. Solid islands handle the project filter and the live site previews.

## Lighthouse (home page)

Mobile, Lighthouse 13.5 CLI with simulated throttling, tested on 2026-09-19. Performance category only, median of three runs.

| Metric                   | Result               |
| ------------------------ | -------------------- |
| Performance score        | 99                   |
| First contentful paint   | 1.7 s                |
| Largest contentful paint | 1.9 s                |
| Speed index              | 1.8 s                |
| Total blocking time      | 50 ms                |
| Cumulative layout shift  | 0                    |
| Page weight              | 245 KiB, 22 requests |

Of the 245 KiB, images are 137, fonts 46, JavaScript 40, CSS 8, and HTML 10. About 21 KiB of the JavaScript is Cloudflare's own beacon and bot-check scripts. The site's own is about 20.

The projects page scored 96 with a 2.6 s largest contentful paint, and a project page scored 98, in single runs.

## Stack notes

- Astro builds static HTML and the Cloudflare adapter serves it from Workers static assets. Fonts and hashed assets get immutable cache headers.
- The tag filters on the project list come from each project's frontmatter, with duplicates merged case-insensitively.
- A prebuild step makes the project thumbnails and recompresses them with sharp, so cards load small WebP files.
