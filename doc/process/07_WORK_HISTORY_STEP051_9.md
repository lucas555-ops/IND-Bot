# 07_WORK_HISTORY_STEP051_9

## STEP
STEP051.9 — Broadcast Recovery Actions

## Goal
Close the next operator gap in the broadcast loop by adding direct recovery actions for failed and retry_due delivery subsets without changing the composer, the admin IA, or the existing outbox truth model.

## What changed
- added narrow recovery actions for broadcast tasks: `🔁 Повторить failed` and `🔁 Повторить retry_due`
- recovery actions are available from the main `📬 Рассылка` screen when the latest task has recoverable recipients
- recovery actions are also available from the broadcast outbox record and the broadcast failures surface
- recovery no longer relies on re-expanding the original audience; it now targets the existing `admin_broadcast_delivery_items` subset for the specific task
- sent recipients are excluded from recovery attempts because recovery only loads delivery items currently marked `failed` or `retry_due`
- the broadcast outbox record now shows separate `Failed`, `Retry due`, and `Исчерпано` counts for a clearer operator readout
- added a narrow storage/service helper to re-run delivery for a selected subset of broadcast delivery items and update the existing outbox record status/counters
- added operator-safe notices for launched recovery, empty recovery sets, and failed recovery attempts

## Files touched
- `src/db/adminRepo.js`
- `src/lib/storage/adminStore.js`
- `src/bot/composers/operatorComposer.js`
- `src/bot/surfaces/adminSurfaces.js`
- `scripts/smoke_broadcast_recovery_contract.js`
- `doc/00_CURRENT_STATE.md`
- `doc/process/07_WORK_HISTORY_STEP051_9.md`

## Validation
- `npm run check`
- `node scripts/smoke_broadcast_contract.js`
- `node scripts/smoke_broadcast_status_closure_contract.js`
- `node scripts/smoke_outbox_contract.js`
- `node scripts/smoke_broadcast_recovery_contract.js`

## Notes
- this step does not introduce a background worker or retry scheduler
- this step does not redesign outbox storage or composer UX
- recovery remains synchronous for now and is intended as an operator-first bridge until the future background delivery step
