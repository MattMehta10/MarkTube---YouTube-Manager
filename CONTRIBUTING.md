# Contributing (workflow rules, even solo)

## Branches
- `main` is always in a state you could load into Chrome right now. Never commit broken code directly to it.
- Work in `feature/<short-description>` (e.g. `feature/library-search`) or `fix/<short-description>`.
- Merge into `main` only after you've built and manually tested the change in Chrome.

## Commits
- One logical change per commit. "fix stuff" is not a commit message.
- Write commit messages for future-you in 3 months, not present-you who remembers everything right now.
- Good: `fix: sidebar iframe loaded stale filename after vite output rename`
- Bad: `fix`

## Before merging a change that touches the content script
1. Test on at least: home feed, a watch page, search results, one channel page.
2. Check the browser console for selector warnings (see `docs/SELECTOR_MAP.md` health-check).
3. If you changed a selector, update `docs/SELECTOR_MAP.md` in the same PR/commit — the doc and code drift apart otherwise.

## Before merging a change that touches manifest.json or a vite config
Run a full `npm run build` and reload the unpacked extension from `dist/` — filename mismatches between manifest and build output are silent failures (this killed the last version). Never assume; reload and check the sidebar actually opens.

## Issues
Log bugs and ideas as GitHub issues, even solo — this is what turns "I vaguely remember something was broken" into an actual prioritized list instead of it living only in your head.

## Releases
Tag a version (`v0.1.0`, `v0.2.0`...) once a set of Phase checkboxes in `docs/ROADMAP.md` are done and tested. This gives you a known-good point to roll back to if a later change breaks something.
