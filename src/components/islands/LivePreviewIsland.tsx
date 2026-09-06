import { createSignal, Show } from 'solid-js';

interface LivePreviewIslandProps {
	url?: string;
	previewImage?: string;
	title: string;
	aspectRatio?: string;
	caption?: string;
}

export default function LivePreviewIsland(props: LivePreviewIslandProps) {
	const [isLaunched, setIsLaunched] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(true);
	const [isBlocked, setIsBlocked] = createSignal(false);
	let iframeRef: HTMLIFrameElement | undefined;

	const displayUrl = () =>
		props.url ? props.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'preview.local';

	const handleLaunch = () => {
		// Disable sandboxed interactive frame on screens narrower than 1280px (mobile/tablet/small laptop)
		if (typeof window !== 'undefined' && window.innerWidth < 1280 && props.url) {
			window.open(props.url, '_blank', 'noopener,noreferrer');
			return;
		}
		setIsLaunched(true);
		setIsLoading(true);
		setIsBlocked(false);
	};

	return (
		<div class="live-preview-container mb-12 w-[calc(100vw-2rem)] max-w-[1200px] relative left-1/2 -translate-x-1/2 rounded-xs border border-border bg-[#0c0c12] overflow-hidden shadow-2xl">
			{/* Top Bar with URL */}
			<div class="flex items-center justify-between px-3 md:px-4 py-2.5 bg-[#141320] border-b border-border font-mono text-xs text-text-secondary select-none">
				{/* Address Bar */}
				<div class="flex items-center gap-1.5 px-3 py-1 bg-[#090812] border border-border rounded-xs text-text-muted text-[11px] max-w-[280px] sm:max-w-[360px] truncate">
					<span class="text-text-secondary truncate">{displayUrl()}</span>
				</div>
			</div>

			{/* Screen Area */}
			<div
				class="relative w-full overflow-hidden bg-bg-subtle"
				style={{
					'aspect-ratio': props.aspectRatio || '16/9',
					'min-height': '520px',
					'max-height': '780px',
				}}
			>
				{/* Poster State */}
				<Show when={!isLaunched()}>
					<div class="preview-poster absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 z-10 transition-opacity duration-300">
						{props.previewImage && (
							<img
								src={props.previewImage}
								alt={`${props.title} live preview`}
								class="w-full h-full object-contain"
								loading="lazy"
							/>
						)}

						{props.url && (
							<div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4">
								<button
									type="button"
									onClick={handleLaunch}
									class="btn-launch-embed inline-flex items-center gap-2 py-2.5 px-5 border border-border-light bg-bg-subtle text-text-primary font-mono text-xs font-semibold uppercase tracking-[0.5px] rounded-xs cursor-pointer hover:border-accent hover:text-white transition-all duration-150 shadow-lg active:scale-95"
								>
									<span class="hidden md:inline">Launch Interactive Preview</span>
									<span class="inline md:hidden">Open Live Demo</span>
								</button>
								<p class="font-mono text-[11px] text-text-secondary text-center max-w-[340px]">
									<span class="hidden md:inline">Loads sandboxed interactive frame on-demand.</span>
									<span class="inline md:hidden">Interactive frame disabled on mobile for performance. Opens in new tab.</span>
								</p>
							</div>
						)}
					</div>
				</Show>

				{/* Dynamic Iframe Container */}
				<Show when={isLaunched()}>
					<div class="iframe-container absolute inset-0 w-full h-full">
						<Show when={isLoading()}>
							<div class="loading-indicator absolute inset-0 flex items-center justify-center bg-[#090812] text-white font-mono text-xs font-bold tracking-[1px] z-20">
								[ CONNECTING TO LIVE DEMO... ]
							</div>
						</Show>

						<Show when={isBlocked()}>
							<div class="blocked-fallback absolute inset-0 flex flex-col items-center justify-center bg-[#090812] text-text-secondary font-mono text-xs p-6 text-center gap-3 z-30">
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
								ref={iframeRef}
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

			{props.caption && (
				<div class="px-4 py-2 border-t border-border bg-[#0a0914] font-mono text-xs text-text-muted text-center">
					{props.caption}
				</div>
			)}
		</div>
	);
}
