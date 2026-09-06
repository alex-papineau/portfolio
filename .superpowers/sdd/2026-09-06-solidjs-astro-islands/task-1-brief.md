# Task 1 Brief: Setup SolidJS Integration & TypeScript Configuration

## Goal
Install `@astrojs/solid` and `solid-js`, update `astro.config.mjs` and `tsconfig.json`, and verify Astro builds with SolidJS integration enabled.

## Files to touch
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`

## Requirements
1. Run `npm install @astrojs/solid solid-js`
2. In `astro.config.mjs`:
   Import `solidJs from '@astrojs/solid';`
   Include `solidJs()` in the `integrations` array: `integrations: [solidJs(), mdx(), sitemap()]`
3. In `tsconfig.json`:
   Ensure compilerOptions has:
   ```json
   {
     "extends": "astro/tsconfigs/strict",
     "compilerOptions": {
       "jsx": "preserve",
       "jsxImportSource": "solid-js"
     }
   }
   ```
4. Verify by running `npm run build`
5. Commit with message: `feat: add @astrojs/solid integration and configure Solid JSX`
