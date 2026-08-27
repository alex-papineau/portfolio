import { dev } from 'astro';

async function main() {
    try {
        const server = await dev({
            root: '.',
            host: true,
        });
        console.log(`\n🚀 Astro Live Dev Server running on http://localhost:${server.address.port || 4321}/\n`);
    } catch (err) {
        console.error('Failed to start Astro dev server:', err);
        process.exit(1);
    }
}

main();
