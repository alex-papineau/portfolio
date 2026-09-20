---
title: "Terminal Site"
description: "Unix-style web terminal on jQuery Terminal with live weather, jokes, and GitHub stats."
category: "fun"
tags: ["JavaScript", "Cloudflare"]
link: "https://terminal.alexpapineau.com"
github: "https://github.com/alex-papineau/terminal-site"
showcase:
  type: "live-preview"
  url: "https://terminal.alexpapineau.com"
---

# Terminal Site

A personal website built as a terminal, powered by <a href="https://terminal.jcubic.pl/" target="_blank" rel="noopener noreferrer">jquery.terminal</a> on a Vite frontend.

## Commands

- Utility: `clear`, `crt on|off`, `theme <name|#hex>` (purple, green, blue, red, amber, pink, cyan, or any hex), `time`, `history`, `help`
- Just for fun: `hello <name>`, `profilepicture` (ASCII version of my profile picture), `cowsay <text>`, `joke` (live from icanhazdadjoke.com), `guess` (number-guessing game)
- Links and meta: `email`, `sourcecode`, `github` (live public stats), `weather <city>` (live from wttr.in), `whoami` (your IP, rough location, and which Cloudflare datacenter served the request), `banner`, `explain <command>` (technical explanation of how a command is implemented)

## How it works

### Frontend and rendering
jQuery Terminal handles the command line UI, history, and input directly, so there is no hand-rolled parser. All output, including the boot banner and multi-line `help` text, prints character by character (`src/typewriter.js`), and the prompt stays hidden while a command is still printing. `escapeText()` runs on user arguments and on text fetched from external APIs before it is echoed. It neutralizes jquery.terminal's `[[...]]` formatting syntax, so nothing typed or fetched can inject markup.

### Live data through Cloudflare Pages Functions
`functions/api/joke.js`, `functions/api/weather.js`, and `functions/api/whoami.js` back the `joke`, `weather`, and `whoami` commands. Cloudflare Pages picks them up automatically from the `functions/` directory. Test them locally with `npm run pages:dev`, not plain `npm run dev`, because Vite alone doesn't serve `/api/*` routes.

### Persistence
The theme choice and CRT toggle are remembered across visits.
