# Selector Map

**This is the single source of truth for where MarkTube injects UI on each YouTube page type.** Update this file the moment you find a broken or changed selector — code changes should follow this doc, not the other way around.

Core principle: **don't detect containers, know them.** YouTube doesn't have one consistent card structure — it has several UI ecosystems (home feed, watch page, playlists, channel pages, search) that each need their own documented selector. Never fall back to `el.closest(...)` chains or "climb until something looks right" — that's what caused the giant-border bug on channel pages (accidentally styling `ytd-shelf-renderer`, a wrapper, instead of the video card itself).

## Border system (visual — shows watched/important/toWatch state)

| Page | Selector | Notes |
|---|---|---|
| Home feed | `ytd-rich-item-renderer #content` | |
| Watch page — right sidebar | `.yt-lockup-view-model--horizontal` | |
| Watch page — playlist queue | `ytd-playlist-panel-video-renderer` | |
| Playlist page | `ytd-playlist-video-renderer` | |
| History | `.yt-lockup-view-model--horizontal` | |
| Channel home (`/@user`) | `ytd-grid-video-renderer` | ⚠️ NOT `ytd-shelf-renderer` — that's the shelf wrapper, not the card |
| Channel videos (`/@user/videos`) | `ytd-rich-item-renderer #content` | |
| Search | `ytd-video-renderer` | |

## Button system (interaction — hover buttons, click handling)

Independent of the border system. Anchor-based: scans for `a#thumbnail, a[href*="/watch"]` and injects a button container as a sibling, not inside the anchor.

## When a selector breaks

1. Don't add a fallback chain. Find the new correct selector for that specific page type and update the table above.
2. Log a warning (page type + selector + zero-match) rather than failing silently — this is what turns "extension mysteriously broke" into "selector X broke on page Y, here's when."
3. SPA navigation fires the URL change *before* the DOM updates. Don't react to the URL change instantly — debounce ~300ms, or better, listen for YouTube's `yt-navigate-finish` event if reliable, before running `updateBorders()`.

## Cleanup contract

Every element MarkTube modifies gets `data-mt-owned="true"`. `clearInjectedVideoUI()` must run and remove everything with that attribute before any re-render — never leave stale borders/buttons behind after a page/selector change.
