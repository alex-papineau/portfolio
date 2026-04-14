function setupHamburger() {
	const btn = document.getElementById('hamburger-menu');
	const navLinks = document.getElementById('internal-links');
	if (btn && navLinks) {
		const newBtn = btn.cloneNode(true);
		btn.parentNode?.replaceChild(newBtn, btn);
		
		newBtn.addEventListener('click', () => {
			navLinks.classList.toggle('hidden-mobile');
		});
	}
}

document.addEventListener('astro:page-load', setupHamburger);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
	setTimeout(setupHamburger, 0);
} else {
	document.addEventListener('DOMContentLoaded', setupHamburger);
}
