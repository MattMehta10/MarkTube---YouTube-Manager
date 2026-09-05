import PouchDB from 'pouchdb';
import './content.css';
import { toggleSidebar } from './sidebarInject.js';
import { updateBorders, updateWatchedStatus, clearInjectedVideoUI, markAsOwned } from './borders.js';
import { addFeedButtons, createOrUpdateWatchedButton } from './buttons.js';
import { getSelectorForCurrentPage } from './selectors.js';

// ////////////////////////////////////////////////////////////////////////////
// SECTION 1: IMPORTS & INITIALIZATION
// ////////////////////////////////////////////////////////////////////////////

const db = new PouchDB('MTDataBase');

// Initialize database connection confirmation toast
setTimeout(() => {
  showToast(`DATABASE CONNECTED✅${db.name}`);
}, 1800);

// ////////////////////////////////////////////////////////////////////////////
// SECTION 2: CORE UTILITY FUNCTIONS
// ////////////////////////////////////////////////////////////////////////////

function extractVideoId(url) {
  if (!url) return null;
  let id = url.split('v=')[1] || url.split('/shorts/')[1];
  if (!id) return null;
  const amp = id.indexOf('&');
  return amp >= 0 ? id.slice(0, amp) : id;
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 3: NOTIFICATIONS & DOM CLEANUP
// ////////////////////////////////////////////////////////////////////////////

function showToast(msg) {
  const existing = document.querySelector('.my-toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.textContent = msg;
  el.className = 'my-toast';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 4: STORAGE & DATABASE OPERATIONS
// ////////////////////////////////////////////////////////////////////////////

const WatchedStorageKey = 'mtWatched';
const impStorageKey = 'mtImportant';
const toWatchStorageKey = 'mtToWatch';

let watchedVideos = [];
let impVideos = [];
let toWatchVideos = [];

const actionHandlers = {
  toggleWatched: (el, videoId) => saveWatchedVideo(el, videoId),
  toggleImportant: (el, videoId) => saveImpVideo(el, videoId),
  toggleToWatch: (el, videoId) => saveToWatchVideo(el, videoId),
};

async function handleSave(type, el, videoId, list, storageKey) {
  const idx = list.indexOf(videoId);
  const _id = `video_${videoId}`;

  if (idx >= 0) {
    list.splice(idx, 1);
    try {
      const doc = await db.get(_id);
      await db.remove(doc);
      showToast(`🗑️ Removed ${videoId} from DB`);
    } catch {
      showToast(`⚠️ Not in DB: ${videoId}`);
    }
  } else {
    const meta = await extractVideoData(el, videoId);
    list.push(videoId);
    try {
      await db.put({ _id, type, addedAt: Date.now(), ...meta });
      showToast(`✅ Marked as ${type}`);
    } catch (err) {
      if (err.status === 409) {
        try {
          const existing = await db.get(_id);
          await db.put({ ...existing, type, ...meta });
          showToast(`🔁 Updated ${videoId} to ${type}`);
        } catch {
          showToast(`✅ Marked as ${type}`);
        }
      } else {
        showToast('❌ DB Save failed!');
      }
    }
  }

  chrome.storage.local.set({ [storageKey]: list, _mt_ts: Date.now() }, getMarkedVideos);
}

function saveWatchedVideo(el, videoId) {
  chrome.storage.local.get([WatchedStorageKey], ({ [WatchedStorageKey]: w }) => {
    watchedVideos = Array.isArray(w) ? w.map(String) : [];
    handleSave('watched', el, videoId, watchedVideos, WatchedStorageKey);
  });
}

function saveImpVideo(el, videoId) {
  chrome.storage.local.get([impStorageKey], ({ [impStorageKey]: i }) => {
    impVideos = Array.isArray(i) ? i.map(String) : [];
    handleSave('important', el, videoId, impVideos, impStorageKey);
  });
}

function saveToWatchVideo(el, videoId) {
  chrome.storage.local.get([toWatchStorageKey], ({ [toWatchStorageKey]: t }) => {
    toWatchVideos = Array.isArray(t) ? t.map(String) : [];
    handleSave('toWatch', el, videoId, toWatchVideos, toWatchStorageKey);
  });
}

function getMarkedVideos() {
  chrome.storage.local.get(
    [WatchedStorageKey, impStorageKey, toWatchStorageKey],
    ({ [WatchedStorageKey]: w, [impStorageKey]: i, [toWatchStorageKey]: t }) => {
      watchedVideos = Array.isArray(w) ? w.map(String) : [];
      impVideos = Array.isArray(i) ? i.map(String) : [];
      toWatchVideos = Array.isArray(t) ? t.map(String) : [];
      safeUpdateUI();
    }
  );
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 5: FEED & WATCH PAGE UI UPDATES
// ////////////////////////////////////////////////////////////////////////////

function updateUI() {
  // 🎬 Now Playing
  document.querySelectorAll('ytd-watch-metadata').forEach((el) => {
    const vid = el.getAttribute('video-id') || extractVideoId(window.location.href);
    if (vid) {
      createOrUpdateWatchedButton(el, vid, watchedVideos, impVideos, toWatchVideos, actionHandlers);
    }
  });

  // ✅ Regular feed video borders
  updateBorders(watchedVideos, impVideos, toWatchVideos, extractVideoId);
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 6: METADATA EXTRACTION (OEMBED + DOM FALLBACK)
// ////////////////////////////////////////////////////////////////////////////

async function extractVideoData(el, videoId) {
  const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!response.ok) {
      throw new Error(`oEmbed failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      videoId,
      title: data.title || 'Untitled',
      channel: data.author_name || 'Unknown',
      thumbnail: data.thumbnail_url || fallbackThumbnail,
    };
  } catch (error) {
    console.warn('oEmbed failed, falling back to DOM scraping', error);

    try {
      let title = 'Untitled';
      let channel = 'Unknown';

      if (el?.tagName === 'YTD-WATCH-METADATA') {
        title = el.querySelector('h1 yt-formatted-string')?.textContent.trim() || 'Untitled';
        channel = document.querySelector('ytd-channel-name a')?.textContent.trim() || 'Unknown';
      } else if (el) {
        const titleEl =
          el.querySelector('#video-title') ||
          el.querySelector('yt-formatted-string#video-title') ||
          el.querySelector('h3 a') ||
          el.querySelector('yt-formatted-string') ||
          el.querySelector('.metadata a');

        title = titleEl?.textContent.trim() || 'Untitled';
        channel = el.querySelector('ytd-channel-name a')?.textContent.trim() || 'Unknown';
      }

      return {
        videoId,
        title,
        channel,
        thumbnail: fallbackThumbnail,
      };
    } catch (domError) {
      console.error('DOM fallback failed', domError);

      return {
        videoId,
        title: 'Untitled',
        channel: 'Unknown',
        thumbnail: fallbackThumbnail,
      };
    }
  }
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 7: ROUTING & CONDITIONAL LOGIC
// ////////////////////////////////////////////////////////////////////////////

function getPageMode() {
  const path = location.pathname;
  if (path.startsWith('/feed/playlists')) return 'PLAYLIST_OVERVIEW';
  if (path.startsWith('/feed/courses')) return 'COURSES';
  if (path.endsWith('/courses')) return 'COURSES';
  if (path.endsWith('/playlists')) return 'PLAYLIST_OVERVIEW';
  return 'VIDEO_FEED';
}

function shouldRunVideoUI() {
  return getPageMode() === 'VIDEO_FEED';
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 8: DEBOUNCED UI UPDATES & DOM MONITORING
// ////////////////////////////////////////////////////////////////////////////

let uiTimeout;

function safeUpdateUI() {
  clearTimeout(uiTimeout);

  if (!shouldRunVideoUI()) {
    clearInjectedVideoUI();
    return;
  }
  uiTimeout = setTimeout(() => {
    updateUI();
    addFeedButtons(
      () => ({ watchedVideos, impVideos, toWatchVideos }),
      extractVideoId,
      actionHandlers
    );
  }, 200);
}

let observer;

function startObserver() {
  const target = document.querySelector('ytd-page-manager') || document.body;
  if (observer) observer.disconnect();

  observer = new MutationObserver(() => {
    safeUpdateUI();
  });

  observer.observe(target, {
    childList: true,
    subtree: true,
  });
}

let routeChangeTimeout;
let lastUrl = location.href;

function detectRouteChange() {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    clearTimeout(routeChangeTimeout);
    routeChangeTimeout = setTimeout(() => {
      clearInjectedVideoUI();
      safeUpdateUI();
    }, 300);
  }
}

new MutationObserver(detectRouteChange).observe(document, {
  childList: true,
  subtree: true,
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'TOGGLE_SIDEBAR') toggleSidebar();
});

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'MT_SYNC_STORAGE_DATA') {
    const { mtWatched, mtImportant, mtToWatch } = event.data.payload || {};

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ mtWatched, mtImportant, mtToWatch });
    }

    watchedVideos = mtWatched || [];
    impVideos = mtImportant || [];
    toWatchVideos = mtToWatch || [];

    clearInjectedVideoUI();
    safeUpdateUI();
    showToast('✅ Library restored & borders updated!');
  }
});

if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      getMarkedVideos();
    }
  });
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 9: INITIALIZATION
// ////////////////////////////////////////////////////////////////////////////

getMarkedVideos();
startObserver();
safeUpdateUI();
