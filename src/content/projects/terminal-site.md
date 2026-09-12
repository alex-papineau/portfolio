---
title: "Terminal Site"
description: "Interactive Unix-style web terminal built on jQuery Terminal, with live weather, jokes, and GitHub stats."
category: "fun"
tags: ["JavaScript", "Vite", "jQuery Terminal", "Cloudflare Pages"]
link: "https://terminal.alexpapineau.com"
github: "https://github.com/alex-papineau/terminal-site"
showcase:
  type: "live-preview"
  url: "https://terminal.alexpapineau.com"
  caption: "Interactive Terminal Interface"
---

# Terminal Site

A personal website built as a terminal, powered by [jquery.terminal](https://terminal.jcubic.pl/) on a Vite frontend. Black background, white text, a purple accent on the prompt, cursor, and links, monospace font, and a CRT scanline effect on by default. Every output types out character by character, including the boot banner.

## Commands

**Utility**: `clear`, `crt on|off`, `theme <name|#hex>` (purple, green, blue, red, amber, pink, cyan, or any hex), `time`, `history`, `help`

**Just for fun**: `hello <name>`, `profilepicture` (ASCII version of my profile picture), `cowsay <text>`, `joke` (live from icanhazdadjoke.com), `guess` (number-guessing game)

**Links and meta**: `email`, `sourcecode`, `github` (live public stats), `weather <city>` (live from wttr.in), `whoami` (your IP, rough location, and which Cloudflare datacenter served the request), `banner`, `explain <command>` (technical explanation of how a command is implemented)

## How It Works

### Frontend & rendering
jQuery Terminal handles the command line UI, history, and input directly, rather than a hand-rolled parser. All output, including the boot banner and multi-line `help` text, prints character by character (`src/typewriter.js`), and the prompt stays hidden while a command is still printing. User-supplied arguments and text fetched from external APIs run through `escapeText()` before being echoed, which neutralizes jquery.terminal's `[[...]]` formatting syntax so nothing typed or fetched can inject markup.

### Live data via Cloudflare Pages Functions
`functions/api/joke.js`, `functions/api/weather.js`, and `functions/api/whoami.js` back the `joke`, `weather`, and `whoami` commands, picked up automatically by Cloudflare Pages from the `functions/` directory. Use `npm run pages:dev` (not plain `npm run dev`) to test these locally, since Vite alone doesn't serve `/api/*` routes.

### Persistence
Theme choice and CRT toggle are remembered across visits.
