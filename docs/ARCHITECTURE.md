# Architecture

## Overview

Three independent pieces, each with one job:

1. **Content script** (`src/content/`) — runs on youtube.com, injects hover buttons + status borders directly into the page
2. **Sidebar app** (`src/sidebar/`) — a React app rendered inside an iframe, injected by the content script, shows dashboard/library/stats
3. **Background service worker** (`src/background/`) — handles the toggle-sidebar message and any future cross-tab logic

These build separately and produce separate output files. **The manifest.json filenames and the vite `entryFileNames` must always match exactly** — see the build config section below. This was the root cause of the last sidebar-not-rendering bug: manifest and inject.js referenced `mainNEWTEST.js` / `4rthcontent.js`, but the vite configs built `main.js` / `content.js`. Never fix a mismatch by renaming the built file — fix it in the vite config so every build is correct automatically.

## Storage layer

- **PouchDB** is the only store. One doc per video, keyed `video_<videoId>`, with a `type` field (`watched` / `important` / `toWatch`).
- No separate "chrome.storage for IDs" + "PouchDB for metadata" split — that was two sources of truth for the same thing and a source of sync bugs. One store, one shape (see PRD data model).
- If the DB is deleted, nothing breaks — badges/counts just show empty. Metadata isn't re-derivable from YouTube alone (title/channel require oEmbed), so **this store IS the source of truth**, not a cache. Back it up (Settings → Export) before clearing browser data.

## Content script: two responsibilities, two functions

Per the selector-map design (see `SELECTOR_MAP.md`):

```
observer (MutationObserver, debounced ~300ms, or yt-navigate-finish)
    → safeUpdateUI()
        → updateBorders()     // strict, per-page-type selectors only
        → addFeedButtons()    // anchor-based, independent of border logic
```

Rules:
- `updateBorders()` never climbs the DOM or falls back to a "closest guess" parent — every page type has exactly one documented correct container (`SELECTOR_MAP.md`). If a selector returns zero matches where videos are expected, log it — don't silently do nothing or guess.
- Elements the script touches get `data-mt-owned="true"`. `clearInjectedVideoUI()` removes anything with that attribute before re-running, so stale UI never survives a re-render.
- Border logic and button logic are fully independent — a bug in one never breaks the other.

## Sidebar injection

The content script creates a fixed-position host div + iframe, writes a minimal HTML shell into it, and loads the built sidebar bundle via `chrome.runtime.getURL(...)`. The exact filename it requests **must** match what `vite.config.sidebar.js` actually outputs — see README's "one rule that matters."

## oEmbed + DOM fallback

Metadata (title/channel/thumbnail) is fetched via YouTube's oEmbed endpoint first (works even if DOM selectors break). If that fails, fall back to scraping the DOM element that triggered the tag action. This means metadata survives YouTube layout changes even when border/button injection temporarily doesn't.
