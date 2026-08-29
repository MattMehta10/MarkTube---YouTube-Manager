/**
 * Resolves static asset paths for Chrome Extension environment.
 * Falls back to relative path if chrome.runtime is unavailable (e.g. unit tests or standard browser dev).
 * @param {string} path - Relative path to asset inside public directory (e.g. 'logo.png' or 'graph.png')
 * @returns {string} Fully resolved extension URL or fallback path
 */
export function getExtURL(path) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    return chrome.runtime.getURL(`public/${cleanPath}`);
  }
  return `/${cleanPath}`;
}
