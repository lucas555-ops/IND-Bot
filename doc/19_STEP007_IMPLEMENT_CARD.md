# STEP007_IMPLEMENT_CARD

## Goal

Add the first public browse surface for directory-ready profiles without jumping into search, premium, or contact actions.

## Scope

- home entrypoint to directory
- public list surface for `listed + active` profiles only
- public profile card surface
- narrow pagination baseline
- empty state and degraded state handling
- docs sync and smoke coverage

## Files changed

- `src/bot/createBot.js`
- `src/db/profileRepo.js`
- `src/lib/storage/directoryStore.js`
- `src/lib/telegram/render.js`
- `scripts/smoke_directory_contract.js`
- `package.json`
- `README.md`
- `docs/00_CURRENT_STATE.md`
- `docs/19_STEP007_IMPLEMENT_CARD.md`
- `docs/20_PUBLIC_DIRECTORY_BASELINE_V1.md`
- `docs/process/07_WORK_HISTORY_STEP007.md`

## Acceptance

- Home shows a browse entrypoint when persistence is enabled.
- Directory list only includes profiles with `visibility_status = listed` and `profile_state = active`.
- Directory card preserves return-to-page behavior.
- Empty directory state is explicit.
- Persistence-disabled state is explicit.
- No search/filter logic is added yet.

## QA

- `npm run check`
- `npm run smoke:env`
- `npm run smoke:auth`
- `npm run smoke:router`
- `npm run smoke:storage`
- `npm run smoke:profile`
- `npm run smoke:skills`
- `npm run smoke:directory`

## Next step

STEP008 — directory filters baseline / industry + skills browse narrowing
