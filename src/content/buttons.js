import { FEED_CARD_SELECTORS } from './selectors.js';
import { markAsOwned } from './borders.js';

/**
 * ADDS HOVER BUTTONS ON FEED VIDEOS
 * Adds action buttons (Watched, Important, Want to Watch) when hovering over video cards
 */
export function addFeedButtons(getLists, extractVideoId, handlers) {
  // Playlist feed exclusion: do not add video hover buttons on playlist cards feed
  if (location.pathname === '/feed/playlists') return;

  const { toggleWatched, toggleImportant, toggleToWatch } = handlers;

  let rawNodes = [];
  FEED_CARD_SELECTORS.forEach((sel) => {
    rawNodes.push(...document.querySelectorAll(sel));
  });

  // 1. Remove duplicate nodes
  let vidbox = Array.from(new Set(rawNodes));

  // 2. Exclude child nodes if their parent host element is already in vidbox
  //    (Prevents double button injection when ytd-rich-item-renderer wraps yt-lockup-view-model)
  vidbox = vidbox.filter(
    (el) => !vidbox.some((other) => other !== el && other.contains(el))
  );

  // 3. Exclude ad slots, playlist collection stacks, and shelf section wrappers
  vidbox = vidbox.filter(
    (el) =>
      !el.querySelector('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer') &&
      !el.querySelector('yt-collection-thumbnail-view-model, [class*="CollectionStack"]') &&
      !el.tagName.toLowerCase().includes('shelf') &&
      !el.closest('ytd-reel-item-renderer') &&
      !el.closest('ytd-reel-shelf-renderer') &&
      !el.closest('ytd-ad-slot-renderer') &&
      !el.classList.contains('ytd-rich-grid-slim-media')
  );

  vidbox.forEach((el) => {
    if (el.dataset.mtHovered) return;

    el.addEventListener('mouseenter', () => {
      // Remove any existing orphaned btnstrip inside this container
      el.querySelectorAll('#btnstrip, .btnstrip').forEach((b) => b.remove());

      const anchor = el.querySelector('a[href*="/watch"]');
      if (!anchor) return;
      if (anchor.href.includes('/playlist?')) return;
      if (el.querySelector('yt-collection-thumbnail-view-model, [class*="CollectionStack"]')) return;

      const videoId = extractVideoId(anchor.href);
      if (!videoId) return;

      // Always fetch fresh list arrays at the moment of hover!
      const { watchedVideos = [], impVideos = [], toWatchVideos = [] } = getLists() || {};

      const btnstrip = document.createElement('div');
      btnstrip.id = 'btnstrip';
      btnstrip.className = 'btnstrip visible';
      btnstrip.innerHTML = `
        <div class="btns" title="Mark as Watched"></div>
        <div class="btns" title="Mark as Important"></div>
        <div class="btns" title="Want to Watch"></div>
      `;

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
          toggleWatched(el, videoId);
        });
      }

      if (btnI) {
        if (impVideos.includes(videoId)) btnI.classList.add('active');
        btnI.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleImportant(el, videoId);
        });
      }

      if (btnT) {
        if (toWatchVideos.includes(videoId)) btnT.classList.add('active');
        btnT.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleToWatch(el, videoId);
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      el.querySelectorAll('#btnstrip, .btnstrip').forEach((btnstrip) => {
        btnstrip.classList.remove('visible');
        setTimeout(() => {
          if (btnstrip && btnstrip.parentNode) btnstrip.remove();
        }, 200);
      });
    });

    el.dataset.mtHovered = '1';
  });
}

/**
 * CREATES THREE ACTION BUTTONS FOR CURRENTLY PLAYING VIDEO
 * Injects buttons (Watched, Important, Want to Watch) with dynamic styling above ytd-watch-metadata
 */
export function createOrUpdateWatchedButton(el, videoId, watchedList, importantList, toWatchList, handlers) {
  const { toggleWatched, toggleImportant, toggleToWatch } = handlers;

  let container = el.previousElementSibling;
  if (!container || !container.classList.contains('myMTButtonContainer')) {
    container = document.createElement('div');
    container.className = 'myMTButtonContainer';

    const btnW = document.createElement('button');
    btnW.className = 'myMTButton MtButton1';

    const btnI = document.createElement('button');
    btnI.className = 'myMTButton MtButton2';

    const btnT = document.createElement('button');
    btnT.className = 'myMTButton MtButton3';

    container.appendChild(btnW);
    container.appendChild(btnI);
    container.appendChild(btnT);

    if (el.parentNode) {
      el.parentNode.insertBefore(container, el);
    }
  }

  const [btnW, btnI, btnT] = container.querySelectorAll('button');

  btnW.onclick = () => toggleWatched(el, videoId);
  btnI.onclick = () => toggleImportant(el, videoId);
  btnT.onclick = () => toggleToWatch(el, videoId);

  const isWatched = watchedList.includes(videoId);
  const isImp = importantList.includes(videoId);
  const isToWatch = toWatchList.includes(videoId);

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
