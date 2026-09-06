import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const thumbnailsDir = 'public/thumbnails';
const files = fs.readdirSync(thumbnailsDir).filter((f) => f.endsWith('.webp'));

console.log(`Optimizing ${files.length} thumbnails...`);

let totalOriginal = 0;
let totalOptimized = 0;

for (const f of files) {
	const filePath = path.join(thumbnailsDir, f);
	const inputBuffer = fs.readFileSync(filePath);
	totalOriginal += inputBuffer.length;

	const metadata = await sharp(inputBuffer).metadata();
	const originalSizeKb = (inputBuffer.length / 1024).toFixed(1);

	const outputBuffer = await sharp(inputBuffer)
		.resize({ width: 720, height: 405, fit: 'cover' })
		.webp({ quality: 80, effort: 6 })
		.toBuffer();

	totalOptimized += outputBuffer.length;
	const newSizeKb = (outputBuffer.length / 1024).toFixed(1);
	const percentSaved = (((inputBuffer.length - outputBuffer.length) / inputBuffer.length) * 100).toFixed(1);

	fs.writeFileSync(filePath, outputBuffer);

	console.log(`- ${f}: ${metadata.width}x${metadata.height} (${originalSizeKb} KB) -> 720x405 (${newSizeKb} KB) [-${percentSaved}%]`);
}

console.log(`\nTotal thumbnail bytes: ${(totalOriginal / 1024).toFixed(1)} KB -> ${(totalOptimized / 1024).toFixed(1)} KB (Saved ${(((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)}%)`);

// Also optimize favicon
const faviconExtracted = 'public/favicon-extracted.png';
if (fs.existsSync(faviconExtracted)) {
	const favInput = fs.readFileSync(faviconExtracted);
	const favWebp = await sharp(favInput)
		.resize({ width: 256, height: 256, fit: 'cover' })
		.webp({ quality: 85, effort: 6 })
		.toBuffer();

	const base64Favicon = favWebp.toString('base64');
	const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256" width="100%" height="100%">
  <image width="256" height="256" xlink:href="data:image/webp;base64,${base64Favicon}"/>
</svg>
`;

	fs.writeFileSync('public/favicon.svg', svgContent);
	console.log(`Favicon optimized: ${(favInput.length / 1024).toFixed(1)} KB -> ${(svgContent.length / 1024).toFixed(1)} KB`);

	// Remove temporary extracted file
	fs.unlinkSync(faviconExtracted);
}
