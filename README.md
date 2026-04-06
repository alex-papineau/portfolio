# Alex Papineau - Portfolio

Welcome to the personal portfolio of Alex Papineau. This site is built using [Astro](https://astro.build/) and is designed with a very specific, stylistic aesthetic.

## Theme & Aesthetic
The portfolio is designed with a **Dark Theme**, featuring a **Retro CRT / Hacker aesthetic**. 
Before visitors can see the actual content of the portfolio, they are greeted by an interactive **Password-Protected Gate**.
This gateway includes a stylized **ASCII art eye** that tracks user cursor movement and adds to the immersive, terminal-like experience.

## Tech Stack
- **Framework:** Astro
- **Styling:** Vanilla CSS, Tailwind CSS (V4)
- **Deployment:** Cloudflare Workers (Adapter included)
- **Language:** TypeScript & Markdown/MDX

## Scripts
- `npm run dev` - Starts the local development server at `localhost:4321`.
- `npm run build` - Builds the production site to `./dist/`.
- `npm run preview` - Previews the built site locally before deployment.
- `npm run deploy` - Deploys to Cloudflare Workers. 

## Project Structure
- `src/components/` - Contains UI components, including the custom `PasswordGate.astro`.
- `src/pages/` - Contains the routing pages like `index.astro` and `about.astro`.
- `src/styles/` - Global and component-specific CSS styling. 
- `src/scripts/` - Client-side scripts like the vanilla JS that powers the password gate ASCII eye.
- `src/content/` - Markdown content collections.

Enjoy the retro terminal vibes!
