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
  const isWatched = watchedList.includes(videoId);
  const isImp = importantList.includes(videoId);
  const isToWatch = toWatchList.includes(videoId);
  const isPlaying = el.closest('ytd-watch-metadata') !== null;

  const container =
    el.closest('.yt-lockup-view-model-wiz.yt-lockup-view-model-wiz--horizontal') ||
    el.closest('.yt-lockup-view-model--compact') ||
    el.closest('ytd-rich-item-renderer') ||
    el.closest('ytd-video-renderer') ||
    el.closest('ytd-grid-video-renderer') ||
    el.closest('ytd-playlist-video-renderer') ||
    el.closest('ytd-compact-video-renderer') ||
    el.closest('ytd-playlist-panel-video-renderer') ||
    el.closest('ytd-watch-next-secondary-results-renderer') ||
    el.parentElement;

  if (!container) return;

  if (container.getAttribute(OWNED_ATTR) === '1') {
    container.style.border = '';
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
    const thumb = card.querySelector('a#thumbnail, a[href*="/watch"]');
    const videoId = extractVideoId(thumb?.href);
    if (videoId) {
      updateWatchedStatus(card, videoId, watchedList, importantList, toWatchList);
    }
  });
}
