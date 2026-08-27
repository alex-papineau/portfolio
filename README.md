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

