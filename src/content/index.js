import PouchDB from 'pouchdb';
import './content.css';
import { toggleSidebar } from './sidebarInject.js';

const db = new PouchDB('MTDataBase');

function showToast(msg) {
  const existing = document.querySelector('.my-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.textContent = msg;
  t.className = 'my-toast';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

const KEY_WATCHED = 'mtWatched';
const KEY_IMPORTANT = 'mtImportant';
const KEY_TOWATCH = 'mtToWatch';

let watchedList = [];
let importantList = [];
let toWatchList = [];

function extractVideoId(href) {
  if (!href) return null;
  let id = href.split('v=')[1] || href.split('/shorts/')[1];
  if (!id) return null;
  const ampersandPos = id.indexOf('&');
  return ampersandPos >= 0 ? id.slice(0, ampersandPos) : id;
}

async function extractMeta(cardEl, videoId) {
  const fallbackThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  // 1. oEmbed lookup (Most reliable across all YouTube layouts)
  try {
    const resp = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (resp.ok) {
      const data = await resp.json();
      return {
        videoId,
        title: data.title || 'Untitled',
        channel: data.author_name || 'Unknown',
        thumbnail: data.thumbnail_url || fallbackThumb,
      };
    }
  } catch (e) {
    console.warn('[MarkTube] oEmbed fetch failed, attempting DOM fallback:', e);
  }

  // 2. Comprehensive DOM Fallback
  let title = 'Untitled';
  let channel = 'Unknown';
  let thumbnail = fallbackThumb;

  try {
    if (cardEl?.tagName === 'YTD-WATCH-METADATA') {
      title = cardEl.querySelector('h1 yt-formatted-string, h1')?.textContent?.trim() || 'Untitled';
      channel = document.querySelector('ytd-channel-name a, #channel-name a')?.textContent?.trim() || 'Unknown';
    } else if (cardEl) {
      const titleEl =
        cardEl.querySelector('#video-title') ||
        cardEl.querySelector('yt-formatted-string#video-title') ||
        cardEl.querySelector('h3 a') ||
        cardEl.querySelector('yt-formatted-string') ||
        cardEl.querySelector('.metadata a') ||
        cardEl.querySelector('a#video-title-link');
      title = titleEl?.textContent?.trim() || titleEl?.getAttribute('title')?.trim() || 'Untitled';

      const channelEl =
        cardEl.querySelector('ytd-channel-name a') ||
        cardEl.querySelector('#channel-name a') ||
        cardEl.querySelector('.ytd-channel-name') ||
        cardEl.querySelector('#byline a') ||
        cardEl.querySelector('yt-formatted-string#text');
      channel = channelEl?.textContent?.trim() || 'Unknown';

      const imgEl = cardEl.querySelector('a#thumbnail img, img');
      thumbnail = imgEl?.src || imgEl?.getAttribute('data-thumb') || fallbackThumb;
    }
  } catch (err) {
    console.error('[MarkTube] DOM fallback failed:', err);
  }

  return { videoId, title, channel, thumbnail };
}

async function handleMark(type, cardEl, videoId, arr, storageKey) {
  const index = arr.indexOf(videoId);
  const docId = `video_${videoId}`;

  if (index >= 0) {
    arr.splice(index, 1);
    try {
      const doc = await db.get(docId);
      await db.remove(doc);
      showToast(`🗑️ Removed ${videoId} from DB`);
    } catch (e) {
      showToast(`⚠️ Removed from list: ${videoId}`);
    }
  } else {
    const meta = await extractMeta(cardEl, videoId);
    arr.push(videoId);
    try {
      await db.put({ _id: docId, type, addedAt: Date.now(), ...meta });
      showToast(`✅ Marked as ${type}`);
    } catch (err) {
      if (err.status === 409) {
        try {
          const doc = await db.get(docId);
          await db.put({ ...doc, type, ...meta });
          showToast(`🔁 Updated ${videoId} to ${type}`);
        } catch {
          showToast(`✅ Updated ${type}`);
        }
      } else {
        showToast('❌ DB Save failed!');
      }
    }
  }

  chrome.storage.local.set({ [storageKey]: arr, _mt_ts: Date.now() }, syncStorageAndUI);
}

function toggleWatched(cardEl, videoId) {
  chrome.storage.local.get([KEY_WATCHED], (res) => {
    watchedList = Array.isArray(res[KEY_WATCHED]) ? res[KEY_WATCHED].map(String) : [];
    handleMark('watched', cardEl, videoId, watchedList, KEY_WATCHED);
  });
}

function toggleImportant(cardEl, videoId) {
  chrome.storage.local.get([KEY_IMPORTANT], (res) => {
    importantList = Array.isArray(res[KEY_IMPORTANT]) ? res[KEY_IMPORTANT].map(String) : [];
    handleMark('important', cardEl, videoId, importantList, KEY_IMPORTANT);
  });
}

function toggleToWatch(cardEl, videoId) {
  chrome.storage.local.get([KEY_TOWATCH], (res) => {
    toWatchList = Array.isArray(res[KEY_TOWATCH]) ? res[KEY_TOWATCH].map(String) : [];
    handleMark('toWatch', cardEl, videoId, toWatchList, KEY_TOWATCH);
  });
}

function syncStorageAndUI() {
  chrome.storage.local.get([KEY_WATCHED, KEY_IMPORTANT, KEY_TOWATCH], (res) => {
    watchedList = Array.isArray(res[KEY_WATCHED]) ? res[KEY_WATCHED].map(String) : [];
    importantList = Array.isArray(res[KEY_IMPORTANT]) ? res[KEY_IMPORTANT].map(String) : [];
    toWatchList = Array.isArray(res[KEY_TOWATCH]) ? res[KEY_TOWATCH].map(String) : [];
    refreshPageUI();
  });
}

function injectFeedHoverButtons() {
  let cards = [
    ...document.querySelectorAll('ytd-rich-item-renderer'),
    ...document.querySelectorAll('ytd-compact-video-renderer'),
    ...document.querySelectorAll('ytd-video-renderer'),
    ...document.querySelectorAll('ytd-playlist-video-renderer'),
    ...document.querySelectorAll('ytd-grid-video-renderer'),
    ...document.querySelectorAll('ytd-playlist-panel-video-renderer'),
    ...document.querySelectorAll('.yt-lockup-view-model-wiz--horizontal'),
  ];

  cards = cards.filter(
    (c) =>
      !c.closest('ytd-reel-item-renderer') &&
      !c.closest('ytd-rich-section-renderer') &&
      !c.closest('ytd-reel-shelf-renderer') &&
      !c.classList.contains('ytd-rich-grid-slim-media')
  );

  cards.forEach((card) => {
    if (card.dataset.mtHovered) return;

    card.addEventListener('mouseenter', () => {
      let strip = card.querySelector('#btnstrip');
      if (strip) strip.remove();

      const anchor = card.querySelector('a[href*="/watch?v="]');
      const videoId = extractVideoId(anchor?.href);
      if (!videoId) return;

      strip = document.createElement('div');
      strip.id = 'btnstrip';
      strip.className = 'btnstrip visible';

      if (getComputedStyle(card).position === 'static') {
        card.style.position = 'relative';
      }

      strip.innerHTML = `
        <button class="btns btns-watched" title="Mark as Watched"></button>
        <button class="btns btns-important" title="Mark as Important"></button>
        <button class="btns btns-towatch" title="Mark for Watching"></button>
      `;

      card.appendChild(strip);

      const [btnW, btnI, btnT] = strip.querySelectorAll('.btns');

      if (btnW) {
        if (watchedList.includes(videoId)) btnW.classList.add('active');
        btnW.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleWatched(card, videoId);
          btnW.classList.toggle('active');
        });
      }

      if (btnI) {
        if (importantList.includes(videoId)) btnI.classList.add('active');
        btnI.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleImportant(card, videoId);
          btnI.classList.toggle('active');
        });
      }

      if (btnT) {
        if (toWatchList.includes(videoId)) btnT.classList.add('active');
        btnT.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleToWatch(card, videoId);
          btnT.classList.toggle('active');
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      const strip = card.querySelector('#btnstrip');
      if (strip) {
        strip.classList.remove('visible');
        setTimeout(() => {
          if (strip && strip.parentNode) strip.remove();
        }, 250);
      }
    });

    card.dataset.mtHovered = '1';
  });
}

function updateCardBorders(card, videoId) {
  const container =
    card.closest(
      'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-playlist-video-renderer, ytd-playlist-panel-video-renderer, .yt-lockup-view-model-wiz--horizontal'
    ) || card.parentElement;

  if (!container) return;

  const isWatched = watchedList.includes(videoId);
  const isImportant = importantList.includes(videoId);
  const isToWatch = toWatchList.includes(videoId);

  if (isToWatch) {
    container.style.border = '2px solid goldenrod';
    container.style.borderRadius = '10px';
  } else if (isImportant) {
    container.style.border = '2px solid red';
    container.style.borderRadius = '10px';
  } else if (isWatched) {
    container.style.border = '2px solid green';
    container.style.borderRadius = '10px';
  } else {
    container.style.border = 'none';
  }
}

function injectWatchMetadataButtons(metadataEl, videoId) {
  let container = metadataEl.previousElementSibling;
  if (!container || !container.classList.contains('myMTButtonContainer')) {
    container = document.createElement('div');
    container.className = 'myMTButtonContainer';

    const b1 = document.createElement('button');
    b1.className = 'myMTButton MtButton1';

    const b2 = document.createElement('button');
    b2.className = 'myMTButton MtButton2';

    const b3 = document.createElement('button');
    b3.className = 'myMTButton MtButton3';

    container.appendChild(b1);
    container.appendChild(b2);
    container.appendChild(b3);

    metadataEl.parentNode.insertBefore(container, metadataEl);
  }

  const [btnW, btnI, btnT] = container.querySelectorAll('button');

  btnW.onclick = () => toggleWatched(metadataEl, videoId);
  btnI.onclick = () => toggleImportant(metadataEl, videoId);
  btnT.onclick = () => toggleToWatch(metadataEl, videoId);

  const isWatched = watchedList.includes(videoId);
  const isImportant = importantList.includes(videoId);
  const isToWatch = toWatchList.includes(videoId);

  btnW.textContent = isWatched ? 'Watched' : 'Mark as Watched';
  btnW.style.backgroundColor = isWatched ? '#237b2c' : '';
  btnW.style.border = isWatched ? 'none' : '1px solid #19b929';

  btnI.textContent = isImportant ? 'IMP' : 'Mark as Important';
  btnI.style.backgroundColor = isImportant ? 'red' : '';
  btnI.style.border = isImportant ? 'none' : '1px solid rgb(255, 30, 0)';

  btnT.textContent = isToWatch ? 'Want to Watch' : 'Mark for Watching';
  btnT.style.backgroundColor = isToWatch ? 'goldenrod' : '';
  btnT.style.border = isToWatch ? 'none' : '1px solid yellow';
  btnT.style.setProperty('color', isToWatch ? 'black' : '', 'important');

  metadataEl.style.border = 'none';
}

function refreshPageUI() {
  document.querySelectorAll('ytd-watch-metadata').forEach((metaEl) => {
    const videoId = metaEl.getAttribute('video-id') || extractVideoId(window.location.href);
    if (videoId) injectWatchMetadataButtons(metaEl, videoId);
  });

  document
    .querySelectorAll(
      'div#dismissible, ytd-playlist-panel-video-renderer > #wc-endpoint, ytd-playlist-video-renderer > #content, ytd-rich-item-renderer #content'
    )
    .forEach((card) => {
      const thumbnailAnchor = card.querySelector('a#thumbnail') || card.querySelector('.reel-item-endpoint');
      const videoId = extractVideoId(thumbnailAnchor?.href);
      if (videoId) updateCardBorders(card, videoId);
    });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'TOGGLE_SIDEBAR') toggleSidebar();
});

if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      syncStorageAndUI();
    }
  });
}

syncStorageAndUI();
setInterval(refreshPageUI, 1500);
setInterval(injectFeedHoverButtons, 1500);
