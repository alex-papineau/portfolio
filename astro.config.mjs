// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

// Optionally load the Cloudflare adapter
let cloudflareAdapter;
try {
    const { default: cloudflare } = await import("@astrojs/cloudflare");
    cloudflareAdapter = cloudflare({
        platformProxy: {
            enabled: true,
        },
    });
} catch (e) {
    console.warn("Cloudflare adapter not found or incompatible. Running in local mode.");
}

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap()],
  adapter: cloudflareAdapter,

  vite: {
    plugins: [tailwindcss()]
  }
});