import { updateBorders, clearInjectedVideoUI } from './borders.js';
import { addFeedButtons } from './buttons.js';
import { injectSidebar, toggleSidebar } from './sidebarInject.js';

// TODO: replace with real PouchDB-backed lookups once ported from the
// old TestPouch.jsx / Library.jsx logic. Kept as plain functions here
// so content.js has no React/PouchDB bundling weight.
function getVideoState(videoId) {
  return null; // TODO: query local store
}

function extractVideoId(el) {
  const anchor = el.querySelector?.('a#thumbnail, a[href*="/watch"]') ?? el;
  const href = anchor?.href;
  if (!href) return null;
  try {
    return new URL(href).searchParams.get('v');
  } catch {
    return null;
  }
}

function onMark(videoId, type) {
  // TODO: write to PouchDB, then re-run safeUpdateUI so the border reflects immediately
  console.log('[MarkTube] mark', videoId, type);
}

function safeUpdateUI() {
  clearInjectedVideoUI();
  updateBorders(getVideoState, extractVideoId);
  addFeedButtons(extractVideoId, onMark);
}

// SPA navigation fires the URL change before the DOM updates.
// Debounce so we run after the DOM has actually settled, not on the raw event.
let debounceTimer;
function scheduleUpdate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(safeUpdateUI, 300);
}

new MutationObserver(scheduleUpdate).observe(document.body, {
  childList: true,
  subtree: true,
});

// Prefer YouTube's own navigation event when available — more reliable
// than inferring navigation purely from mutations.
document.addEventListener('yt-navigate-finish', scheduleUpdate);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'TOGGLE_SIDEBAR') toggleSidebar();
});

scheduleUpdate();
