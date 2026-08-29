# Migrating components from the old project

Your old components are genuinely solid — the goal here is placement + a few fixes, not rewrites.

## Copy as-is into `src/sidebar/components/`

These already import `../utils/pouch` and `../Wrapper`, which match this repo's structure exactly (`src/sidebar/utils/pouch.js` and `src/sidebar/Wrapper.jsx`), so they should work with **no import changes**:

- `Library.jsx`
- `Search.jsx`
- `Nav.jsx`
- `Stats.jsx`
- `VideoCont.jsx`
- `Playlist.jsx`
- `Notify.jsx` + `Notify.css`

## Copy with one fix needed

- **`Footer.jsx`, `Stats.jsx`** — both use a `getExtURL(path)` helper (`chrome.runtime.getURL(path)`). Update the paths it points to: static assets now live in `public/`, copied to `dist/public/` on every build (see `scripts/copy-static.js`). So `getExtURL('images/logo.png')` should become `getExtURL('public/logo.png')`, matching wherever you actually place the file in `public/`.
- **`Settings.jsx`** — works as-is; `exportData()` already reads straight from `db.allDocs`, which matches this repo's PouchDB setup.

## Needs a decision before porting

- **`Login.jsx`** — currently a frontend-only placeholder (no real auth, `handleGoogleLogin` is an `alert()`). Per `docs/PRD.md`, accounts are explicitly out of scope until Phase 3. Recommendation: keep the file but don't wire it into `App.jsx` routes yet, so it doesn't imply working auth to a user who tries it.
- **`ProfOption.jsx`** — currently an empty placeholder div. Leave stubbed until it has a real purpose.

## Wiring into App.jsx

Once components are copied into `src/sidebar/components/`, uncomment the corresponding import + route/render lines in `App.jsx` (they're pre-stubbed with comments showing exactly where each one goes).

## Assets checklist

Move these into `public/` (they'll be available at `chrome.runtime.getURL('public/<filename>')` after build):
- Fonts referenced in `stats.css` (`The Northern Block Ltd - Typold Bold.otf`)
- `Streak Fire.json` (Lottie animation) — note: `Stats.jsx` currently imports this directly (`import animationdata from '../assets/Streak Fire.json'`), which works fine as a bundled JSON import, no change needed
- Logo/profile images — currently loaded from Cloudinary URLs in `Nav.jsx`/`Footer.jsx`/`Settings.jsx`. These work fine as external URLs; only move them to `public/` if you want the extension to work fully offline.

## Content script logic (border/button system)

The old minified `4rthcontent.js` bundled working border + button + oEmbed logic — the actual behavior was fine, only the *filenames* were broken (see `docs/ARCHITECTURE.md`). Port the real logic into:
- `src/content/borders.js` → fill in `getVideoState`/`extractVideoId` wiring from `index.js` using real PouchDB queries (currently stubbed with TODOs)
- `src/content/buttons.js` → button injection logic is already ported and functional
- Add the oEmbed fetch (from the old bundle's `ff()` function) as `src/content/metadata.js` — fetch title/channel/thumbnail via YouTube oEmbed, fall back to DOM scraping if it fails
