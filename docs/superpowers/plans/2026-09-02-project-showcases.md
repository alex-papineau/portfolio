# Unified Project Showcases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dynamic, extensible, and performant showcase system for portfolio projects with lazy on-demand live previews, consolidated interactive demos, and developer documentation.

**Architecture:** A frontmatter-driven showcase schema (`src/content.config.ts`) routes projects through a central dispatcher (`src/components/showcases/ProjectShowcase.astro`) into modular showcase components (`LivePreviewShowcase.astro`, `GameOfLifeShowcase.astro`, `ImageShowcase.astro`) inside the unified dynamic page (`src/pages/portfolio/[...slug].astro`).

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, HTML5 Canvas.

**Spec:** `docs/superpowers/specs/2026-09-02-project-showcases-design.md`

## Global Constraints
- All file paths in documentation and code comments must be theme-relative (e.g. `src/components/...`).
- Zero layout shift and zero third-party scripts loaded on initial page load for external site previews.
- All interactive components must properly clean up animation frames and listeners on Astro view transitions (`astro:before-swap`).
- Deprecated standalone routes (`src/pages/portfolio/game-of-life.astro`) and `src/components/GithubRepoEmbed.astro` must be removed.

---

### Task 1: Update Schema in `src/content.config.ts`

**Files:**
- Modify: `src/content.config.ts`

**Interfaces:**
- Produces: `showcase` schema field on `projects` collection with `type`, `url`, `previewImage`, `aspectRatio`, and `caption`.

- [ ] **Step 1: Update `src/content.config.ts` with showcase schema**

```typescript
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(["professional", "fun"]),
		order: z.number().default(99),
		tags: z.array(z.string()).default([]),
		link: z.string().optional(),
		github: z.string().optional(),
		pubDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		featured: z.boolean().default(false),
		showcase: z
			.object({
				type: z
					.enum([
						"live-preview",
						"game-of-life",
						"image",
						"none",
					])
					.default("image"),
				url: z.string().optional(),
				previewImage: z.string().optional(),
				aspectRatio: z.string().default("16/9"),
				caption: z.string().optional(),
			})
			.optional(),
	}),
});

export const collections = { projects };
```

- [ ] **Step 2: Verify typecheck**

Run: `npx astro check`
Expected: PASS (or 0 errors in content schema)

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add showcase configuration schema to projects collection"
```

---

### Task 2: Remove Obsolete `GithubRepoEmbed.astro` Component

**Files:**
- Delete: `src/components/GithubRepoEmbed.astro`

- [ ] **Step 1: Check for usages of `GithubRepoEmbed.astro`**

Ensure no existing file imports `GithubRepoEmbed.astro`.

- [ ] **Step 2: Delete `src/components/GithubRepoEmbed.astro`**

Delete `src/components/GithubRepoEmbed.astro`.

- [ ] **Step 3: Commit**

```bash
git rm src/components/GithubRepoEmbed.astro
git commit -m "chore: remove unused GithubRepoEmbed component"
```

---

### Task 3: Build `ImageShowcase.astro` & `LivePreviewShowcase.astro`

**Files:**
- Create: `src/components/showcases/ImageShowcase.astro`
- Create: `src/components/showcases/LivePreviewShowcase.astro`

**Interfaces:**
- `ImageShowcase.astro` Props: `{ image: string; title: string; caption?: string }`
- `LivePreviewShowcase.astro` Props: `{ url?: string; previewImage?: string; title: string; aspectRatio?: string; caption?: string }`

- [ ] **Step 1: Create `src/components/showcases/ImageShowcase.astro`**

```astro
---
interface Props {
	image?: string;
	title: string;
	caption?: string;
}

const { image, title, caption } = Astro.props;
---

{image && (
	<figure class="mb-10 w-full overflow-hidden rounded-[2px] border border-border bg-[#080808] flex flex-col items-center justify-center p-4 md:p-8">
		<img 
			src={image} 
			alt={`${title} preview`} 
			class="max-w-full max-h-[480px] object-contain"
			loading="lazy"
		/>
		{caption && (
			<figcaption class="mt-3 font-mono text-xs text-text-muted tracking-[0.5px] text-center">
				{caption}
			</figcaption>
		)}
	</figure>
)}
```

- [ ] **Step 2: Create `src/components/showcases/LivePreviewShowcase.astro`**

```astro
---
interface Props {
	url?: string;
	previewImage?: string;
	title: string;
	aspectRatio?: string;
	caption?: string;
}

const { url, previewImage = '/projects/sadie-portfolio-preview.svg', title, aspectRatio = '16/9', caption } = Astro.props;
const displayUrl = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'preview.local';
---

<div class="live-preview-container mb-10 w-full rounded-[2px] border border-border bg-[#0c0c12] overflow-hidden" data-embed-url={url || ''}>
	<!-- Browser Mockup Chrome Bar -->
	<div class="flex items-center justify-between px-3 md:px-4 py-2.5 bg-[#141320] border-b border-border font-mono text-xs text-text-secondary select-none">
		<div class="flex items-center gap-2">
			<div class="flex gap-1.5">
				<span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80 inline-block"></span>
				<span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80 inline-block"></span>
				<span class="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80 inline-block"></span>
			</div>
			<span class="text-text-muted text-[10px] hidden sm:inline-block ml-2 uppercase tracking-[1px]">[ LIVE DEMO FRAME ]</span>
		</div>

		<!-- Address Bar -->
		<div class="flex items-center gap-1.5 px-3 py-1 bg-[#090812] border border-border rounded-[2px] text-text-muted text-[11px] max-w-[280px] sm:max-w-[360px] truncate">
			<svg class="w-3 h-3 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
			</svg>
			<span class="text-text-secondary truncate">{displayUrl}</span>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2">
			{url && (
				<a 
					href={url} 
					target="_blank" 
					rel="noopener noreferrer" 
					class="text-accent hover:text-white transition-colors duration-150 inline-flex items-center gap-1 uppercase tracking-[0.5px] text-[11px] no-underline"
					title="Open external website in new tab"
				>
					<span class="hidden md:inline">Open</span> ↗
				</a>
			)}
		</div>
	</div>

	<!-- Screen Area -->
	<div class="relative w-full overflow-hidden bg-[#080808]" style={`aspect-ratio: ${aspectRatio}; min-height: 360px; max-height: 600px;`}>
		<!-- Poster Image State -->
		<div class="preview-poster absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 z-10 transition-opacity duration-300">
			<img 
				src={previewImage} 
				alt={`${title} live preview mockup`} 
				class="w-full h-full object-contain"
				loading="lazy"
			/>
			{url && (
				<div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4">
					<button 
						type="button" 
						class="btn-launch-embed inline-flex items-center gap-2 py-2.5 px-5 bg-accent/15 border border-accent text-accent hover:bg-accent hover:text-black font-mono text-xs uppercase tracking-[1px] rounded-[2px] cursor-pointer transition-all duration-150 shadow-lg"
					>
						<span>[ Launch Interactive Preview ▶ ]</span>
					</button>
					<p class="font-mono text-[11px] text-text-muted text-center max-w-[340px]">
						Loads sandboxed interactive frame on-demand.
					</p>
				</div>
			)}
		</div>

		<!-- Dynamic Iframe Container -->
		<div class="iframe-container absolute inset-0 w-full h-full hidden">
			<div class="loading-indicator absolute inset-0 flex items-center justify-center bg-[#090812] text-accent font-mono text-xs tracking-[1px]">
				[ CONNECTING TO LIVE DEMO... ]
			</div>
			<div class="blocked-fallback absolute inset-0 flex-col items-center justify-center bg-[#090812] text-text-secondary font-mono text-xs p-6 text-center gap-3 hidden">
				<p class="text-text-muted">[ Note: Embedding prevented by target website security headers (CSP / X-Frame-Options). ]</p>
				{url && (
					<a href={url} target="_blank" rel="noopener noreferrer" class="py-2 px-4 border border-accent text-accent hover:bg-accent hover:text-black transition-all uppercase tracking-[1px] no-underline">
						Open Direct Website ↗
					</a>
				)}
			</div>
		</div>
	</div>

	{caption && (
		<div class="px-4 py-2 border-t border-border bg-[#0a0914] font-mono text-xs text-text-muted text-center">
			{caption}
		</div>
	)}
</div>

<script>
	function initLiveEmbeds() {
		const containers = document.querySelectorAll<HTMLElement>('.live-preview-container');
		
		containers.forEach((container) => {
			const embedUrl = container.getAttribute('data-embed-url');
			const launchBtn = container.querySelector<HTMLButtonElement>('.btn-launch-embed');
			const poster = container.querySelector<HTMLElement>('.preview-poster');
			const iframeContainer = container.querySelector<HTMLElement>('.iframe-container');
			const loadingIndicator = container.querySelector<HTMLElement>('.loading-indicator');
			const blockedFallback = container.querySelector<HTMLElement>('.blocked-fallback');

			if (!launchBtn || !iframeContainer || !embedUrl) return;

			launchBtn.addEventListener('click', () => {
				if (poster) poster.classList.add('hidden');
				iframeContainer.classList.remove('hidden');

				const iframe = document.createElement('iframe');
				iframe.src = embedUrl;
				iframe.className = 'w-full h-full border-0';
				iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
				iframe.setAttribute('loading', 'lazy');
				iframe.setAttribute('title', 'Live Project Preview');

				iframe.onload = () => {
					if (loadingIndicator) loadingIndicator.classList.add('hidden');
				};

				iframe.onerror = () => {
					if (loadingIndicator) loadingIndicator.classList.add('hidden');
					if (blockedFallback) {
						blockedFallback.classList.remove('hidden');
						blockedFallback.classList.add('flex');
					}
				};

				iframeContainer.appendChild(iframe);
			});
		});
	}

	document.addEventListener('astro:page-load', initLiveEmbeds);
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		initLiveEmbeds();
	} else {
		document.addEventListener('DOMContentLoaded', initLiveEmbeds);
	}
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/showcases/ImageShowcase.astro src/components/showcases/LivePreviewShowcase.astro
git commit -m "feat: add ImageShowcase and LivePreviewShowcase components"
```

---

### Task 4: Build `GameOfLifeShowcase.astro`

**Files:**
- Create: `src/components/showcases/GameOfLifeShowcase.astro`

- [ ] **Step 1: Create `src/components/showcases/GameOfLifeShowcase.astro`**

```astro
---
---

<div class="gol-showcase-container mb-10 w-full rounded-[2px] border border-border bg-[#0c0c12] overflow-hidden">
	<div class="flex items-center justify-between px-3 md:px-4 py-2.5 bg-[#141320] border-b border-border font-mono text-xs text-text-secondary select-none">
		<div class="flex items-center gap-2">
			<span class="text-accent uppercase tracking-[1px] font-bold">[ CONWAY.GOL ]</span>
			<span class="text-text-muted text-[11px] hidden sm:inline-block">— Cellular Automata Simulation</span>
		</div>
		<div class="font-mono text-xs text-text-muted tracking-[1px]">
			GEN: <span id="gen-count" class="text-accent font-bold">0</span>
		</div>
	</div>

	<div class="relative w-full flex flex-col items-center bg-black p-4">
		<canvas 
			id="gol-canvas" 
			width="700" 
			height="400" 
			class="bg-black border border-border [image-rendering:pixelated] cursor-crosshair max-w-full rounded-[2px]"
		></canvas>

		<div class="flex gap-2 sm:gap-3 mt-4 flex-wrap justify-center font-mono">
			<button id="btn-play" class="bg-transparent text-text-secondary border border-border py-1.5 px-3.5 text-xs uppercase tracking-[0.5px] cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent active:scale-95 transition-all duration-150 rounded-[2px]">[ Play ]</button>
			<button id="btn-random" class="bg-transparent text-text-secondary border border-border py-1.5 px-3.5 text-xs uppercase tracking-[0.5px] cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent active:scale-95 transition-all duration-150 rounded-[2px]">[ Randomize ]</button>
			<button id="btn-clear" class="bg-transparent text-text-secondary border border-border py-1.5 px-3.5 text-xs uppercase tracking-[0.5px] cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent active:scale-95 transition-all duration-150 rounded-[2px]">[ Clear ]</button>
		</div>
	</div>
</div>

<script src="../../scripts/portfolio/game-of-life.ts"></script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/showcases/GameOfLifeShowcase.astro
git commit -m "feat: add GameOfLifeShowcase component"
```

---

### Task 5: Build `ProjectShowcase.astro` & Integrate into `[...slug].astro`

**Files:**
- Create: `src/components/showcases/ProjectShowcase.astro`
- Modify: `src/pages/portfolio/[...slug].astro`

**Interfaces:**
- `ProjectShowcase.astro` Props: `{ project: CollectionEntry<'projects'> }`

- [ ] **Step 1: Create `src/components/showcases/ProjectShowcase.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import LivePreviewShowcase from './LivePreviewShowcase.astro';
import GameOfLifeShowcase from './GameOfLifeShowcase.astro';
import ImageShowcase from './ImageShowcase.astro';

interface Props {
	project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
const { title, heroImage, link, showcase } = project.data;
const showcaseType = showcase?.type || (heroImage ? 'image' : 'none');
---

{showcaseType === 'live-preview' && (
	<LivePreviewShowcase 
		url={showcase?.url || link} 
		previewImage={showcase?.previewImage || heroImage} 
		title={title}
		aspectRatio={showcase?.aspectRatio}
		caption={showcase?.caption}
	/>
)}

{showcaseType === 'game-of-life' && (
	<GameOfLifeShowcase />
)}

{showcaseType === 'image' && heroImage && (
	<ImageShowcase 
		image={heroImage} 
		title={title} 
		caption={showcase?.caption} 
	/>
)}
```

- [ ] **Step 2: Update `src/pages/portfolio/[...slug].astro`**

```astro
---
import { type CollectionEntry, getCollection, render } from 'astro:content';
import BaseHead from '../../components/BaseHead.astro';
import BackToProjects from '../../components/BackToProjects.astro';
import Footer from '../../components/Footer.astro';
import ProjectShowcase from '../../components/showcases/ProjectShowcase.astro';
import { SITE_TITLE } from '../../consts';

export async function getStaticPaths() {
	const projects = await getCollection('projects');
	return projects.map((project) => ({
		params: { slug: project.id },
		props: project,
	}));
}
type Props = CollectionEntry<'projects'>;

const project = Astro.props;
const { title, description, category, tags = [], github, link } = project.data;
const { Content } = await render(project);
---

<!doctype html>
<html lang="en">
	<head>
		<BaseHead title={`${title} | ${SITE_TITLE}`} description={description} />
	</head>
	<body class="bg-bg text-text-secondary min-h-screen flex flex-col">
		<main class="max-w-[840px] w-[calc(100%-2rem)] mx-auto px-4 pb-12 flex-1">
			<BackToProjects />
			<div class="mb-10 pb-7 border-b border-border">
				<div>
					<span class={`inline-block font-mono text-xs uppercase tracking-[1px] py-1 px-2 border rounded-[2px] mb-3 ${
						category === 'professional'
							? 'text-accent border-accent bg-accent/10'
							: 'text-text-muted border-border'
					}`}>
						[{category === 'professional' ? 'PROFESSIONAL' : 'FOR FUN'}]
					</span>
				</div>
				<h1 class="text-3xl md:text-4xl font-bold font-mono text-text-primary">{title}</h1>
				<p class="text-text-secondary text-lg mt-2 leading-relaxed">{description}</p>

				{tags.length > 0 && (
					<ul class="flex flex-wrap gap-1.5 my-5 list-none p-0">
						{tags.map((tag) => (
							<li class="font-mono text-xs bg-bg-subtle border border-border py-0.5 px-2 rounded-[2px] text-text-secondary uppercase">{tag}</li>
						))}
					</ul>
				)}

				<div class="flex gap-3 mt-6 flex-wrap">
					{github && (
						<a href={github} target="_blank" rel="noopener noreferrer" class="inline-flex items-center py-2 px-4 border border-accent bg-transparent text-accent font-mono text-sm uppercase tracking-[0.5px] rounded-[2px] no-underline hover:bg-accent hover:text-black transition-all duration-150">
							GitHub Source ↗
						</a>
					)}
					{link && (
						<a href={link} target="_blank" rel="noopener noreferrer" class="inline-flex items-center py-2 px-4 border border-border-light text-text-primary font-mono text-sm uppercase tracking-[0.5px] rounded-[2px] no-underline hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-150">
							Live Demo ↗
						</a>
					)}
				</div>
			</div>

			<!-- Dynamic Showcase Component -->
			<ProjectShowcase project={project} />

			<article class="leading-relaxed text-text-secondary [&_h1]:hidden [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-1.5 [&_h2]:text-text-primary [&_h2]:font-mono [&_ul]:pl-6 [&_ul]:mb-6 [&_li]:mb-1.5">
				<Content />
			</article>
		</main>
		<Footer />
	</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/showcases/ProjectShowcase.astro src/pages/portfolio/[...slug].astro
git commit -m "feat: connect ProjectShowcase dispatcher to dynamic project route"
```

---

### Task 6: Update Markdown Files & Remove Deprecated Standalone Routes

**Files:**
- Modify: `src/content/projects/sadie-portfolio.md`
- Modify: `src/content/projects/game-of-life.md`
- Delete: `src/pages/portfolio/game-of-life.astro`

- [ ] **Step 1: Update `src/content/projects/sadie-portfolio.md` frontmatter**

```markdown
---
title: "Sadie's Portfolio"
description: "Bespoke digital portfolio and creative gallery built for artist showcasing high-resolution visual works."
category: "professional"
order: 1
tags: ["Design", "Portfolio", "Frontend"]
heroImage: "/projects/sadie-portfolio-preview.svg"
link: "https://sadiemarilyn.com/"
github: "https://github.com/alex-papineau"
showcase:
  type: "live-preview"
  url: "https://sadiemarilyn.com/"
  previewImage: "/projects/sadie-portfolio-preview.svg"
  caption: "Interactive preview of Sadie's portfolio. Click launch to load live frame."
---
```

- [ ] **Step 2: Update `src/content/projects/game-of-life.md` frontmatter**

```markdown
---
title: "Conway's Game of Life"
description: "Cellular automata simulation implementing Conway's classic rules of life, death, and reproduction on a 2D grid."
category: "fun"
order: 1
tags: ["Simulation", "Canvas", "Algorithm"]
github: "https://github.com/alex-papineau"
showcase:
  type: "game-of-life"
---
```

- [ ] **Step 3: Remove standalone route files**

Delete `src/pages/portfolio/game-of-life.astro`.

- [ ] **Step 4: Commit**

```bash
git add src/content/projects/
git rm src/pages/portfolio/game-of-life.astro
git commit -m "refactor: configure project frontmatter showcase types and remove redundant route pages"
```

---

### Task 7: Create Theme-Relative Documentation Guide in `docs/SHOWCASE_SYSTEM.md`

**Files:**
- Create: `docs/SHOWCASE_SYSTEM.md`

- [ ] **Step 1: Write `docs/SHOWCASE_SYSTEM.md`**

Cover:
- Overview of how showcase types work.
- Frontmatter specification table (`showcase.type`, `url`, `previewImage`, `aspectRatio`, `caption`).
- How to add code from other repositories:
  - Adding a live website embed (`type: "live-preview"`).
  - Adding a custom canvas game / simulation (creating a showcase component under `src/components/showcases/`, script under `src/scripts/portfolio/`, and adding type to `src/content.config.ts` & `ProjectShowcase.astro`).
- Astro view transitions lifecycle guide (`astro:page-load`, `astro:before-swap`).
- All references using theme-relative paths (`src/...`, `public/...`).

- [ ] **Step 2: Commit**

```bash
git add docs/SHOWCASE_SYSTEM.md
git commit -m "docs: add comprehensive theme-relative showcase system integration guide"
```

---

### Task 8: Build Verification & End-to-End Testing

**Files:**
- Test all pages: `npm run build`

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: PASS (generates static pages in `dist/` including `/portfolio/sadie-portfolio/index.html`, `/portfolio/game-of-life/index.html`).

- [ ] **Step 2: Verify generated output routes**

Verify that all project pages render correctly with their respective showcase types.

- [ ] **Step 3: Commit any final verification polish**

```bash
git commit --allow-empty -m "chore: verify project showcases build and route generation"
```
