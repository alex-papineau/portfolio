document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('portfolio-search') as HTMLInputElement | null;
    const projectCards = document.querySelectorAll('.project-card');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase();

        projectCards.forEach((card) => {
            const htmlCard = card as HTMLElement;
            const titleData = htmlCard.getAttribute('data-title') || '';
            const textContent = htmlCard.textContent?.toLowerCase() || '';

            if (titleData.includes(query) || textContent.includes(query)) {
                htmlCard.classList.remove('hidden');
            } else {
                htmlCard.classList.add('hidden');
            }
        });
    });
});
