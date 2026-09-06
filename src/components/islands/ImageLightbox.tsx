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
