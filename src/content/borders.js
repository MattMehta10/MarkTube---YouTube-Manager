import { getSelectorForCurrentPage } from './selectors.js';

const OWNED_ATTR = 'data-mt-owned';

const BORDER_COLORS = {
  watched: 'rgba(34, 197, 94, 0.6)',   // green
  important: 'rgba(239, 68, 68, 0.6)', // red
  toWatch: 'rgba(234, 179, 8, 0.6)',   // yellow
};

/**
 * Removes every element MarkTube previously touched, so a re-render
 * never leaves stale borders/buttons from an old page or selector.
 */
export function clearInjectedVideoUI() {
  document.querySelectorAll(`[${OWNED_ATTR}]`).forEach((el) => {
    el.style.border = '';
    el.removeAttribute(OWNED_ATTR);
  });
}

/**
 * Applies border state to every video card on the current page type.
 * getVideoState(videoId) should return 'watched' | 'important' | 'toWatch' | null.
 */
export function updateBorders(getVideoState, extractVideoId) {
  const selector = getSelectorForCurrentPage();

  if (!selector) {
    // Unmapped page type. Don't guess a fallback — log so it's fixable.
    console.debug('[MarkTube] no selector mapped for', location.pathname);
    return;
  }

  const cards = document.querySelectorAll(selector);

  if (cards.length === 0) {
    // Selector matched nothing on a page where videos are expected.
    // This is the health-check signal — a broken/changed selector, not silence.
    console.warn('[MarkTube] selector matched 0 elements:', selector, 'on', location.pathname);
    return;
  }

  cards.forEach((card) => {
    const videoId = extractVideoId(card);
    if (!videoId) return;

    const state = getVideoState(videoId);
    card.style.border = state ? `2px solid ${BORDER_COLORS[state]}` : '';
    card.setAttribute(OWNED_ATTR, 'true');
  });
}
