# STEP018 — bot runtime code split refactor

## Goal

Reduce the change surface of `src/bot/createBot.js` without changing user-facing contracts, storage truth, intro state machine, or Telegram router behavior.

## What changed

- split the bot runtime into dedicated composers:
  - `homeComposer`
  - `profileComposer`
  - `directoryComposer`
  - `introComposer`
  - `textComposer`
- moved surface-building logic into `src/bot/surfaces/appSurfaces.js`
- moved reusable notice formatting into `src/bot/utils/notices.js`
- moved pending-input cleanup into `src/bot/utils/pendingInputs.js`
- kept `createBot.js` as the slim assembly/root wiring file

## Out of scope

- data-layer split (`profileRepo.js` vs `directoryRepo.js`)
- intro contract changes
- messaging / receipt flows
- monetization

## Acceptance

- `createBot.js` becomes slim and orchestration-only
- existing callback namespaces do not change
- existing smoke contracts stay green
- no user-facing runtime behavior changes
