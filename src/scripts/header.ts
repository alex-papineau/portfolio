function setupHamburger() {
	const btn = document.getElementById('hamburger-menu');
	const navLinks = document.getElementById('internal-links');
	
	if (!btn || !navLinks) return;

	// Check if listener is already attached
	if (btn.dataset.initialized === 'true') return;
	btn.dataset.initialized = 'true';

	btn.addEventListener('click', () => {
		const isHidden = navLinks.classList.toggle('hidden');
		btn.setAttribute('aria-expanded', String(!isHidden));
	});
}

document.addEventListener('astro:page-load', setupHamburger);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
	setupHamburger();
} else {
	document.addEventListener('DOMContentLoaded', setupHamburger);
}
