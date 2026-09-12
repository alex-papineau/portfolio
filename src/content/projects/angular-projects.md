---
title: "Angular Projects"
description: "A hub of 12 interactive single-page mini applications built with Angular exploring state management, reactive patterns, and UI components."
category: "fun"
tags: ["Angular", "TypeScript", "SPA", "Frontend"]
link: "https://angular.alexpapineau.com"
github: "https://github.com/alex-papineau/angular-stuff"
showcase:
  type: "live-preview"
  url: "https://angular.alexpapineau.com"
  caption: "Live interactive Angular applications hub"
---

# Angular Projects

A collection of 12 small single-page applications built to explore Angular's component architecture, reactive data flows, and standalone components.

## Included Mini Apps

### Utilities & Tools
- **Live Search**: Instant text filtering using RxJS observables with debouncing.
- **Notes App**: Quick notepad with localStorage persistence, tags, and inline editing.
- **Password Generator**: Custom password generator with length, character sets, and a strength meter.
- **World Clock**: Live digital clock displaying multiple time zones simultaneously.
- **Stopwatch**: Precision lap timer with start, stop, reset, and lap record history.

### Data & State
- **Mini Cart**: Client-side shopping cart with reactive state, quantity toggles, and price calculations.
- **GitHub User Search**: Fetches profile stats, repos, and activity using the GitHub REST API.
- **Voting App**: Live poll interface calculating vote shares and percentages in real time.
- **Registration Form**: Multi-step reactive form with custom validation rules and error feedback.

### Interactive UI
- **Chat UI**: Simulated messenger with message threads, chat bubbles, and timestamps.
- **Traffic Signal**: State-driven traffic light cycling through phases with customizable delays.
- **Quiz App**: Multiple-choice trivia game that tallies your score and reviews your answers.

## Architecture Highlights

### 1. Standalone Components
Every mini-app is its own independent standalone Angular component with scoped templates and styles. A lightweight parent shell and router handle switching between all 12 apps without full page reloads.

### 2. Reactive Streams with RxJS
Search input runs through `debounceTime`, `distinctUntilChanged`, and `switchMap` to keep API and filter queries responsive. Templates subscribe directly to data streams with async pipes, which clean up automatically and avoid memory leaks.

### 3. Signals & Forms
Modern signals and store patterns drive cart updates and poll tallies. Form validation goes through `FormGroup` and `FormControl`, with custom regular expressions for clear user feedback.
