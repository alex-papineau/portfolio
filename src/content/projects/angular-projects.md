---
title: "Angular Projects"
description: "12 small Angular apps: state management, reactive patterns, UI components."
category: "fun"
tags: ["TypeScript"]
link: "https://angular.alexpapineau.com"
github: "https://github.com/alex-papineau/angular-stuff"
showcase:
  type: "live-preview"
  url: "https://angular.alexpapineau.com"
---

# Angular Projects

A collection of 12 small single-page apps built to explore Angular's component architecture, reactive data flows, and standalone components.

## Architecture

### Standalone components
Each mini app is a standalone Angular component with its own templates and styles. A lightweight parent shell and router switch between all 12 without full page reloads.

### RxJS streams
Search input goes through `debounceTime`, `distinctUntilChanged`, and `switchMap` to keep API and filter queries responsive. Templates subscribe to streams with async pipes, which unsubscribe automatically and avoid memory leaks.

### Signals and forms
Signals and store patterns drive cart updates and poll tallies. Form validation uses `FormGroup` and `FormControl`, with custom regular expressions for user feedback.
