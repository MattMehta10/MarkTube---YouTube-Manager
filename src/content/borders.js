import { getSelectorForCurrentPage } from './selectors.js';

export const OWNED_ATTR = 'data-mt-owned';

export function markAsOwned(el, state = null) {
  if (!el) return;
  el.setAttribute(OWNED_ATTR, '1');
  if (state) el.dataset.mtState = state;
}

/**
 * Removes every element MarkTube previously touched, so a re-render
 * never leaves stale borders/buttons from an old page or selector.
 */
export function clearInjectedVideoUI() {
  document.querySelectorAll(`[${OWNED_ATTR}]`).forEach((el) => {
    el.style.border = '';
    el.style.outline = '';
    el.style.outlineOffset = '';
    el.style.borderRadius = '';
    el.removeAttribute(OWNED_ATTR);
    el.removeAttribute('data-mt-state');
  });

  document
    .querySelectorAll('.myMTButton, .myMTButtonContainer, #btnstrip, .btnstrip')
    .forEach((el) => el.remove());
}

/**
 * Applies colored borders to indicate video status (green=watched, red=important, goldenrod=toWatch)
 */
export function updateWatchedStatus(el, videoId, watchedList, importantList, toWatchList) {
  // Exclude playlist collection cards everywhere (e.g. /feed/playlists, /feed/you, channel playlists)
  if (
    location.pathname === '/feed/playlists' ||
    el.querySelector('yt-collection-thumbnail-view-model, [class*="CollectionStack"]') ||
    el.closest('ytd-rich-item-renderer:has(yt-collection-thumbnail-view-model)') ||
    el.closest('yt-lockup-view-model:has(yt-collection-thumbnail-view-model)')
  ) {
    return;
  }

  const isWatched = watchedList.includes(videoId);
  const isImp = importantList.includes(videoId);
  const isToWatch = toWatchList.includes(videoId);
  const isPlaying = el.closest('ytd-watch-metadata') !== null;

  const richItem = el.closest('ytd-rich-item-renderer');
  const playlistVideo = el.closest('ytd-playlist-video-renderer');
  const lockupModel = el.closest('yt-lockup-view-model');

  // Priority order: richItem #content comes BEFORE inner lockupModel
  // to prevent double borders when ytd-rich-item-renderer wraps yt-lockup-view-model (e.g. /music)
  const container =
    (richItem ? (richItem.querySelector('#content') || richItem) : null) ||
    playlistVideo ||
    lockupModel ||
    el.closest('ytd-video-renderer') ||
    el.closest('.yt-lockup-view-model-wiz.yt-lockup-view-model-wiz--horizontal') ||
    el.closest('.yt-lockup-view-model--compact') ||
    el.closest('ytd-grid-video-renderer') ||
    el.closest('ytd-compact-video-renderer') ||
    el.closest('ytd-playlist-panel-video-renderer') ||
    el.closest('ytd-watch-next-secondary-results-renderer') ||
    (el.parentElement && !el.parentElement.tagName.toLowerCase().includes('shelf') ? el.parentElement : null);

  if (!container) return;

  // Shelf Guard: Never style section shelf wrappers (e.g. ytd-shelf-renderer)
  if (container.tagName.toLowerCase().includes('shelf')) return;

  // Double check playlist collection card on resolved container
  if (container.querySelector('yt-collection-thumbnail-view-model, [class*="CollectionStack"]')) {
    return;
  }

  if (container.getAttribute(OWNED_ATTR) === '1') {
    container.style.border = '';
    container.style.outline = '';
    container.style.outlineOffset = '';
    container.style.borderRadius = '';
    container.removeAttribute('data-mt-state');
  }

  if (!isPlaying) {
    let applied = false;

    if (isToWatch) {
      container.style.border = '2px solid goldenrod';
      markAsOwned(container, 'toWatch');
      applied = true;
    } else if (isImp) {
      container.style.border = '2px solid red';
      markAsOwned(container, 'important');
      applied = true;
    } else if (isWatched) {
      container.style.border = '2px solid green';
      markAsOwned(container, 'watched');
      applied = true;
    }

    if (applied) {
      container.style.borderRadius = '10px';
    }
  } else {
    container.style.border = 'none';
    markAsOwned(container, 'playing');
  }
}

/**
 * Applies border state to every video card on the current page type.
 */
export function updateBorders(watchedList, importantList, toWatchList, extractVideoId) {
  const selector = getSelectorForCurrentPage();
  if (!selector) return;

  const cards = document.querySelectorAll(selector);

  cards.forEach((card) => {
    // Exclude ad cards and playlist collection cards
    if (card.querySelector('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer')) return;
    if (card.querySelector('yt-collection-thumbnail-view-model, [class*="CollectionStack"]')) return;

    const thumb = card.querySelector('a#thumbnail, a[href*="/watch"]');
    const videoId = extractVideoId(thumb?.href);
    if (videoId) {
      updateWatchedStatus(card, videoId, watchedList, importantList, toWatchList);
    }
  });
}
