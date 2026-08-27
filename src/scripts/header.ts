function setupHamburger() {
	const btn = document.getElementById('hamburger-menu');
	const navLinks = document.getElementById('internal-links');
	
	if (!btn || !navLinks) return;

	// Check if listener is already attached
	if (btn.dataset.initialized === 'true') return;
	btn.dataset.initialized = 'true';

	btn.addEventListener('click', () => {
		const isExpanded = navLinks.classList.toggle('hidden-mobile');
		btn.setAttribute('aria-expanded', String(!isExpanded));
	});
}

document.addEventListener('astro:page-load', setupHamburger);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
	setupHamburger();
} else {
	document.addEventListener('DOMContentLoaded', setupHamburger);
}
