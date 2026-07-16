# Site Audit

Date: 2026-07-16

## Summary

The current workspace was not a Git repository at the start of the audit. A baseline commit was created before migration work:

- `9da6f79 chore: save pre-migration baseline`

The existing site is a static party-game site, not a scary-story or kaidan library. The visible Japanese copy is mojibake in the root page and related scripts, which makes the current content unsuitable for preservation as public editorial content. The useful design cues are limited to the dark palette, lantern motif, and mobile-first game-like UI energy.

## Current Technical Structure

- Static HTML, CSS, and JavaScript only.
- Root files:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `codex-nomikai-arcade.html`
  - `claude-implementation-prompt.md`
- Secondary static app:
  - `nonal-game-app/index.html`
  - `nonal-game-app/styles.css`
  - `nonal-game-app/app.js`
- No `package.json`.
- No framework, build step, content pipeline, sitemap, RSS generation, or automated tests.
- No `.github` workflow.
- No `.openai/hosting.json`.

## Startup Check

The existing static site was served locally with Python's simple HTTP server and returned:

- `HTTP 200`
- `Content-Type: text/html`
- `index.html` length: `2262`

The site can be served as static files, but the page content is not editorially usable because of mojibake.

## HTML, CSS, and JavaScript Structure

- HTML is hand-written and tightly coupled to specific game UIs.
- CSS is global and page-specific, with no reusable content or layout system for articles.
- JavaScript renders most interactive content from in-file arrays.
- Existing `localStorage` use is limited to game/player state.
- There is no separation between data, presentation, routing, and editorial metadata.
- Root `app.js` is large for a static script and mixes data, rendering, timers, canvas handling, and game state.

## Page Count

Current public pages:

- `/`
- `/codex-nomikai-arcade.html`
- `/nonal-game-app/`

This does not match the requested kaidan-library structure.

## Content Storage Format

- Existing content is embedded directly in JavaScript arrays and HTML.
- There is no article format, frontmatter, Markdown/MDX, content validation, or source metadata.
- The current structure will not scale to hundreds of stories.

## Responsive Support

- Existing CSS contains mobile breakpoints.
- `viewport` is present, but root pages use `maximum-scale=1` and `user-scalable=no`, which harms accessibility.
- The current design is optimized for game panels, not long-form reading.

## SEO Settings

Missing or insufficient:

- Unique meta descriptions
- Canonical URLs
- OGP metadata
- X/Twitter card metadata
- Structured data
- Sitemap
- RSS
- Robots file
- Breadcrumbs
- Article dates
- Author/editor display
- Category descriptions

## Images and Fonts

- Google Fonts are loaded externally:
  - `RocknRoll One`
  - `Zen Maru Gothic`
- There are no editorial images or optimized image assets.
- The kaidan site should minimize font loading and use readable Japanese system fonts for body text.

## Duplicate Code

- Root and `nonal-game-app` share similar design patterns, icon buttons, lantern rows, panels, and localStorage handling.
- No component system exists, so shared UI would become hard to maintain if more pages were added.

## Link Check

Static link scan found:

- Root page links to `./codex-nomikai-arcade.html`
- Root page links to `./nonal-game-app/index.html`
- Styles/scripts are local and present.
- Google Fonts are external.

No missing static file was found in the initial link list, but no automated full-site link checker exists.

## Unused or Out-of-Scope Files

For the requested kaidan-library product, all existing game files are out of scope:

- `app.js`
- `styles.css`
- `codex-nomikai-arcade.html`
- `nonal-game-app/*`

They are preserved in the baseline commit. They should not be carried into the new public site unless a legacy archive is intentionally created.

## GitHub Pages and Publishing

- No GitHub Pages configuration exists.
- No GitHub Actions workflow exists.
- No base-path strategy exists.
- No `README.md` exists for operation.

## Existing Design Elements Worth Preserving

- Dark background suitable for night reading.
- Lantern-inspired accent idea.
- Compact mobile UI density.
- Reduced-motion media query pattern.

These should be adapted into a calmer "Japanese kaidan plus digital archive" style, with better readability and accessibility.

## Risks When Article Count Grows

The existing site would break down because:

- Stories cannot be added as independent files.
- No metadata schema exists for filtering, SEO, review status, source type, or copyright.
- No generated category, tag, series, random, search, sitemap, or RSS pages exist.
- No validation prevents duplicate titles/slugs or missing fields.
- No search index exists.
- No tests or automated build protect future changes.
- Long-form reading settings, favorites, and history are absent.

## Migration Recommendation

Move to:

- Astro
- TypeScript
- Astro Content Collections
- Markdown stories
- Static HTML generation
- Pagefind-compatible static search output
- Browser-only `localStorage` for favorites, history, and reading settings
- GitHub Actions for lint, content check, test, and build
- GitHub Pages-compatible output

Reason: the current single-purpose static app cannot support the requested searchable, classified, long-term story database without becoming unmaintainable.
