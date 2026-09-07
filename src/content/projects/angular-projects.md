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

A collection of 12 interactive single-page mini applications built with Angular to explore modern component architecture, reactive data flows, and standalone components.

## Included Mini Applications

### 🛠️ Utilities & Interactive Tools
- **Live Search**: Instant keyword filtering with reactive observables and debounced queries.
- **Notes App**: Dynamic notepad with local persistence, tagging, and inline editing.
- **Password Generator**: Configurable generator supporting custom length, special characters, numbers, and strength indicators.
- **Digital World Clock**: Multi-timezone world clock featuring live updating visual displays.
- **Stopwatch**: High-precision lap timer with pause, reset, and lap record tracking.

### 📊 Data & State Management
- **Mini Cart System**: Client-side shopping cart with reactive state stores, quantity adjustments, and pricing calculations.
- **GitHub User Search UI**: Search interface fetching profile statistics, repositories, and activity metrics via the GitHub API.
- **Voting App**: Real-time poll dashboard tallying candidate votes with percentage distributions.
- **Registration Form**: Multi-step reactive form equipped with custom validators and error messaging.

### 🎮 Interactive UI & Sequencers
- **Realtime Chat UI**: Conversational chat interface simulating message threads, sender bubbles, and timestamps.
- **Traffic Signal**: Timed state sequencer cycling light phases with customizable delay intervals.
- **Quiz App**: Multiple-choice trivia challenge complete with score evaluation and review summaries.

## How It Works

### 1. Standalone Component Architecture
- **Isolated Modules**: Each mini-application is designed as an independent Angular standalone component containing its own encapsulated templates, styles, and logic.
- **Unified Shell Navigation**: A centralized routing system enables seamless tab and sidebar switching between the 12 mini-apps within a single lightweight SPA container.

### 2. Reactive Data Streams & RxJS Pipelines
- **Debounced Live Filtering**: Implements RxJS `debounceTime`, `distinctUntilChanged`, and `switchMap` operators for fluid, low-latency live search queries.
- **Asynchronous Data Feeds**: Uses asynchronous pipe subscriptions and HTTP client abstractions to interact with external APIs (e.g. GitHub REST API).

### 3. State Management & Form Validation
- **Signal & Store Patterns**: Manages reactive state updates for shopping cart inventories and voting poll tallies without redundant full-tree re-renders.
- **Strict Reactive Forms**: Validates user input synchronously and asynchronously using Angular `FormGroup`, `FormControl`, and custom regex-based validators.
