const fs = require('fs');
const path = require('path');
const devDir = 'c:\\Dev';
const outDir = path.join(devDir, 'portfolio', 'src', 'pages', 'portfolio');

const dirs = fs.readdirSync(devDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'portfolio' && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);

dirs.push('portfolio'); // although rendering its own portfolio doesn't make much sense, they asked for "each item in the dev folder"

dirs.forEach(project => {
    const readmePath = path.join(devDir, project, 'README.md');
    let content = 'No specific content provided for this project.';
    let title = project.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    if (fs.existsSync(readmePath)) {
        content = fs.readFileSync(readmePath, 'utf8');
        // Simple markdown parsing to HTML if we strictly wanted it, but let's just dump it in a <pre> tag for safety or leave it as rendered markdown if there's a component. Wait, Astro supports markdown integration, but since this is an .astro file, we can just inject standard HTML.
        // Actually, Astro files let us import README.md. But since the READMEs are outside the src directory, we'd better read them and embed them safely or copy them.
        
        // Let's just escape the content and dump it into a pre tag for now, or just extract the first paragraph for the description.
        // Because injecting raw Markdown into an Astro file requires us to write it as Markdown or use a Markdown component.
    }
    
    const astroContent = `---
import BaseHead from '../../components/BaseHead.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';

import { SITE_TITLE } from '../../consts';

// Content for ${project}
---

<!doctype html>
<html lang="en">
	<head>
		<BaseHead title={\`${title} | \${SITE_TITLE}\`} description="Project page for ${project}" />
	</head>
	<body>

		<Header />
		<main>
			<h1>${title}</h1>
			<div class="project-content">
${content.split('\\n').map(line => \`				<p>\${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>\`).join('\\n')}
			</div>
			
			<hr />
			
			<a href="/">← Return to Home</a>

		</main>
		<Footer />
	</body>
</html>
`;

    // Only overwrite if not a special pre-existing page like index.astro or game-of-life.astro
    const outPath = path.join(outDir, `${project}.astro`);
    if (project !== 'lorem-ipsum' && project !== 'bulborb-net' && project !== 'game-of-life' && project !== 'map-stuff') {
    	fs.writeFileSync(outPath, astroContent);
    	console.log(\`Created \${outPath}\`);
    }

});
