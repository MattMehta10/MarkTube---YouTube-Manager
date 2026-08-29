# MarkTube — PRD (Phase 1–2 scope)

## Problem

People save YouTube videos across Watch Later, Liked, playlists, and memory, then can't retrieve them later. YouTube is built for consumption, not retrieval.

## Solution (current scope)

A Chrome extension that lets users tag any video as **Watched / Important / Want to Watch** directly from the YouTube feed (hover buttons + colored border), then browse/search/filter those tags in a sidebar dashboard.

## Non-goals (for now)

Explicitly out of scope until Phase 3+, so they don't creep into Phase 1–2 work:
- Accounts, login, multi-device sync (currently frontend-only placeholder — see `Login.jsx`)
- AI search / semantic search over saved videos
- Cross-platform (Udemy, Coursera, articles)
- Payments / subscription enforcement

## Core user flow

1. User hovers a video thumbnail anywhere on YouTube → sees Watched / Important / Want to Watch controls
2. Clicking a control tags the video: writes to local storage (PouchDB) and draws a colored border on the card
3. User opens the sidebar → sees stats (counts, streak), "Want to Watch Next" and "Revisiting Important" rails, and a searchable/filterable Library

## Success signal

Not "how many people install it" — **do tagged users come back and actually retrieve a video later**, or do they mark-and-forget. This is the number that matters most before investing in Phase 3.

## Data model

```js
{
  _id: "video_<videoId>",
  videoId: string,
  type: "watched" | "important" | "toWatch",
  title: string,
  channel: string,
  thumbnail: string,
  addedAt: number (timestamp)
}
```

Stored in PouchDB inside the extension. No backend in Phase 1–2.

## Known constraints

- YouTube's DOM differs per page type (home, search, watch, playlist, channel, history) and changes over time/A-B tests. See `SELECTOR_MAP.md` — this is the single source of truth for where UI gets injected on each page type.
- SPA navigation fires before the DOM updates, so injection logic must wait for DOM stabilization, not just URL change.
