import { VIDEO_ANCHOR_SELECTOR } from './selectors.js';

const OWNED_ATTR = 'data-mt-owned';

/**
 * Scans for video anchors on the page and injects hover mark buttons
 * as a sibling of the anchor. Independent of the border system so a
 * bug in one never breaks the other.
 *
 * onMark(videoId, type) is called with type: 'watched' | 'important' | 'toWatch'.
 */
export function addFeedButtons(extractVideoId, onMark) {
  document.querySelectorAll(VIDEO_ANCHOR_SELECTOR).forEach((anchor) => {
    const videoId = extractVideoId(anchor);
    if (!videoId) return;

    let container = anchor.previousElementSibling;
    if (container?.classList.contains('mt-button-container')) return; // already injected

    container = document.createElement('div');
    container.className = 'mt-button-container';
    container.setAttribute(OWNED_ATTR, 'true');
    container.style.cssText = 'display:flex; gap:4px; padding:4px;';

    const makeButton = (label, type) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.className = `mt-button mt-button-${type}`;
      btn.style.cssText = 'border-radius:12px; padding:4px 8px; font-size:12px; cursor:pointer;';
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onMark(videoId, type);
      };
      return btn;
    };

    container.appendChild(makeButton('Watched', 'watched'));
    container.appendChild(makeButton('Important', 'important'));
    container.appendChild(makeButton('Want to Watch', 'toWatch'));

    anchor.parentNode.insertBefore(container, anchor);
  });
}
