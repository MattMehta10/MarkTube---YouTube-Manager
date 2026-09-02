# Roadmap

Status is kept honest here — "planned" doesn't mean "in progress." Update this file whenever a feature actually ships, not when it's decided.

## Phase 1 — Foundation & Stability
- [x] DOM mapping across page types (home, search, watch, playlist, history, channel) — see `SELECTOR_MAP.md`
- [x] Hover buttons (Watched / Important / Want to Watch)
- [x] Visual border state indicators
- [x] oEmbed metadata + DOM fallback
- [ ] Selector health-check logging (flag broken selectors instead of failing silently)
- [ ] Automated build so manifest/vite output names can never drift apart again

## Phase 2 — Personal Video Library
- [x] Sidebar dashboard (Overview: streak, stats, "want to watch next" / "revisiting important" rails)
- [x] Library view with filter tabs (ToWatch / Important / Watched / All) + search + pagination
- [x] Export & Import data (JSON backup/restore with live storage sync & content script handshake)
- [ ] Collections / custom tags beyond the three built-in states
- [ ] Settings that actually persist (theme, sidebar width — currently UI-only, not wired to storage)

## Phase 3 — Knowledge Layer (not started)
- [ ] Real accounts + sync (needed before "AI video memory" or multi-device use)
- [ ] Semantic search over saved videos
- [ ] Topic extraction from metadata

## Phase 4 — Learning Intelligence (not started)
- [ ] Learning streaks tied to real activity (currently static/demo data)
- [ ] Knowledge timeline, skill graph

## Explicitly deprioritized until real usage data exists
Payments, account deletion flows, and multi-device sync are stubbed in the UI (`Login.jsx`, `Settings.jsx`) but intentionally not wired up — see PRD non-goals. Don't build the backend for these until Phase 1–2 usage shows people actually want them.
