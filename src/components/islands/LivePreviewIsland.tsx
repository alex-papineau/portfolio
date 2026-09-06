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
