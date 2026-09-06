# SolidJS Astro Islands (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate SolidJS into the Astro portfolio and implement Phase 1 Astro Islands: the reactive homepage `ProjectCatalog`, the responsive `LivePreviewIsland` with device switching, and the fullscreen `ImageLightbox`.

**Architecture:** SolidJS components are placed under `src/components/islands/` and imported into Astro pages/components using client directives (`client:load`, `client:visible`, `client:idle`). Solid components render full semantic HTML on build/SSR for SEO and hydrate smoothly on the client.

**Tech Stack:** Astro v7, SolidJS (`@astrojs/solid`, `solid-js`), Tailwind CSS v4, TypeScript.

**Spec:** `docs/superpowers/specs/2026-09-06-solidjs-astro-islands-design.md`

## Global Constraints

- Preserve all existing dark terminal styling (`#0c0c12`, `#090812`, accent borders, mono typography).
- Zero breaking changes to existing Markdown content collection schema.
- SSR compatibility: SolidJS islands must render cleanly on the server without referencing `window` or `document` during initial render (use `onMount` or browser guards for DOM APIs).
- Clean typecheck: `npx astro check && tsc` must pass with zero errors.

---

### Task 1: Setup SolidJS Integration & TypeScript Configuration

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`

**Interfaces:**
- Produces: Astro support for `.tsx` Solid components and TypeScript typing for Solid JSX.

- [ ] **Step 1: Install `@astrojs/solid` and `solid-js`**

Run in PowerShell:
```powershell
npm install @astrojs/solid solid-js
```

- [ ] **Step 2: Update `astro.config.mjs`**

Add `solidJs()` to Astro config integrations:
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import solidJs from '@astrojs/solid';

// https://astro.build/config
export default defineConfig({
	site: 'https://alex-papineau.pages.dev',
	output: 'static',
	adapter: cloudflare({
		imageService: 'cloudflare',
	}),
	integrations: [solidJs(), mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
```

- [ ] **Step 3: Update `tsconfig.json`**

Configure Solid JSX support:
```json
{
	"extends": "astro/tsconfigs/strict",
	"compilerOptions": {
		"jsx": "preserve",
		"jsxImportSource": "solid-js"
	}
}
```

- [ ] **Step 4: Verify build with SolidJS integration**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 5: Commit**

```powershell
git add package.json package-lock.json astro.config.mjs tsconfig.json
git commit -m "feat: add @astrojs/solid integration and configure Solid JSX"
```

---

### Task 2: Build `ProjectCatalog.tsx` Island & Integrate into Homepage

**Files:**
- Create: `src/components/islands/ProjectCatalog.tsx`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: Array of serialized project objects from Astro's `getCollection('projects')`.
- Produces: `<ProjectCatalog projects={projects} client:load />` island with reactive search, category filtering, count badges, `/` keyboard shortcut, and URL parameter syncing (`?category=...&q=...`).

- [ ] **Step 1: Create `src/components/islands/ProjectCatalog.tsx`**

```tsx
import { createSignal, createMemo, onMount, onCleanup, For, Show } from 'solid-js';

export interface SerializedProject {
	id: string;
	data: {
		title: string;
		description: string;
		category: 'professional' | 'fun';
		tags?: string[];
		hideThumbnail?: boolean;
		link?: string;
		github?: string;
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

export default function ProjectCatalog(props: ProjectCatalogProps) {
	const [searchQuery, setSearchQuery] = createSignal('');
	const [activeCategory, setActiveCategory] = createSignal<'all' | 'professional' | 'fun'>('all');
	let searchInputRef: HTMLInputElement | undefined;

	// Synchronize state with URL query parameters
	const syncUrl = (cat: string, q: string) => {
		if (typeof window === 'undefined') return;
		const params = new URLSearchParams(window.location.search);
		if (cat && cat !== 'all') {
			params.set('category', cat);
		} else {
			params.delete('category');
		}

		if (q.trim()) {
			params.set('q', q.trim());
		} else {
			params.delete('q');
		}

		const newSearch = params.toString();
		const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}${window.location.hash}`;
		window.history.replaceState({}, '', newUrl);
	};

	onMount(() => {
		// Read initial parameters from URL
		const params = new URLSearchParams(window.location.search);
		const initialCat = params.get('category');
		const initialQ = params.get('q');

		if (initialCat === 'professional' || initialCat === 'fun') {
			setActiveCategory(initialCat);
		}
		if (initialQ) {
			setSearchQuery(initialQ);
		}

		// Keyboard shortcut listener: press '/' to focus search input
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === '/' && document.activeElement !== searchInputRef && !['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
				e.preventDefault();
				searchInputRef?.focus();
			}
		};

		// Back/Forward navigation listener
		const handlePopState = () => {
			const p = new URLSearchParams(window.location.search);
			const c = p.get('category');
			setActiveCategory(c === 'professional' || c === 'fun' ? c : 'all');
			setSearchQuery(p.get('q') || '');
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('popstate', handlePopState);

		onCleanup(() => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('popstate', handlePopState);
		});
	});

	const handleCategoryChange = (cat: 'all' | 'professional' | 'fun') => {
		setActiveCategory(cat);
		syncUrl(cat, searchQuery());
	};

	const handleSearchInput = (value: string) => {
		setSearchQuery(value);
		syncUrl(activeCategory(), value);
	};

	const clearSearch = () => {
		setSearchQuery('');
		syncUrl(activeCategory(), '');
		searchInputRef?.focus();
	};

	// Filter helper
	const matchesQuery = (project: SerializedProject, query: string) => {
		if (!query) return true;
		const q = query.toLowerCase();
		const cat = project.data.category;
		const aliases = cat === 'fun' ? 'fun for fun experiments personal' : 'professional work client';
		const title = project.data.title.toLowerCase();
		const desc = project.data.description.toLowerCase();
		const tags = (project.data.tags || []).join(' ').toLowerCase();

		return title.includes(q) || desc.includes(q) || tags.includes(q) || cat.includes(q) || aliases.includes(q);
	};

	// Categorized & Filtered Project Lists
	const professionalFiltered = createMemo(() => {
		if (activeCategory() !== 'all' && activeCategory() !== 'professional') return [];
		return props.projects.filter(p => p.data.category === 'professional' && matchesQuery(p, searchQuery()));
	});

	const funFiltered = createMemo(() => {
		if (activeCategory() !== 'all' && activeCategory() !== 'fun') return [];
		return props.projects.filter(p => p.data.category === 'fun' && matchesQuery(p, searchQuery()));
	});

	// Dynamic counts based on search query
	const countProfessional = createMemo(() => props.projects.filter(p => p.data.category === 'professional' && matchesQuery(p, searchQuery())).length);
	const countFun = createMemo(() => props.projects.filter(p => p.data.category === 'fun' && matchesQuery(p, searchQuery())).length);
	const countTotal = createMemo(() => countProfessional() + countFun());

	return (
		<div>
			{/* Search & Filter Controls */}
			<div class="mt-6 pt-6 border-t border-dashed border-border">
				<div class="relative flex items-center">
					<input
						ref={searchInputRef}
						type="search"
						value={searchQuery()}
						onInput={(e) => handleSearchInput(e.currentTarget.value)}
						class="w-full py-3.5 pl-5 pr-24 bg-bg-subtle border border-border-light rounded-xs text-text-primary font-mono text-base focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:border-accent/60 placeholder:text-text-muted placeholder:text-sm transition-all duration-150 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
						placeholder="Search projects by title, tags, or tools (Press '/' to focus)..."
						aria-label="Search projects"
					/>
					<Show when={searchQuery().length > 0}>
						<button
							type="button"
							onClick={clearSearch}
							class="absolute right-3 py-1 px-3 bg-bg-subtle text-text-secondary border border-border-light rounded-xs font-mono text-xs font-semibold uppercase tracking-[0.5px] cursor-pointer hover:border-accent hover:text-white transition-all duration-150"
							aria-label="Clear search input"
						>
							Clear
						</button>
					</Show>
				</div>

				<div class="flex gap-2 flex-wrap items-center mt-4">
					<button
						type="button"
						onClick={() => handleCategoryChange('all')}
						class={`filter-btn bg-bg-subtle text-text-secondary border rounded-xs py-1.5 px-3.5 font-mono text-xs font-semibold uppercase tracking-[0.5px] cursor-pointer hover:border-accent hover:text-white transition-all duration-150 ${
							activeCategory() === 'all'
								? 'text-white border-accent bg-accent/20 font-bold'
								: 'border-border-light'
						}`}
					>
						All [{countTotal()}]
					</button>
					<button
						type="button"
						onClick={() => handleCategoryChange('professional')}
						class={`filter-btn bg-bg-subtle text-text-secondary border rounded-xs py-1.5 px-3.5 font-mono text-xs font-semibold uppercase tracking-[0.5px] cursor-pointer hover:border-accent hover:text-white transition-all duration-150 ${
							activeCategory() === 'professional'
								? 'text-white border-accent bg-accent/20 font-bold'
								: 'border-border-light'
						}`}
					>
						Professional [{countProfessional()}]
					</button>
					<button
						type="button"
						onClick={() => handleCategoryChange('fun')}
						class={`filter-btn bg-bg-subtle text-text-secondary border rounded-xs py-1.5 px-3.5 font-mono text-xs font-semibold uppercase tracking-[0.5px] cursor-pointer hover:border-accent hover:text-white transition-all duration-150 ${
							activeCategory() === 'fun'
								? 'text-white border-accent bg-accent/20 font-bold'
								: 'border-border-light'
						}`}
					>
						For Fun [{countFun()}]
					</button>
				</div>
			</div>

			{/* SECTION 01: PROFESSIONAL WORK */}
			<Show when={professionalFiltered().length > 0}>
				<section class="project-section w-full">
					<div class="w-full bg-[#090812] border-t border-b border-border border-l-[3px] border-l-accent py-4 px-4 md:px-8 flex items-center justify-between mt-8 font-mono">
						<h2 class="text-sm uppercase tracking-[2px] text-text-primary font-bold m-0 flex items-center gap-3">
							<span>PROFESSIONAL WORK</span>
						</h2>
						<span class="text-xs text-accent tracking-[1px]">
							[{professionalFiltered().length} PROJECT{professionalFiltered().length === 1 ? '' : 'S'}]
						</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] w-full bg-border gap-px border-b border-border overflow-hidden">
						<For each={professionalFiltered()}>
							{(project) => (
								<a
									href={`/portfolio/${project.id}`}
									class="project-card group bg-bg p-6 md:p-8 flex flex-col justify-between no-underline min-h-[300px] border border-transparent hover:border-accent transition-all duration-150 relative z-0 hover:z-10"
								>
									<div>
										{!project.data.hideThumbnail && (
											<div class="w-full aspect-video shrink-0 overflow-hidden rounded-xs border border-border-light bg-[#090812] relative flex items-center justify-center mb-5">
												<img
													src={project.thumbnail.src}
													alt={`${project.data.title} preview`}
													class={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 ${
														project.thumbnail.isLogo ? 'w-16 h-16 object-contain opacity-50' : ''
													}`}
													loading="lazy"
													decoding="async"
													onError={(e) => {
														const target = e.currentTarget;
														if (project.thumbnail.fallbackSnapshot && target.src !== project.thumbnail.fallbackSnapshot) {
															target.src = project.thumbnail.fallbackSnapshot;
														} else {
															target.onerror = null;
															target.src = '/favicon.svg';
															target.className = 'w-16 h-16 object-contain opacity-50';
														}
													}}
												/>
											</div>
										)}
										<div class="font-mono text-[0.7rem] uppercase tracking-[1px] mb-2 text-accent">[PROFESSIONAL]</div>
										<h3 class="m-0 mb-2 text-xl font-mono text-text-primary uppercase tracking-[0.5px] group-hover:text-white transition-colors duration-150">
											{project.data.title}
										</h3>
										<p class="m-0 text-sm text-text-secondary leading-relaxed">{project.data.description}</p>
									</div>
									<div class="flex justify-between items-center mt-6 pt-3.5 border-t border-dashed border-border">
										<div class="flex flex-wrap gap-1.5">
											<For each={project.data.tags || []}>
												{(tag) => (
													<span class="font-mono text-[0.72rem] text-text-muted border border-border py-0.5 px-1.5 rounded-xs uppercase">
														{tag}
													</span>
												)}
											</For>
										</div>
										<span class="font-mono text-base text-text-secondary group-hover:text-white group-hover:translate-x-1 transition-all duration-150">
											→
										</span>
									</div>
								</a>
							)}
						</For>
					</div>
				</section>
			</Show>

			{/* SECTION 02: EXPERIMENTS & FOR FUN */}
			<Show when={funFiltered().length > 0}>
				<section class="project-section w-full">
					<div class="w-full bg-bg-subtle border-t border-b border-border py-4 px-4 md:px-8 flex items-center justify-between mt-8 font-mono">
						<h2 class="text-sm uppercase tracking-[2px] text-text-primary font-bold m-0 flex items-center gap-3">
							<span>EXPERIMENTS & FOR FUN</span>
						</h2>
						<span class="text-xs text-accent tracking-[1px]">
							[{funFiltered().length} PROJECT{funFiltered().length === 1 ? '' : 'S'}]
						</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] w-full bg-border gap-px border-b border-border overflow-hidden">
						<For each={funFiltered()}>
							{(project) => (
								<a
									href={`/portfolio/${project.id}`}
									class="project-card group bg-bg p-6 md:p-8 flex flex-col justify-between no-underline min-h-[300px] border border-transparent hover:border-accent transition-all duration-150 relative z-0 hover:z-10"
								>
									<div>
										{!project.data.hideThumbnail && (
											<div class="w-full aspect-video shrink-0 overflow-hidden rounded-xs border border-border-light bg-[#090812] relative flex items-center justify-center mb-5">
												<img
													src={project.thumbnail.src}
													alt={`${project.data.title} preview`}
													class={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 ${
														project.thumbnail.isLogo ? 'w-16 h-16 object-contain opacity-50' : ''
													}`}
													loading="lazy"
													decoding="async"
													onError={(e) => {
														const target = e.currentTarget;
														if (project.thumbnail.fallbackSnapshot && target.src !== project.thumbnail.fallbackSnapshot) {
															target.src = project.thumbnail.fallbackSnapshot;
														} else {
															target.onerror = null;
															target.src = '/favicon.svg';
															target.className = 'w-16 h-16 object-contain opacity-50';
														}
													}}
												/>
											</div>
										)}
										<div class="font-mono text-[0.7rem] uppercase tracking-[1px] mb-2 text-text-muted">[FOR FUN]</div>
										<h3 class="m-0 mb-2 text-xl font-mono text-text-primary uppercase tracking-[0.5px] group-hover:text-white transition-colors duration-150">
											{project.data.title}
										</h3>
										<p class="m-0 text-sm text-text-secondary leading-relaxed">{project.data.description}</p>
									</div>
									<div class="flex justify-between items-center mt-6 pt-3.5 border-t border-dashed border-border">
										<div class="flex flex-wrap gap-1.5">
											<For each={project.data.tags || []}>
												{(tag) => (
													<span class="font-mono text-[0.72rem] text-text-muted border border-border py-0.5 px-1.5 rounded-xs uppercase">
														{tag}
													</span>
												)}
											</For>
										</div>
										<span class="font-mono text-base text-text-secondary group-hover:text-white group-hover:translate-x-1 transition-all duration-150">
											→
										</span>
									</div>
								</a>
							)}
						</For>
					</div>
				</section>
			</Show>

			{/* Empty State */}
			<Show when={countTotal() === 0}>
				<div class="py-16 px-6 text-center font-mono text-text-muted text-sm border-b border-dashed border-border mx-auto max-w-[900px] w-full">
					No projects found matching the query "{searchQuery()}".
				</div>
			</Show>
		</div>
	);
}
```

- [ ] **Step 2: Update `src/pages/index.astro` to use `ProjectCatalog`**

Refactor `src/pages/index.astro` to serialize projects, pass them to `<ProjectCatalog projects={serializedProjects} client:load />`, and remove the old imperative `<script>`.

- [ ] **Step 3: Test and verify homepage island**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 4: Commit**

```powershell
git add src/components/islands/ProjectCatalog.tsx src/pages/index.astro
git commit -m "feat: migrate homepage project filtering to SolidJS ProjectCatalog island"
```

---

### Task 3: Build `LivePreviewIsland.tsx` & Integrate into `LivePreviewShowcase.astro`

**Files:**
- Create: `src/components/islands/LivePreviewIsland.tsx`
- Modify: `src/components/showcases/LivePreviewShowcase.astro`

**Interfaces:**
- Consumes: `url`, `previewImage`, `title`, `aspectRatio`, `caption` props.
- Produces: `<LivePreviewIsland ... client:visible />` with Desktop/Tablet/Mobile framing, reload capability, sandbox security, and error fallbacks.

- [ ] **Step 1: Create `src/components/islands/LivePreviewIsland.tsx`**

```tsx
import { createSignal, Show } from 'solid-js';

interface LivePreviewIslandProps {
	url?: string;
	previewImage?: string;
	title: string;
	aspectRatio?: string;
	caption?: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function LivePreviewIsland(props: LivePreviewIslandProps) {
	const [activeDevice, setActiveDevice] = createSignal<DeviceMode>('desktop');
	const [isLaunched, setIsLaunched] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(true);
	const [isBlocked, setIsBlocked] = createSignal(false);
	const [reloadKey, setReloadKey] = createSignal(0);

	const displayUrl = () =>
		props.url ? props.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'preview.local';

	const handleLaunch = () => {
		// Small mobile viewport fallback: open external tab directly
		if (typeof window !== 'undefined' && window.innerWidth < 768 && props.url) {
			window.open(props.url, '_blank', 'noopener,noreferrer');
			return;
		}
		setIsLaunched(true);
		setIsLoading(true);
		setIsBlocked(false);
	};

	const handleReload = () => {
		setIsLoading(true);
		setIsBlocked(false);
		setReloadKey((k) => k + 1);
	};

	// Container width styles based on active device
	const getDeviceWidthClass = () => {
		switch (activeDevice()) {
			case 'mobile':
				return 'max-w-[390px] border-x border-border shadow-2xl';
			case 'tablet':
				return 'max-w-[768px] border-x border-border shadow-2xl';
			case 'desktop':
			default:
				return 'w-full';
		}
	};

	return (
		<div class="live-preview-container mb-12 w-[calc(100vw-2rem)] max-w-[1200px] relative left-1/2 -translate-x-1/2 rounded-xs border border-border bg-[#0c0c12] overflow-hidden shadow-2xl">
			{/* Top Bar with URL & Device Switcher */}
			<div class="flex items-center justify-between px-3 md:px-4 py-2.5 bg-[#141320] border-b border-border font-mono text-xs text-text-secondary select-none flex-wrap gap-2">
				{/* Address Bar */}
				<div class="flex items-center gap-1.5 px-3 py-1 bg-[#090812] border border-border rounded-xs text-text-muted text-[11px] max-w-[280px] sm:max-w-[360px] truncate">
					<span class="text-accent">🔒</span>
					<span class="text-text-secondary truncate">{displayUrl()}</span>
				</div>

				{/* Device Mode Switcher Controls */}
				<div class="flex items-center gap-1.5">
					<div class="flex border border-border-light rounded-xs bg-[#090812] overflow-hidden p-0.5 text-[11px]">
						<button
							type="button"
							onClick={() => setActiveDevice('desktop')}
							class={`py-1 px-2.5 rounded-xs font-mono uppercase tracking-[0.5px] cursor-pointer transition-colors ${
								activeDevice() === 'desktop'
									? 'bg-accent/20 text-white font-bold border border-accent/40'
									: 'text-text-secondary hover:text-white'
							}`}
							title="Desktop View (100%)"
						>
							Desktop
						</button>
						<button
							type="button"
							onClick={() => setActiveDevice('tablet')}
							class={`py-1 px-2.5 rounded-xs font-mono uppercase tracking-[0.5px] cursor-pointer transition-colors ${
								activeDevice() === 'tablet'
									? 'bg-accent/20 text-white font-bold border border-accent/40'
									: 'text-text-secondary hover:text-white'
							}`}
							title="Tablet View (768px)"
						>
							Tablet
						</button>
						<button
							type="button"
							onClick={() => setActiveDevice('mobile')}
							class={`py-1 px-2.5 rounded-xs font-mono uppercase tracking-[0.5px] cursor-pointer transition-colors ${
								activeDevice() === 'mobile'
									? 'bg-accent/20 text-white font-bold border border-accent/40'
									: 'text-text-secondary hover:text-white'
							}`}
							title="Mobile View (390px)"
						>
							Mobile
						</button>
					</div>

					<Show when={isLaunched()}>
						<button
							type="button"
							onClick={handleReload}
							class="py-1 px-2.5 bg-[#090812] border border-border-light rounded-xs text-text-secondary hover:text-white hover:border-accent text-[11px] font-mono uppercase tracking-[0.5px] cursor-pointer transition-colors"
							title="Reload Preview Frame"
						>
							⟳
						</button>
					</Show>

					{props.url && (
						<a
							href={props.url}
							target="_blank"
							rel="noopener noreferrer"
							class="py-1 px-2.5 bg-[#090812] border border-border-light rounded-xs text-accent hover:text-white hover:border-accent text-[11px] font-mono uppercase tracking-[0.5px] no-underline transition-colors"
							title="Open URL in new tab"
						>
							Open ↗
						</a>
					)}
				</div>
			</div>

			{/* Screen Area with Device Chassis Framing */}
			<div class="relative w-full overflow-hidden bg-black/40 flex justify-center py-2 sm:py-4 transition-all duration-300">
				<div
					class={`relative mx-auto transition-all duration-300 ease-out bg-bg-subtle overflow-hidden ${getDeviceWidthClass()}`}
					style={{
						'aspect-ratio': props.aspectRatio || '16/9',
						'min-height': activeDevice() === 'mobile' ? '600px' : '520px',
						'max-height': '800px',
					}}
				>
					{/* Poster State */}
					<Show when={!isLaunched()}>
						<div class="preview-poster absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 z-10">
							{props.previewImage && (
								<img
									src={props.previewImage}
									alt={`${props.title} live preview`}
									class="w-full h-full object-contain"
									loading="lazy"
								/>
							)}

							<div class="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4">
								<button
									type="button"
									onClick={handleLaunch}
									class="btn-launch-embed inline-flex items-center gap-2 py-2.5 px-5 border border-border-light bg-bg-subtle text-text-primary font-mono text-xs font-semibold uppercase tracking-[0.5px] rounded-xs cursor-pointer hover:border-accent hover:text-white transition-all duration-150 shadow-lg active:scale-95"
								>
									<span class="hidden md:inline">[ Launch Interactive Preview ▶ ]</span>
									<span class="inline md:hidden">[ Open Live Demo ↗ ]</span>
								</button>
								<p class="font-mono text-[11px] text-text-secondary text-center max-w-[340px]">
									<span class="hidden md:inline">Loads sandboxed interactive frame on-demand.</span>
									<span class="inline md:hidden">Interactive frame opens in new tab on mobile.</span>
								</p>
							</div>
						</div>
					</Show>

					{/* Active Iframe Sandbox */}
					<Show when={isLaunched()}>
						<div class="absolute inset-0 w-full h-full">
							<Show when={isLoading()}>
								<div class="absolute inset-0 flex flex-col items-center justify-center bg-[#090812] text-white font-mono text-xs font-bold tracking-[1px] gap-2 z-20">
									<div class="animate-spin text-accent text-lg">◈</div>
									<span>[ CONNECTING TO LIVE DEMO... ]</span>
								</div>
							</Show>

							<Show when={isBlocked()}>
								<div class="absolute inset-0 flex flex-col items-center justify-center bg-[#090812] text-text-secondary font-mono text-xs p-6 text-center gap-3 z-30">
									<p class="text-text-secondary">
										[ Note: Embedding prevented by target website security headers (CSP / X-Frame-Options). ]
									</p>
									{props.url && (
										<a
											href={props.url}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center py-2 px-4 border border-border-light bg-bg-subtle text-text-primary font-mono text-xs font-semibold uppercase tracking-[0.5px] rounded-xs no-underline hover:border-accent hover:text-white transition-all duration-150"
										>
											Open Direct Website ↗
										</a>
									)}
								</div>
							</Show>

							{props.url && (
								<iframe
									key={reloadKey()}
									src={props.url}
									class="w-full h-full border-0"
									sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
									loading="lazy"
									title={`${props.title} Live Interactive Preview`}
									onLoad={() => setIsLoading(false)}
									onError={() => {
										setIsLoading(false);
										setIsBlocked(true);
									}}
								/>
							)}
						</div>
					</Show>
				</div>
			</div>

			{props.caption && (
				<div class="px-4 py-2 border-t border-border bg-[#0a0914] font-mono text-xs text-text-muted text-center">
					{props.caption}
				</div>
			)}
		</div>
	);
}
```

- [ ] **Step 2: Update `src/components/showcases/LivePreviewShowcase.astro`**

```astro
---
import LivePreviewIsland from '../islands/LivePreviewIsland.tsx';

interface Props {
	url?: string;
	previewImage?: string;
	title: string;
	aspectRatio?: string;
	caption?: string;
}

const { url, previewImage, title, aspectRatio, caption } = Astro.props;
---

<LivePreviewIsland
	client:visible
	url={url}
	previewImage={previewImage}
	title={title}
	aspectRatio={aspectRatio}
	caption={caption}
/>
```

- [ ] **Step 3: Test and verify build**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 4: Commit**

```powershell
git add src/components/islands/LivePreviewIsland.tsx src/components/showcases/LivePreviewShowcase.astro
git commit -m "feat: implement responsive device frame switcher LivePreviewIsland"
```

---

### Task 4: Build `ImageLightbox.tsx` & Integrate into `ImageShowcase.astro`

**Files:**
- Create: `src/components/islands/ImageLightbox.tsx`
- Modify: `src/components/showcases/ImageShowcase.astro`

**Interfaces:**
- Consumes: `image`, `title`, `caption` props.
- Produces: `<ImageLightbox ... client:idle />` with full-screen zoom/pan modal, keyboard `Escape` handler, and scroll lock.

- [ ] **Step 1: Create `src/components/islands/ImageLightbox.tsx`**

```tsx
import { createSignal, onMount, onCleanup, Show } from 'solid-js';

interface ImageLightboxProps {
	image: string;
	title: string;
	caption?: string;
}

type ZoomLevel = 'fit' | '100%' | '200%';

export default function ImageLightbox(props: ImageLightboxProps) {
	const [isOpen, setIsOpen] = createSignal(false);
	const [zoom, setZoom] = createSignal<ZoomLevel>('fit');

	const openLightbox = () => {
		setIsOpen(true);
		setZoom('fit');
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'hidden';
		}
	};

	const closeLightbox = () => {
		setIsOpen(false);
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	};

	onMount(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen()) {
				closeLightbox();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		onCleanup(() => {
			window.removeEventListener('keydown', handleKeyDown);
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
		});
	});

	const getZoomClass = () => {
		switch (zoom()) {
			case '100%':
				return 'max-w-none w-auto h-auto object-none';
			case '200%':
				return 'max-w-none w-[200%] h-auto object-none scale-100';
			case 'fit':
			default:
				return 'max-w-full max-h-[85vh] object-contain';
		}
	};

	return (
		<>
			{/* Inline Preview Figure */}
			<figure class="mb-10 w-full overflow-hidden rounded-xs border border-border bg-bg-subtle flex flex-col items-center justify-center p-4 md:p-8 relative group">
				<div
					onClick={openLightbox}
					class="relative cursor-zoom-in max-w-full flex items-center justify-center overflow-hidden"
				>
					<img
						src={props.image}
						alt={`${props.title} preview`}
						class="max-w-full max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
						loading="lazy"
					/>
					<div class="absolute bottom-2 right-2 bg-black/80 border border-border-light px-2.5 py-1 rounded-xs font-mono text-[11px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
						[ Click to inspect ⛶ ]
					</div>
				</div>
				{props.caption && (
					<figcaption class="mt-3 font-mono text-xs text-text-muted tracking-[0.5px] text-center">
						{props.caption}
					</figcaption>
				)}
			</figure>

			{/* Fullscreen Lightbox Modal */}
			<Show when={isOpen()}>
				<div
					class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
					onClick={(e) => {
						if (e.target === e.currentTarget) closeLightbox();
					}}
				>
					{/* Modal Header */}
					<div class="w-full max-w-[1400px] flex items-center justify-between py-2 border-b border-border/80 font-mono text-xs text-text-secondary select-none">
						<div class="truncate max-w-[50%]">
							<span class="text-accent font-bold">[ PREVIEW ]</span>
							<span class="text-text-primary ml-2">{props.title}</span>
						</div>

						{/* Zoom Controls & Close */}
						<div class="flex items-center gap-2">
							<div class="flex border border-border-light rounded-xs bg-[#090812] overflow-hidden p-0.5 text-[11px]">
								<button
									type="button"
									onClick={() => setZoom('fit')}
									class={`py-1 px-2.5 rounded-xs font-mono uppercase tracking-[0.5px] cursor-pointer transition-colors ${
										zoom() === 'fit'
											? 'bg-accent/20 text-white font-bold border border-accent/40'
											: 'text-text-secondary hover:text-white'
									}`}
								>
									Fit
								</button>
								<button
									type="button"
									onClick={() => setZoom('100%')}
									class={`py-1 px-2.5 rounded-xs font-mono uppercase tracking-[0.5px] cursor-pointer transition-colors ${
										zoom() === '100%'
											? 'bg-accent/20 text-white font-bold border border-accent/40'
											: 'text-text-secondary hover:text-white'
									}`}
								>
									100%
								</button>
								<button
									type="button"
									onClick={() => setZoom('200%')}
									class={`py-1 px-2.5 rounded-xs font-mono uppercase tracking-[0.5px] cursor-pointer transition-colors ${
										zoom() === '200%'
											? 'bg-accent/20 text-white font-bold border border-accent/40'
											: 'text-text-secondary hover:text-white'
									}`}
								>
									200%
								</button>
							</div>

							<a
								href={props.image}
								target="_blank"
								rel="noopener noreferrer"
								class="py-1 px-3 bg-bg-subtle border border-border-light rounded-xs text-accent hover:text-white hover:border-accent text-xs font-mono uppercase tracking-[0.5px] no-underline transition-colors"
								title="Open raw image in new tab"
							>
								Raw ↗
							</a>

							<button
								type="button"
								onClick={closeLightbox}
								class="py-1 px-3 bg-bg-subtle border border-border-light rounded-xs text-text-secondary hover:text-white hover:border-accent text-xs font-mono uppercase tracking-[0.5px] cursor-pointer transition-colors"
								title="Close Lightbox (Esc)"
							>
								[ Esc ✕ ]
							</button>
						</div>
					</div>

					{/* Image Viewer Container with Scroll/Pan support */}
					<div
						class="flex-1 w-full max-w-[1400px] overflow-auto flex items-center justify-center p-2 my-2 cursor-grab active:cursor-grabbing"
						onClick={(e) => {
							if (e.target === e.currentTarget) closeLightbox();
						}}
					>
						<img
							src={props.image}
							alt={`${props.title} full inspection`}
							class={`transition-all duration-200 select-none shadow-2xl rounded-xs border border-border ${getZoomClass()}`}
						/>
					</div>

					{/* Modal Footer Caption */}
					<div class="w-full max-w-[1400px] text-center font-mono text-xs text-text-muted py-2 border-t border-border/80">
						{props.caption || `${props.title} Screenshot Preview`}
					</div>
				</div>
			</Show>
		</>
	);
}
```

- [ ] **Step 2: Update `src/components/showcases/ImageShowcase.astro`**

```astro
---
import ImageLightbox from '../islands/ImageLightbox.tsx';

interface Props {
	image?: string;
	title: string;
	caption?: string;
}

const { image, title, caption } = Astro.props;
---

{image && (
	<ImageLightbox
		client:idle
		image={image}
		title={title}
		caption={caption}
	/>
)}
```

- [ ] **Step 3: Test and verify build**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 4: Commit**

```powershell
git add src/components/islands/ImageLightbox.tsx src/components/showcases/ImageShowcase.astro
git commit -m "feat: implement fullscreen zoomable ImageLightbox island"
```

---

### Task 5: End-to-End Verification & TypeScript Check

**Files:**
- Test all pages: Homepage (`/`) and project slug pages (`/portfolio/*`)

- [ ] **Step 1: Run comprehensive TypeScript and Astro check**

Run in PowerShell:
```powershell
npm run check
```
Expected: Astro build and `tsc` succeed with 0 type errors.

- [ ] **Step 2: Verify island behavior**
- Test search filtering on `/` (typing query updates cards and URL param `?q=`).
- Test category switching (`All`, `Professional`, `For Fun` syncs `?category=`).
- Test keyboard shortcut `/` focuses input.
- Test detail pages with `LivePreviewShowcase` (Desktop, Tablet, Mobile buttons resize frame).
- Test detail pages with `ImageShowcase` (Clicking image opens modal, zoom levels work, Esc closes).
