// Single source of truth for per-page-type video card selectors.
// Keep this in sync with docs/SELECTOR_MAP.md — update both together.
//
// Rule: know containers per page, don't detect them. Never fall back to
// el.closest(...) chains or "climb until it looks right" — that's what
// caused the giant-border bug on channel pages (styled the shelf wrapper
// instead of the card).

export const BORDER_SELECTORS = {
  home: 'ytd-rich-item-renderer #content',
  watchSidebar: '.yt-lockup-view-model--horizontal',
  watchPlaylistQueue: 'ytd-playlist-panel-video-renderer',
  playlist: 'ytd-playlist-video-renderer',
  history: '.yt-lockup-view-model--horizontal',
  channelHome: 'ytd-grid-video-renderer', // NOT ytd-shelf-renderer
  channelVideos: 'ytd-rich-item-renderer #content',
  search: 'ytd-video-renderer',
};

// Anchor selector used by the button system — independent of border selectors.
export const VIDEO_ANCHOR_SELECTOR = 'a#thumbnail, a[href*="/watch"]';

/**
 * Returns the correct border selector for the current page, or null if
 * this page type isn't mapped yet. Callers must treat null as "don't
 * touch this page" — not as a signal to guess a fallback.
 */
export function getSelectorForCurrentPage() {
  const path = location.pathname;

  if (path === '/' || path === '/feed/trending') return BORDER_SELECTORS.home;
  if (path === '/watch') return BORDER_SELECTORS.watchSidebar; // queue handled separately, see borders.js
  if (path.startsWith('/playlist')) return BORDER_SELECTORS.playlist;
  if (path === '/feed/history') return BORDER_SELECTORS.history;
  if (path.startsWith('/@') && path.endsWith('/videos')) return BORDER_SELECTORS.channelVideos;
  if (path.startsWith('/@')) return BORDER_SELECTORS.channelHome;
  if (path === '/results') return BORDER_SELECTORS.search;

  return null; // unmapped page type — log this, don't guess
}
