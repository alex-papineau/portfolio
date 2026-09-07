import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const projectsDir = path.join(rootDir, 'src', 'content', 'projects');
const thumbnailsDir = path.join(rootDir, 'public', 'thumbnails');

if (!fs.existsSync(thumbnailsDir)) {
	fs.mkdirSync(thumbnailsDir, { recursive: true });
}

function parseMarkdownFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};
	const yamlText = match[1];
	const data = {};

	for (const line of yamlText.split('\n')) {
		const colonIdx = line.indexOf(':');
		if (colonIdx === -1) continue;
		const key = line.slice(0, colonIdx).trim();
		let val = line.slice(colonIdx + 1).trim();
		if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
			val = val.slice(1, -1);
		}
		data[key] = val;
	}
	return data;
}

async function fetchThumbnail(url, targetPath) {
	// Request 1920x1080 desktop capture with deviceScaleFactor=1, with brief delay for client-side rendering
	const primaryUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1920&viewport.height=1080&viewport.deviceScaleFactor=1&waitForTimeout=1000`;
	const fallbackUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1920&viewport.height=1080&viewport.deviceScaleFactor=1`;
	console.log(`Capturing 1920x1080 snapshot for ${url}...`);

	for (const serviceUrl of [primaryUrl, fallbackUrl]) {
		try {
			const res = await fetch(serviceUrl);

			if (!res.ok) {
				console.warn(`Snapshot service responded with status ${res.status} for ${url}, trying fallback...`);
				continue;
			}

			const data = await res.json();
			const imageUrl = data.data?.screenshot?.url;
			if (!imageUrl) {
				console.warn(`No screenshot URL returned for ${url}`);
				continue;
			}

			// Optimize down to lightweight WebP (720x405, quality 80) for superior performance
			const optimizedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&w=720&h=405&fit=cover&output=webp&q=80`;
			const imgRes = await fetch(optimizedUrl);
			if (!imgRes.ok) {
				console.warn(`Failed to download optimized WebP for ${url}: status ${imgRes.status}`);
				continue;
			}

			const buffer = Buffer.from(await imgRes.arrayBuffer());
			fs.writeFileSync(targetPath, buffer);
			console.log(`Saved optimized WebP (${(buffer.length / 1024).toFixed(1)} KB) to ${path.relative(rootDir, targetPath)}`);
			return true;
		} catch (err) {
			console.warn(`Error capturing thumbnail for ${url}:`, err.message);
		}
	}
	return false;
}

async function main() {
	const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
	console.log(`Processing ${files.length} project files...`);

	for (const file of files) {
		const slug = file.replace(/\.(md|mdx)$/, '');
		const content = fs.readFileSync(path.join(projectsDir, file), 'utf-8');
		const frontmatter = parseMarkdownFrontmatter(content);

		const url = frontmatter.link || frontmatter.url;
		const targetPath = path.join(thumbnailsDir, `${slug}.webp`);

		if (url && url.startsWith('http')) {
			await fetchThumbnail(url, targetPath);
		} else {
			console.log(`Skipping ${slug}: No external web link found.`);
		}
	}

	console.log('Thumbnail generation complete.');
}

main();
