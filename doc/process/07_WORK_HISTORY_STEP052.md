# 07_WORK_HISTORY_STEP052

## STEP
STEP052 — Invite Module A Uplift

## Goal
Apply the reusable invite suite to Intro Deck at safe Module A depth: keep the existing Telegram-native invite layer, but split the overloaded invite screen into a bounded hub plus separate `Performance` and paged `Invite history` screens, and add one read-only founder/operator invite snapshot inside admin operations.

## What changed
- kept the existing Intro Deck invite core (`Share invite`, `Link + copy`, `Invite card`) intact
- tightened the main invite screen into a cleaner bounded hub with a compact snapshot and recent invited contacts instead of mixing every detail into one screen
- added `📊 Performance` for invite quality readout: invited, activated, activation rate, activation rule, joined-from truth, and recent contacts
- added paged `📋 Invite history` so invite details no longer overload the main invite hub
- defined the Intro Deck activation rule for invite-quality readout as: `connected LinkedIn or started a profile`
- extended invite storage/repo with paged history loading and admin invite snapshot loading
- added one read-only founder/operator `📨 Инвайты` surface inside `🧰 Операции`
- the new admin invite surface shows total invites, activated invites, activation rate, source split, top inviters, and recent invites
- rewards / redeem / points were intentionally not transplanted into Intro Deck in this step

## Files touched
- `src/db/inviteRepo.js`
- `src/lib/storage/inviteStore.js`
- `src/lib/telegram/render.js`
- `src/bot/composers/inviteComposer.js`
- `src/bot/createBot.js`
- `src/bot/surfaces/adminSurfaces.js`
- `src/bot/composers/operatorComposer.js`
- `scripts/smoke_invite_contract.js`
- `scripts/smoke_invite_admin_contract.js`
- `doc/00_CURRENT_STATE.md`
- `doc/process/07_WORK_HISTORY_STEP052.md`

## Validation
- `npm run check`
- `node scripts/smoke_invite_contract.js`
- `node scripts/smoke_invite_admin_contract.js`

## Notes
- this is a Module A application only; no rewards, redeem, or founder mode switching are enabled
- this step keeps Home IA stable and adapts the suite to the current host architecture instead of forcing a new `More` layer
- admin invite visibility is intentionally read-only in this step so the host bot gets invite operations truth without growth-bait mechanics or new reward liabilities
