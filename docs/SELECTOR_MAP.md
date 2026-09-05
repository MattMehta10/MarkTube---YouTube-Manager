# Selector Map

**This is the single source of truth for where MarkTube injects UI on each YouTube page type.** Update this file the moment you find a broken or changed selector — code changes should follow this doc, not the other way around.

## Core Principles

1. **Don't detect wrappers, know video cards.** YouTube uses shelf containers (`ytd-shelf-renderer`, `ytd-reel-shelf-renderer`, `ytd-rich-shelf-renderer`) for grouped sections (e.g. "Latest from...", "People also watched"). **Never apply borders or buttons to `ytd-shelf-renderer` wrappers** — only style the individual `ytd-video-renderer` or `ytd-rich-item-renderer` cards inside them.
2. **Prevent Layout Shift**: On grid layouts (like Homefeed), apply borders to the inner `#content` container (`ytd-rich-item-renderer #content`), NOT the outer grid cell host (`ytd-rich-item-renderer`).
3. **Filter Out Ad Cards**: Always check `!el.querySelector('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer')`. Ad slots exist as *children* inside item renderers.
4. **Never rely on `div#dismissible`**: `div#dismissible` is present on both individual video cards AND full shelf wrappers. Avoid `div#dismissible` in query selectors.

## Selector Reference Table

| Page | Path / Context | Border Selector | Hover Selector | Special Rules / Notes |
|---|---|---|---|---|
| **Home & Explore feeds** | `/`, `/feed/you`, `/feed/subscriptions`, `/feed/gaming`, etc. | `ytd-rich-item-renderer #content` | `ytd-rich-item-renderer` | Border on `#content`. Skip ad slots (`ytd-ad-slot-renderer`) & playlist collection cards (`CollectionStack`). |
| **Playlists feed & /feed/you** | `/feed/playlists`, `/feed/you` | **NONE** (Excluded) | **NONE** (Excluded) | ⛔ Exclude video borders/buttons on playlist collection cards (`yt-collection-thumbnail-view-model` / `CollectionStack`). |
| **Playlist Donut (M8)**| `/feed/playlists`, `/@user/playlists` | `ytd-rich-item-renderer:has(yt-collection-thumbnail-view-model)` | Anchor: `.ytLockupViewModelMetadata` | Target for injecting Milestone 8 SVG Donut progress indicator. |
| **Search results** | `/results` | `ytd-video-renderer, ytd-grid-video-renderer` | `ytd-video-renderer, ytd-grid-video-renderer` | Cleanly targets search video cards & carousel items (*"People also search for"*). |
| **Watch page — sidebar** | `/watch` | `yt-lockup-view-model, ytd-compact-video-renderer` | `yt-lockup-view-model, ytd-compact-video-renderer` | Cleanly styles suggested Up Next video cards (`yt-lockup-view-model`). |
| **Watch page — queue** | `/watch` | `ytd-playlist-panel-video-renderer` | `ytd-playlist-panel-video-renderer` | |
| **Playlist page & Watch Later** | `/playlist` | `yt-lockup-view-model, ytd-playlist-video-renderer` | `yt-lockup-view-model, ytd-playlist-video-renderer` | Border wraps full `ytd-playlist-video-renderer` container. Covers standard & Watch Later (`list=WL`). |
| **History** | `/feed/history` | `yt-lockup-view-model` | `yt-lockup-view-model` | Uses YouTube's `yt-lockup-view-model` Web Component tag for horizontal history items. |
| **Channel home** | `/@user` | `yt-lockup-view-model, ytd-grid-video-renderer` | `yt-lockup-view-model, ytd-grid-video-renderer` | Unified selector covering "For You", "Videos", "Collaborations", and all channel shelf carousels. ⚠️ NEVER style `ytd-shelf-renderer` wrapper. |
| **Channel videos / streams** | `/@user/videos`, `/@user/streams` | `ytd-rich-item-renderer #content` | `ytd-rich-item-renderer` | Border on `#content` to prevent layout shift. Covers Videos & Live Streams tabs. |

## Button System Architecture

Independent of the border system. Anchor-based: scans for `a#thumbnail, a[href*="/watch"]` and injects a button container (`#btnstrip`) as a sibling, positioned absolutely over the hover selector container.

## When a Selector Breaks

1. Don't add a fallback chain. Find the new correct selector for that specific page type and update the table above.
2. Log a warning (page type + selector + zero-match) rather than failing silently — this is what turns "extension mysteriously broke" into "selector X broke on page Y, here's when."
3. SPA navigation fires the URL change *before* the DOM updates. Don't react to the URL change instantly — debounce ~300ms, or listen for YouTube's `yt-navigate-finish` event before running `updateBorders()`.

## Cleanup Contract

Every element MarkTube modifies gets `data-mt-owned="true"` (or `OWNED_ATTR`). `clearInjectedVideoUI()` must run and remove everything with that attribute before any re-render — never leave stale borders/buttons behind after a page/selector change.
