---
title: "Terminal Site"
description: "Interactive Unix-style terminal portfolio interface simulating command line navigation and utilities."
category: "fun"
tags: ["JavaScript", "Terminal UI", "Interactive"]
link: "https://terminalsite.alexpapineau.com"
github: "https://github.com/alex-papineau/terminal-site"
showcase:
  type: "live-preview"
  url: "https://terminalsite.alexpapineau.com"
  caption: "Interactive Terminal Interface"
---

# Terminal Site

An interactive Unix-style web terminal that turns a portfolio into a simulated command-line shell, complete with file navigation, command history, and custom themes.

## How It Works

### 1. Command Parser & Router
- **Tokenizer**: Parses input strings into command names, flags (like `-a` or `-l`), and arguments.
- **Command Router**: Maps inputs to built-in commands including `help`, `ls`, `cd`, `cat`, `clear`, `echo`, `whoami`, `contact`, `theme`, and `repo`.
- **Friendly Errors**: Outputs standard Unix-style error messages when commands, arguments, or file paths aren't found.

### 2. In-Memory Virtual Filesystem
- **Directory Tree**: Represents directories, text documents, and symlinks in memory using a recursive JSON structure.
- **Path Traversal**: Supports relative paths (`.`, `..`), absolute paths (`/`), and prints the active directory with `pwd`.

### 3. Shell UX & Theming
- **Command History**: Pressing the Up/Down arrow keys steps through past commands just like a real terminal.
- **Tab Autocomplete**: Auto-completes command names and directory paths on `Tab`.
- **Custom Color Themes**: Switch between classic CRT amber, matrix green, clean monochrome, and dark terminal palettes on the fly.
