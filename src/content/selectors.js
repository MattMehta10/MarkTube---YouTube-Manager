// Single source of truth for per-page-type video card selectors.
// Keep this in sync with docs/SELECTOR_MAP.md — update both together.

export const BORDER_SELECTORS = {
  home: 'ytd-rich-item-renderer #content',
  watchSidebar: '.yt-lockup-view-model--horizontal, ytd-compact-video-renderer',
  watchPlaylistQueue: 'ytd-playlist-panel-video-renderer > #wc-endpoint',
  playlist: 'ytd-playlist-video-renderer > #content',
  history: '.yt-lockup-view-model--horizontal',
  channelHome: 'ytd-grid-video-renderer', // ⚠️ NOT ytd-shelf-renderer
  channelVideos: 'ytd-rich-item-renderer #content',
  search: 'ytd-video-renderer',
  newLayoutHorizontal: '.yt-lockup-view-model-wiz.yt-lockup-view-model-wiz--horizontal',
  newLayoutCompact: '.yt-lockup-view-model--compact',
};

// Anchor selector used by the button system
export const VIDEO_ANCHOR_SELECTOR = 'a#thumbnail, a[href*="/watch"]';

// Selectors for card elements in feeds for hover buttons
export const FEED_CARD_SELECTORS = [
  'ytd-rich-item-renderer',
  '.yt-lockup-view-model--compact',
  'ytd-compact-video-renderer',
  'ytd-video-renderer',
  'ytd-playlist-video-renderer',
  'ytd-grid-video-renderer',
  'ytd-playlist-panel-video-renderer',
  '.yt-lockup-view-model-wiz--horizontal',
];

/**
 * Returns the correct border selector for the current page, or default multi-selector
 */
export function getSelectorForCurrentPage() {
  const path = location.pathname;

  if (path === '/' || path === '/feed/trending' || path === '/feed/subscriptions') {
    return BORDER_SELECTORS.home;
  }
  if (path === '/watch') {
    return `${BORDER_SELECTORS.watchSidebar}, ${BORDER_SELECTORS.watchPlaylistQueue}`;
  }
  if (path.startsWith('/playlist')) {
    return BORDER_SELECTORS.playlist;
  }
  if (path === '/feed/history') {
    return BORDER_SELECTORS.history;
  }
  if (path.startsWith('/@') && path.endsWith('/videos')) {
    return BORDER_SELECTORS.channelVideos;
  }
  if (path.startsWith('/@')) {
    return BORDER_SELECTORS.channelHome;
  }
  if (path === '/results') {
    return BORDER_SELECTORS.search;
  }

  // Fallback selector string matching all feed elements
  return `
    div#dismissible,
    ytd-playlist-panel-video-renderer > #wc-endpoint,
    ytd-playlist-video-renderer > #content,
    ytd-rich-item-renderer #content,
    .yt-lockup-view-model-wiz.yt-lockup-view-model-wiz--horizontal,
    .yt-lockup-view-model--compact
  `;
}
