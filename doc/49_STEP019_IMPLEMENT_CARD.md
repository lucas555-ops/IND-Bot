# STEP019 — data-layer split refactor / directoryRepo extraction

## Goal

Reduce the change surface of `src/db/profileRepo.js` by moving listed-profile browse/search/filter SQL into a dedicated `directoryRepo.js` module without changing user-facing behavior, storage truth, or Telegram router contracts.

## What changed

- created `src/db/directoryRepo.js`
- moved `listListedProfilesPage` and `getListedProfileCardById` into `directoryRepo.js`
- kept profile draft / snapshot / visibility / skills logic in `profileRepo.js`
- updated `src/lib/storage/directoryStore.js` to read from `directoryRepo.js`
- added `smoke:data-split` to guard the new data-layer boundary

## Out of scope

- ranking or search engine changes
- intro/contact contract changes
- monetization
- query optimization / indexing

## Acceptance

- `profileRepo.js` no longer owns listed-profile browse/search methods
- `directoryRepo.js` owns listed-profile browse/search methods
- `directoryStore.js` imports from `directoryRepo.js`
- existing browse/filter/search smoke contracts stay green
