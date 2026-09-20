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

// Matches a project against a free-text search query (title, description, tags, category, aliases)
export const matchesProjectQuery = (project: SerializedProject, query: string): boolean => {
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

const tagKey = (tag: string) => tag.trim().toLowerCase();

// Unique tags across projects (case-insensitive), with project counts, most common first
export const collectTags = (projects: SerializedProject[]): { key: string; label: string; count: number }[] => {
	const map = new Map<string, { key: string; label: string; count: number }>();
	for (const p of projects) {
		const tags = p.data.tags || [];
		for (const key of new Set(tags.map(tagKey))) {
			const entry = map.get(key) ?? { key, label: tags.find((t) => tagKey(t) === key)!, count: 0 };
			entry.count++;
			map.set(key, entry);
		}
	}
	return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
};

export const hasTag = (project: SerializedProject, key: string): boolean =>
	!key || (project.data.tags || []).some((t) => tagKey(t) === key);

function ProjectCard(props: {
	project: SerializedProject;
	category: 'professional' | 'fun';
	categoryLabel: string;
	labelClass: string;
}) {
	const project = props.project;
	return (
		<a
			href={`/portfolio/${project.id}`}
			class="project-card group bg-black p-6 md:p-8 flex flex-col justify-between no-underline min-h-[300px] border border-border hover:border-accent transition-all duration-150 relative z-0 hover:z-10"
			data-category={props.category}
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
				<div class={`font-mono text-[0.7rem] uppercase tracking-[1px] mb-2 ${props.labelClass}`}>
					{props.categoryLabel}
				</div>
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
			</div>
		</a>
	);
}

function ProjectSection(props: {
	id: string;
	category: 'professional' | 'fun';
	marginTopClass: string;
	accentBorderClass: string;
	heading: string;
	badgeClass: string;
	badgeId: string;
	categoryLabel: string;
	labelClass: string;
	projects: SerializedProject[];
}) {
	return (
		<Show when={props.projects.length > 0}>
			<section class="project-section w-full bg-black" id={props.id} data-section-category={props.category}>
				<div
					class={`w-full bg-bg-subtle border-t border-b border-border border-x-[3px] ${props.accentBorderClass} py-3.5 px-4 md:px-6 flex items-center justify-between ${props.marginTopClass} font-mono`}
				>
					<h2 class="text-sm md:text-base uppercase tracking-[2px] text-text-primary font-bold m-0 flex items-center gap-3">
						<span>{props.heading}</span>
					</h2>
					<span class={`text-xs tracking-[1px] font-semibold border py-1 px-2.5 rounded-xs ${props.badgeClass}`} id={props.badgeId}>
						[{props.projects.length} PROJECT{props.projects.length === 1 ? '' : 'S'}]
					</span>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full bg-black overflow-hidden">
					<For each={props.projects}>
						{(project) => (
							<ProjectCard
								project={project}
								category={props.category}
								categoryLabel={props.categoryLabel}
								labelClass={props.labelClass}
							/>
						)}
					</For>
				</div>
			</section>
		</Show>
	);
}

export default function ProjectCatalog(props: ProjectCatalogProps) {
	const [searchQuery, setSearchQuery] = createSignal('');
	const [activeTag, setActiveTag] = createSignal('');
	let searchInputRef: HTMLInputElement | undefined;

	// Synchronize state with URL query parameters
	const syncUrl = (tag: string, q: string) => {
		if (typeof window === 'undefined') return;
		const params = new URLSearchParams(window.location.search);
		if (tag) {
			params.set('tag', tag);
		} else {
			params.delete('tag');
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
		const initialTag = params.get('tag');
		const initialQ = params.get('q');

		if (initialTag) {
			setActiveTag(tagKey(initialTag));
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
			setActiveTag(tagKey(p.get('tag') || ''));
			setSearchQuery(p.get('q') || '');
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('popstate', handlePopState);

		onCleanup(() => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('popstate', handlePopState);
		});
	});

	const handleTagChange = (key: string) => {
		setActiveTag(key);
		syncUrl(key, searchQuery());
	};

	const handleSearchInput = (value: string) => {
		setSearchQuery(value);
		syncUrl(activeTag(), value);
	};

	const clearSearch = () => {
		setSearchQuery('');
		syncUrl(activeTag(), '');
		searchInputRef?.focus();
	};

	// Projects matching the search query (independent of the active tag, so tag counts stay stable)
	const matchingQuery = createMemo(() =>
		props.projects.filter((p) => matchesProjectQuery(p, searchQuery()))
	);
	const tags = createMemo(() => collectTags(matchingQuery()));
	const tagFiltered = createMemo(() => matchingQuery().filter((p) => hasTag(p, activeTag())));
	const professionalFiltered = createMemo(() =>
		tagFiltered().filter((p) => p.data.category === 'professional')
	);
	const funFiltered = createMemo(() => tagFiltered().filter((p) => p.data.category === 'fun'));
	const countTotal = () => tagFiltered().length;

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
							onClick={() => handleTagChange('')}
							class={`filter-btn bg-bg-subtle text-text-secondary border rounded-xs py-1.5 px-3.5 font-mono text-xs font-semibold uppercase tracking-[0.5px] cursor-pointer hover:border-accent hover:text-white transition-all duration-150 ${
								!activeTag() ? 'active text-white border-accent bg-accent/20 font-bold' : 'border-border-light'
							}`}
						>
							All [{matchingQuery().length}]
						</button>
						<For each={tags()}>
							{(t) => (
								<button
									type="button"
									onClick={() => handleTagChange(t.key)}
									class={`filter-btn bg-bg-subtle text-text-secondary border rounded-xs py-1.5 px-3.5 font-mono text-xs font-semibold uppercase tracking-[0.5px] cursor-pointer hover:border-accent hover:text-white transition-all duration-150 ${
										activeTag() === t.key
											? 'active text-white border-accent bg-accent/20 font-bold'
											: 'border-border-light'
									}`}
								>
									{t.label} [{t.count}]
								</button>
							)}
						</For>
					</div>
				</div>
			</div>

			{/* SECTION 01: PROFESSIONAL WORK (Restyled banner + 3-column responsive grid) */}
			<ProjectSection
				id="section-professional"
				category="professional"
				marginTopClass="mt-10"
				accentBorderClass="border-x-accent"
				heading="PROFESSIONAL WORK"
				badgeClass="text-accent bg-accent/10 border-accent/30"
				badgeId="count-professional"
				categoryLabel="[PROFESSIONAL]"
				labelClass="text-accent"
				projects={professionalFiltered()}
			/>

			{/* SECTION 02: EXPERIMENTS & FOR FUN (Restyled banner + 3-column responsive grid) */}
			<ProjectSection
				id="section-fun"
				category="fun"
				marginTopClass="mt-12"
				accentBorderClass="border-x-border-light"
				heading="EXPERIMENTS & FOR FUN"
				badgeClass="text-text-secondary bg-bg border-border-light"
				badgeId="count-fun"
				categoryLabel="[FOR FUN]"
				labelClass="text-text-muted"
				projects={funFiltered()}
			/>

			{/* Empty State */}
			<Show when={countTotal() === 0}>
				<div class="py-16 px-6 text-center font-mono text-text-muted text-sm border-b border-dashed border-border w-full">
					No projects found matching the query "{searchQuery()}".
				</div>
			</Show>
		</div>
	);
}
