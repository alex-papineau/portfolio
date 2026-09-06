# Astro Islands (SolidJS) Integration Spec - Phase 1

**Date:** 2026-09-06  
**Status:** Approved  
**Author:** Antigravity & User  

---

## 1. Overview & Goals

Transform key interactive elements of the portfolio into declarative **SolidJS Astro Islands**. This enhances user experience with real-time reactive filtering, device-responsive iframe previews, and fullscreen image inspection while preserving Astro's zero-JS-by-default baseline and fast initial page loads.

### Phase 1 Scope:
1. **Core Setup**: Integrate `@astrojs/solid` and configure SolidJS JSX in Astro and TypeScript.
2. **Feature 1.A (`ProjectCatalog`)**: Unified reactive project search and category filtering island for the homepage.
3. **Feature 2.B (`LivePreviewIsland`)**: Responsive device switcher (Desktop, Tablet, Mobile) and sandboxed interactive iframe runner.
4. **Feature 2.C (`ImageLightbox`)**: Fullscreen zoomable image viewer for project detail showcases.

*(Phase 2 with 2.D Command Palette and 2.E Code Copy will follow after review).*

---

## 2. Architecture & File Structure

```
src/
├── components/
│   ├── islands/
│   │   ├── ProjectCatalog.tsx       # SolidJS: Filter, Search, URL sync, Grid
│   │   ├── LivePreviewIsland.tsx    # SolidJS: Device frame switcher, Iframe runner
│   │   └── ImageLightbox.tsx        # SolidJS: Modal dialog, Zoom & Pan controls
│   └── showcases/
│       ├── LivePreviewShowcase.astro # Astro wrapper with client:visible
│       └── ImageShowcase.astro       # Astro wrapper with client:idle
└── pages/
    └── index.astro                  # Astro page passing project data to ProjectCatalog (client:load)
```

---

## 3. Detailed Component Specifications

### 3.1 Core SolidJS Integration
* **Packages**: `@astrojs/solid`, `solid-js`
* **Configuration (`astro.config.mjs`)**:
  ```javascript
  import solidJs from '@astrojs/solid';
  // ...
  integrations: [solidJs(), mdx(), sitemap()],
  ```
* **Configuration (`tsconfig.json`)**:
  ```json
  {
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
      "jsx": "preserve",
      "jsxImportSource": "solid-js"
    }
  }
  ```

### 3.2 Feature 1.A: `ProjectCatalog.tsx` (Homepage Project Grid)
* **Directive**: `client:load`
* **Props**:
  ```typescript
  export interface SerializedProject {
    id: string;
    data: {
      title: string;
      description: string;
      category: 'professional' | 'fun';
      tags: string[];
      heroImage?: string;
      hideThumbnail?: boolean;
      link?: string;
      showcase?: {
        type?: string;
        url?: string;
      };
    };
    thumbnail: {
      src: string;
      fallbackSnapshot?: string;
      isLogo: boolean;
    };
  }

  interface ProjectCatalogProps {
    projects: SerializedProject[];
  }
  ```
* **Reactivity & State**:
  - `searchQuery`: `createSignal("")`
  - `activeCategory`: `createSignal<'all' | 'professional' | 'fun'>("all")`
  - Computed filtered lists for Professional and Fun categories.
  - Dynamically calculated counts: `All [N]`, `Professional [N]`, `For Fun [N]`.
* **URL Search Parameter Sync**:
  - On mount: Reads `?q=` and `?category=` from `window.location.search`.
  - On change: Updates browser URL via `window.history.replaceState` without triggering page reload.
  - Popstate handler: Listens to browser back/forward buttons to sync state.
* **Keyboard Navigation**:
  - Global `/` key listener to focus search input (unless currently focused in an input/textarea).
  - Clear button `[ Clear ]` appears when search query is non-empty.
* **Rendering**:
  - Section 01: Professional Work (rendered only if count > 0).
  - Section 02: Experiments & For Fun (rendered only if count > 0).
  - Empty state message if total count === 0.

### 3.3 Feature 2.B: `LivePreviewIsland.tsx` (Showcase Device Switcher)
* **Directive**: `client:visible`
* **Props**:
  ```typescript
  interface LivePreviewIslandProps {
    url?: string;
    previewImage?: string;
    title: string;
    aspectRatio?: string;
    caption?: string;
  }
  ```
* **State**:
  - `activeDevice`: `createSignal<'desktop' | 'tablet' | 'mobile'>('desktop')`
  - `isLaunched`: `createSignal<boolean>(false)`
  - `isLoading`: `createSignal<boolean>(true)`
  - `isBlocked`: `createSignal<boolean>(false)`
  - `reloadKey`: `createSignal<number>(0)`
* **Device Preset Widths**:
  - Desktop: `100%` width
  - Tablet: `768px` max-width (centered)
  - Mobile: `375px` max-width (centered with device chassis styling)
* **Top Bar Controls**:
  - Device buttons: `[ Desktop ]`, `[ Tablet: 768px ]`, `[ Mobile: 375px ]`
  - Reload button `[ ⟳ Reload ]` (when preview is active)
  - External link button `[ Open ↗ ]`
* **Security & Fallback**:
  - Sandboxed iframe with permissions: `allow-scripts allow-same-origin allow-popups allow-forms`.
  - Timeout block detector: If iframe fails to load or triggers security error, displays helpful direct link fallback.

### 3.4 Feature 2.C: `ImageLightbox.tsx` (Showcase Lightbox)
* **Directive**: `client:idle`
* **Props**:
  ```typescript
  interface ImageLightboxProps {
    image: string;
    title: string;
    caption?: string;
  }
  ```
* **State**:
  - `isOpen`: `createSignal<boolean>(false)`
  - `zoomLevel`: `createSignal<'fit' | '1x' | '2x'>('fit')`
* **Features**:
  - Inline preview image with hover overlay cue `[ Click to inspect / zoom ⛶ ]`.
  - Modal overlay with `backdrop-blur-md` and `bg-black/85`.
  - Top action bar in modal: Zoom mode selector (`[ Fit ]`, `[ 100% ]`, `[ 200% ]`), Download / View original button, and `[ Close ✕ ]` button.
  - Keyboard listener: `Escape` key closes modal.
  - Scroll lock on `document.body` while modal is open.

---

## 4. Verification & Testing Plan

1. **Astro Build & TypeScript Check**:
   - Run `npm run check` (or `astro build && tsc`) to ensure 0 type errors with Solid JSX.
2. **ProjectCatalog Verification**:
   - Verify server-side rendered HTML includes project cards before JS executes.
   - Verify filtering by text (titles, descriptions, tags, aliases) and category buttons.
   - Verify URL query params update correctly (`?category=fun&q=ant`).
   - Verify browser back/forward history navigation.
   - Verify keyboard shortcut `/` focuses search.
3. **LivePreviewIsland Verification**:
   - Verify poster and "Launch Interactive Preview ▶" button render statically.
   - Verify clicking launch embeds the iframe and shows loading skeleton.
   - Verify switching between Desktop, Tablet, and Mobile smoothly animates and centers the frame.
   - Verify reload button restarts the iframe.
4. **ImageLightbox Verification**:
   - Verify clicking thumbnail opens fullscreen modal.
   - Verify zoom toggles (`Fit`, `100%`, `200%`) zoom smoothly with pan scrolling.
   - Verify `Escape` key and backdrop click close modal and restore body scroll.
