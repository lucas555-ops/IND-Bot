# STEP018 — Code split refactor v1

STEP018 is a structure-only refactor over the STEP017 runtime.

## Truth

This step does **not** change:
- auth flow
- persistence rules
- directory visibility logic
- intro request state machine
- post-decision contact contract
- anti-abuse / retry / dedupe behavior
- intro retention / history safety

It changes only the runtime layout.

## New runtime layout

- `src/bot/createBot.js` — orchestration only
- `src/bot/composers/homeComposer.js`
- `src/bot/composers/profileComposer.js`
- `src/bot/composers/directoryComposer.js`
- `src/bot/composers/introComposer.js`
- `src/bot/composers/textComposer.js`
- `src/bot/surfaces/appSurfaces.js`
- `src/bot/utils/notices.js`
- `src/bot/utils/pendingInputs.js`

## Why this is useful

- lowers merge risk in `createBot.js`
- makes profile/directory/intro work easier to isolate
- prepares the repo for the next narrow split in the data layer

## Remaining refactor debt

- `src/db/profileRepo.js` still mixes profile truth with directory browse/search SQL
- that debt is intentionally deferred to the next narrow refactor step
