---
title: "Angular Projects"
description: "A hub of 12 interactive single-page mini applications built with Angular exploring state management, reactive patterns, and UI components."
category: "fun"
order: 6
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

### 🛠️ Utilities & Tools
- **Live Search**: Instant text filtering using RxJS observables with debouncing.
- **Notes App**: Quick notepad with localStorage persistence, tags, and inline editing.
- **Password Generator**: Custom password generator with length, character sets, and a strength meter.
- **World Clock**: Live digital clock displaying multiple time zones simultaneously.
- **Stopwatch**: Precision lap timer with start, stop, reset, and lap record history.

### 📊 Data & State
- **Mini Cart**: Client-side shopping cart with reactive state, quantity toggles, and price calculations.
- **GitHub User Search**: Fetches profile stats, repos, and activity using the GitHub REST API.
- **Voting App**: Live poll interface calculating vote shares and percentages in real time.
- **Registration Form**: Multi-step reactive form with custom validation rules and error feedback.

### 🎮 Interactive UI
- **Chat UI**: Simulated messenger with message threads, chat bubbles, and timestamps.
- **Traffic Signal**: State-driven traffic light cycling through phases with customizable delays.
- **Quiz App**: Multiple-choice trivia game that tallies your score and reviews your answers.

## Architecture Highlights

### 1. Standalone Components
- **Isolated Views**: Every mini-app is built as an independent standalone Angular component with scoped templates and styles.
- **App Shell Navigation**: A lightweight parent shell and router handle switching between all 12 apps smoothly without full page reloads.

### 2. Reactive Streams with RxJS
- **Debounced Search**: Uses `debounceTime`, `distinctUntilChanged`, and `switchMap` to keep API and filter queries snappy.
- **Async Pipes**: Subscribes directly to data streams in templates with automatic cleanup to prevent memory leaks.

### 3. Signals & Forms
- **Reactive State**: Uses modern signals and store patterns for snappy cart updates and polling tallies.
- **Reactive Forms**: Form validation handled through `FormGroup` and `FormControl` with custom regular expressions for clean user feedback.
