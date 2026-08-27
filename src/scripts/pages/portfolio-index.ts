function initPortfolioSearch() {
    const searchInput = document.getElementById('portfolio-search') as HTMLInputElement | null;
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll<HTMLElement>('.project-card');
    const noResults = document.getElementById('no-results');

    let currentCategory = 'all';
    let currentQuery = '';

    function updateVisibility() {
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const cardCategory = card.getAttribute('data-category') || '';
            const titleData = card.getAttribute('data-title') || '';
            const descData = card.getAttribute('data-description') || '';
            const tagsData = card.getAttribute('data-tags') || '';
            const textContent = card.textContent?.toLowerCase() || '';

            const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
            const matchesQuery = !currentQuery || 
                titleData.includes(currentQuery) || 
                descData.includes(currentQuery) || 
                tagsData.includes(currentQuery) || 
                textContent.includes(currentQuery);

            if (matchesCategory && matchesQuery) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentQuery = (e.target as HTMLInputElement).value.trim().toLowerCase();
            updateVisibility();
        });
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter') || 'all';
            updateVisibility();
        });
    });
}

document.addEventListener('astro:page-load', initPortfolioSearch);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initPortfolioSearch();
} else {
    document.addEventListener('DOMContentLoaded', initPortfolioSearch);
}
