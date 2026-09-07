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
			if (
				e.key === '/' &&
				document.activeElement !== searchInputRef &&
				!['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)
			) {
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
		const q = query.toLowerCase().trim();
		const cat = project.data.category;
		const aliases = cat === 'fun' ? 'fun for fun experiments personal' : 'professional work client';
		const title = project.data.title.toLowerCase();
		const desc = project.data.description.toLowerCase();
		const tags = (project.data.tags || []).join(' ').toLowerCase();

		return (
			title.includes(q) ||
			desc.includes(q) ||
			tags.includes(q) ||
			cat.includes(q) ||
			aliases.includes(q)
		);
	};

	// Categorized & Filtered Project Lists
	const professionalFiltered = createMemo(() => {
		if (activeCategory() !== 'all' && activeCategory() !== 'professional') return [];
		return props.projects.filter(
			(p) => p.data.category === 'professional' && matchesQuery(p, searchQuery())
		);
	});

	const funFiltered = createMemo(() => {
		if (activeCategory() !== 'all' && activeCategory() !== 'fun') return [];
		return props.projects.filter(
			(p) => p.data.category === 'fun' && matchesQuery(p, searchQuery())
		);
	});

	// Dynamic counts based on search query
	const countProfessional = createMemo(
		() =>
			props.projects.filter(
				(p) => p.data.category === 'professional' && matchesQuery(p, searchQuery())
			).length
	);
	const countFun = createMemo(
		() =>
			props.projects.filter((p) => p.data.category === 'fun' && matchesQuery(p, searchQuery()))
				.length
	);
	const countTotal = createMemo(() => countProfessional() + countFun());

	return (
		<div>
			{/* Search & Filter Controls (Full-width within main container) */}
			<div class="w-full">
				<div class="mt-6 pt-6 border-t border-dashed border-border">
					<div class="relative flex items-center">
						<input
							ref={searchInputRef}
							type="search"
							value={searchQuery()}
							onInput={(e) => handleSearchInput(e.currentTarget.value)}
							class="w-full py-3.5 pl-5 pr-24 bg-bg-subtle border border-border-light rounded-xs text-text-primary font-mono text-base focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:border-accent/60 placeholder:text-text-muted placeholder:text-sm transition-all duration-150 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
							placeholder="Search all projects, categories, tags, or tools."
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
									? 'active text-white border-accent bg-accent/20 font-bold'
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
									? 'active text-white border-accent bg-accent/20 font-bold'
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
									? 'active text-white border-accent bg-accent/20 font-bold'
									: 'border-border-light'
							}`}
						>
							For Fun [{countFun()}]
						</button>
					</div>
				</div>
			</div>

			{/* SECTION 01: PROFESSIONAL WORK (Restyled banner + 3-column responsive grid) */}
			<Show when={professionalFiltered().length > 0}>
				<section class="project-section w-full bg-black" id="section-professional" data-section-category="professional">
					<div class="w-full bg-bg-subtle border-t border-b border-border border-x-[3px] border-x-accent py-3.5 px-4 md:px-6 flex items-center justify-between mt-10 font-mono">
						<h2 class="text-sm md:text-base uppercase tracking-[2px] text-text-primary font-bold m-0 flex items-center gap-3">
							<span>PROFESSIONAL WORK</span>
						</h2>
						<span class="text-xs text-accent tracking-[1px] font-semibold bg-accent/10 border border-accent/30 py-1 px-2.5 rounded-xs" id="count-professional">
							[{professionalFiltered().length} PROJECT{professionalFiltered().length === 1 ? '' : 'S'}]
						</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full bg-black border-b border-border overflow-hidden">
						<For each={professionalFiltered()}>
							{(project) => (
								<a
									href={`/portfolio/${project.id}`}
									class="project-card group bg-black p-6 md:p-8 flex flex-col justify-between no-underline min-h-[300px] border border-border hover:border-accent transition-all duration-150 relative z-0 hover:z-10"
									data-category="professional"
									data-title={project.data.title.toLowerCase()}
									data-description={project.data.description.toLowerCase()}
									data-tags={(project.data.tags || []).join(' ').toLowerCase()}
								>
									<div>
										{!project.data.hideThumbnail && (
											<div class="w-full aspect-video shrink-0 overflow-hidden rounded-xs border border-border-light bg-black relative flex items-center justify-center mb-5">
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
														if (
															project.thumbnail.fallbackSnapshot &&
															target.src !== project.thumbnail.fallbackSnapshot
														) {
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
										<div class="font-mono text-[0.7rem] uppercase tracking-[1px] mb-2 text-accent">
											[PROFESSIONAL]
										</div>
										<h3 class="m-0 mb-2 text-xl font-mono text-text-primary uppercase tracking-[0.5px] group-hover:text-white transition-colors duration-150">
											{project.data.title}
										</h3>
										<p class="m-0 text-sm text-text-secondary leading-relaxed">
											{project.data.description}
										</p>
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
									</div>
								</a>
							)}
						</For>
					</div>
				</section>
			</Show>

			{/* SECTION 02: EXPERIMENTS & FOR FUN (Restyled banner + 3-column responsive grid) */}
			<Show when={funFiltered().length > 0}>
				<section class="project-section w-full bg-black" id="section-fun" data-section-category="fun">
				<div class="w-full bg-bg-subtle border-t border-b border-border border-x-[3px] border-x-border-light py-3.5 px-4 md:px-6 flex items-center justify-between mt-12 font-mono">
						<h2 class="text-sm md:text-base uppercase tracking-[2px] text-text-primary font-bold m-0 flex items-center gap-3">
							<span>EXPERIMENTS & FOR FUN</span>
						</h2>
						<span class="text-xs text-text-secondary tracking-[1px] font-semibold bg-bg border border-border-light py-1 px-2.5 rounded-xs" id="count-fun">
							[{funFiltered().length} PROJECT{funFiltered().length === 1 ? '' : 'S'}]
						</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full bg-black border-b border-border overflow-hidden">
						<For each={funFiltered()}>
							{(project) => (
								<a
									href={`/portfolio/${project.id}`}
									class="project-card group bg-black p-6 md:p-8 flex flex-col justify-between no-underline min-h-[300px] border border-border hover:border-accent transition-all duration-150 relative z-0 hover:z-10"
									data-category="fun"
									data-title={project.data.title.toLowerCase()}
									data-description={project.data.description.toLowerCase()}
									data-tags={(project.data.tags || []).join(' ').toLowerCase()}
								>
									<div>
										{!project.data.hideThumbnail && (
											<div class="w-full aspect-video shrink-0 overflow-hidden rounded-xs border border-border-light bg-black relative flex items-center justify-center mb-5">
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
														if (
															project.thumbnail.fallbackSnapshot &&
															target.src !== project.thumbnail.fallbackSnapshot
														) {
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
										<div class="font-mono text-[0.7rem] uppercase tracking-[1px] mb-2 text-text-muted">
											[FOR FUN]
										</div>
										<h3 class="m-0 mb-2 text-xl font-mono text-text-primary uppercase tracking-[0.5px] group-hover:text-white transition-colors duration-150">
											{project.data.title}
										</h3>
										<p class="m-0 text-sm text-text-secondary leading-relaxed">
											{project.data.description}
										</p>
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
									</div>
								</a>
							)}
						</For>
					</div>
				</section>
			</Show>

			{/* Empty State */}
			<Show when={countTotal() === 0}>
				<div class="py-16 px-6 text-center font-mono text-text-muted text-sm border-b border-dashed border-border w-full">
					No projects found matching the query "{searchQuery()}".
				</div>
			</Show>
		</div>
	);
}
