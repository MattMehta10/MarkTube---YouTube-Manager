# Changelog

All notable changes to this project are logged here. Newest at top.

## [Unreleased]
### Fixed
- Manifest/build filename mismatch that broke sidebar rendering (manifest referenced `mainNEWTEST.js`/`4rthcontent.js`, vite configs built `main.js`/`content.js`). Vite output names now match manifest references exactly — see `docs/ARCHITECTURE.md`.

### Changed
- Migrated from ad-hoc "build → manually rename → paste into test folder" workflow to a single gitignored `dist/` output, built fresh every time.

## [0.1.0] — pre-migration baseline
Carried over from the original `reactsidebar extension` project (see old repo, not tracked here): hover buttons, border states, sidebar with Overview/Library/Settings, PouchDB storage, oEmbed metadata fetch.
