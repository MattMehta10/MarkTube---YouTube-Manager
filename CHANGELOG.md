# Changelog

All notable changes to this project are logged here. Newest at top.

## [Unreleased]

### Added
- **Milestone 1 — JSON Export/Import:** Local JSON backup & restore pipeline (`src/sidebar/utils/exportImport.js`) with timestamp-based merge, batch chunking, progress callbacks, and live YouTube card border re-application via `MT_SYNC_STORAGE_DATA` messaging.
- **Settings UI Refresh:** Added Import Data button, hidden file picker, and progress feedback toast; redesigned accordion drop-downs with dark mode glassmorphic styling and thematic section icons.
- **Navigation UX:** Updated status icon in `Nav.jsx` from misleading cloud sync to local database status indicator (`<FiDatabase />`).

### Fixed
- Manifest/build filename mismatch that broke sidebar rendering (manifest referenced `mainNEWTEST.js`/`4rthcontent.js`, vite configs built `main.js`/`content.js`). Vite output names now match manifest references exactly — see `docs/ARCHITECTURE.md`.

### Changed
- Migrated from ad-hoc "build → manually rename → paste into test folder" workflow to a single gitignored `dist/` output, built fresh every time.

## [0.1.0] — pre-migration baseline
Carried over from the original `reactsidebar extension` project (see old repo, not tracked here): hover buttons, border states, sidebar with Overview/Library/Settings, PouchDB storage, oEmbed metadata fetch.
