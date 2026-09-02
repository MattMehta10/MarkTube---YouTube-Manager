import PouchDB from 'pouchdb';
import './content.css';
import { toggleSidebar } from './sidebarInject.js';

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

function markAsOwned(el, state = null) {
  if (!el) return;
  el.dataset.mtOwned = '1';
  if (state) el.dataset.mtState = state;
}

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

function clearInjectedVideoUI() {
  document.querySelectorAll('[data-mt-owned="1"]').forEach((el) => {
    el.style.border = '';
    el.style.borderRadius = '';
    el.style.position = '';
    el.removeAttribute('data-mt-owned');
    el.removeAttribute('data-mt-state');
  });

  document
    .querySelectorAll('.myMTButton, .myMTButtonContainer, #btnstrip, .btnstrip')
    .forEach((el) => el.remove());
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
// SECTION 5: FEED VIDEO UI - HOVER BUTTONS & INTERACTIONS
// ////////////////////////////////////////////////////////////////////////////

function addFeedButtons() {
  let vidbox = [
    ...document.querySelectorAll('ytd-rich-item-renderer'),
    ...document.querySelectorAll('.yt-lockup-view-model--compact'),
    ...document.querySelectorAll('ytd-compact-video-renderer'),
    ...document.querySelectorAll('ytd-video-renderer'),
    ...document.querySelectorAll('ytd-playlist-video-renderer'),
    ...document.querySelectorAll('ytd-grid-video-renderer'),
    ...document.querySelectorAll('ytd-playlist-panel-video-renderer'),
    ...document.querySelectorAll('.yt-lockup-view-model-wiz--horizontal'),
  ];

  vidbox = vidbox.filter(
    (el) =>
      !el.closest('ytd-reel-item-renderer') &&
      !el.closest('ytd-rich-section-renderer') &&
      !el.closest('ytd-reel-shelf-renderer') &&
      !el.closest('ytd-ad-slot-renderer') &&
      !el.closest('yt-collection-thumbnail-view-model') &&
      !el.classList.contains('ytd-rich-grid-slim-media')
  );

  vidbox.forEach((el) => {
    if (!el.dataset.Hovered) {
      el.addEventListener('mouseenter', () => {
        let btnstrip = el.querySelector('#btnstrip');
        if (btnstrip) btnstrip.remove();

        const anchor = el.querySelector('a[href*="/watch"]');
        if (!anchor) return;
        if (anchor.href.includes('/playlist?')) return;
        if (el.querySelector('yt-collection-thumbnail-view-model')) return;

        const videoId = extractVideoId(anchor.href);
        if (!videoId) return;

        btnstrip = document.createElement('div');
        btnstrip.id = 'btnstrip';
        btnstrip.innerHTML = `
          <div class="btns" title="Mark as Watched"></div>
          <div class="btns" title="Mark as Important"></div>
          <div class="btns" title="Want to Watch"></div>
        `;
        btnstrip.classList.add('visible');
        btnstrip.style.position = 'absolute';
        btnstrip.style.right = '16px';
        btnstrip.style.bottom = '5px';
        btnstrip.style.zIndex = '10';

        if (getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
          markAsOwned(el);
        }
        el.appendChild(btnstrip);
        markAsOwned(el);

        const [btnW, btnI, btnT] = btnstrip.querySelectorAll('.btns');

        if (btnW) {
          if (watchedVideos.includes(videoId)) btnW.classList.add('active');
          btnW.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            saveWatchedVideo(el, videoId);
            btnW.classList.toggle('active');
          });
        }

        if (btnI) {
          if (impVideos.includes(videoId)) btnI.classList.add('active');
          btnI.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            saveImpVideo(el, videoId);
            btnI.classList.toggle('active');
          });
        }

        if (btnT) {
          if (toWatchVideos.includes(videoId)) btnT.classList.add('active');
          btnT.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            saveToWatchVideo(el, videoId);
            btnT.classList.toggle('active');
          });
        }
      });

      el.addEventListener('mouseleave', () => {
        const btnstrip = el.querySelector('#btnstrip');
        if (btnstrip) {
          btnstrip.classList.remove('visible');
          setTimeout(() => {
            if (btnstrip && btnstrip.parentNode) btnstrip.remove();
          }, 250);
        }
      });

      el.dataset.Hovered = '1';
    }
  });
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 6: VIDEO STATUS INDICATORS - COLORED BORDERS
// ////////////////////////////////////////////////////////////////////////////

function updateWatchedStatus(el, videoId) {
  const isWatched = watchedVideos.includes(videoId);
  const isImp = impVideos.includes(videoId);
  const isToWatch = toWatchVideos.includes(videoId);
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

  if (container.dataset.mtOwned === '1') {
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
    let btn = container.querySelector('.myMTButton');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'myMTButton';
      btn.textContent = 'Mark as Watched';
      btn.style.cssText = 'border-radius:12px;padding:5px 10px;margin:10px 0';
      btn.addEventListener('click', () => saveWatchedVideo(el, videoId));
      container.insertBefore(btn, container.firstChild);
    }
    btn.textContent = isWatched ? 'Watched' : 'Mark as Watched';
    container.style.border = 'none';
    markAsOwned(container, 'playing');
  }
}

function updateUI() {
  // 🎬 Now Playing
  document.querySelectorAll('ytd-watch-metadata').forEach((el) => {
    const vid = el.getAttribute('video-id') || extractVideoId(window.location.href);
    if (vid) createOrUpdateWatchedButton(el, vid);
  });

  // ✅ Regular feed videos
  document
    .querySelectorAll(
      `
      div#dismissible,
      ytd-playlist-panel-video-renderer > #wc-endpoint,
      ytd-playlist-video-renderer > #content,
      ytd-rich-item-renderer #content,
      .yt-lockup-view-model-wiz.yt-lockup-view-model-wiz--horizontal,
      .yt-lockup-view-model--compact
    `
    )
    .forEach((el) => {
      const thumb = el.querySelector('a#thumbnail, a[href*="/watch"]');
      const vid = extractVideoId(thumb?.href);
      if (vid) updateWatchedStatus(el, vid);
    });
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 7: CURRENTLY PLAYING VIDEO UI - ACTION BUTTONS
// ////////////////////////////////////////////////////////////////////////////

function createOrUpdateWatchedButton(el, videoId) {
  let container = el.previousElementSibling;
  if (!container || !container.classList.contains('myMTButtonContainer')) {
    container = document.createElement('div');
    container.className = 'myMTButtonContainer';

    const btnW = document.createElement('button');
    btnW.className = 'myMTButton MtButton1';
    btnW.style.cssText = 'border-radius:12px;padding:5px 10px;margin:10px 0';

    const btnI = document.createElement('button');
    btnI.className = 'myMTButton MtButton2';
    btnI.style.cssText = 'border-radius:12px;padding:5px 10px;margin:10px 0';

    const btnT = document.createElement('button');
    btnT.className = 'myMTButton MtButton3';
    btnT.style.cssText = 'border-radius:12px;padding:5px 10px;margin:10px 0';

    container.appendChild(btnW);
    container.appendChild(btnI);
    container.appendChild(btnT);
    el.parentNode.insertBefore(container, el);
  }

  const [btnW, btnI, btnT] = container.querySelectorAll('button');

  btnW.onclick = () => saveWatchedVideo(el, videoId);
  btnI.onclick = () => saveImpVideo(el, videoId);
  btnT.onclick = () => saveToWatchVideo(el, videoId);

  const isWatched = watchedVideos.includes(videoId);
  const isImp = impVideos.includes(videoId);
  const isToWatch = toWatchVideos.includes(videoId);

  btnW.textContent = isWatched ? 'Watched' : 'Mark as Watched';
  btnW.style.backgroundColor = isWatched ? '#237b2c' : '';
  btnW.style.border = isWatched ? 'none' : '1px solid #19b929';

  btnI.textContent = isImp ? 'IMP' : 'Mark as Important';
  btnI.style.backgroundColor = isImp ? 'red' : '';
  btnI.style.border = isImp ? 'none' : '1px solid rgb(255, 30, 0)';

  btnT.textContent = isToWatch ? 'Want to Watch' : 'Mark for Watching';
  btnT.style.backgroundColor = isToWatch ? 'goldenrod' : '';
  btnT.style.border = isToWatch ? 'none' : '1px solid yellow';
  btnT.style.setProperty('color', isToWatch ? 'black' : '', 'important');

  el.style.border = 'none';
}

// ////////////////////////////////////////////////////////////////////////////
// SECTION 8: METADATA EXTRACTION (OEMBED + DOM FALLBACK)
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
// SECTION 9: ROUTING & CONDITIONAL LOGIC
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
// SECTION 10: DEBOUNCED UI UPDATES & DOM MONITORING
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
    addFeedButtons();
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

window.addEventListener('message',(event) => {
  if(event.data && event.data.type === "MT_SYNC_STORAGE_DATA"){
    const {mtWatched,mtImportant,mtToWatch} = event.data.payload || {};
    
    //writing to chrome.storage.local
    if(typeof chrome != 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({mtWatched,mtImportant,mtToWatch});
    }
  
  watchedVideos = mtWatched || [];
  impVideos = mtImportant || [];
  toWatchVideos = mtToWatch || [];

  // update ui for all videos on page
  clearInjectedVideoUI();
  safeUpdateUI();
  showToast("✅ Library restored & borders updated!")
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
// SECTION 11: INITIALIZATION
// ////////////////////////////////////////////////////////////////////////////

getMarkedVideos();
startObserver();
safeUpdateUI();
