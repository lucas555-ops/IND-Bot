# 55 — STEP022 IMPLEMENT CARD

## Goal

Add a truthful notification retry baseline on top of the existing STEP020 best-effort receipt layer, without broadening into a full notification center.

## Scope

In scope:
- `notification_receipts` attempt metadata
- due retry claim logic
- protected runtime retry endpoint
- retry scheduling for failed sends
- docs + smoke updates

Out of scope:
- user-facing receipt history
- retry worker orchestration beyond one protected endpoint
- notification center UX
- retry for unrelated product events

## Files

- `migrations/009_notification_retry_baseline.sql`
- `src/config/env.js`
- `src/db/notificationRepo.js`
- `src/lib/storage/notificationStore.js`
- `api/cron/notification-retry.js`
- `scripts/smoke_notification_retry_contract.js`
- `README.md`
- `docs/README.md`
- `docs/00_CURRENT_STATE.md`
- `docs/15_NEW_CHAT_HANDOFF.md`
- `docs/36_NEXT_STEPS_ROADMAP.md`
- `docs/55_STEP022_IMPLEMENT_CARD.md`
- `docs/56_NOTIFICATION_RETRY_BASELINE_V1.md`
- `docs/process/07_WORK_HISTORY_STEP022.md`

## Acceptance

- failed or stale pending notification receipts can be claimed for retry
- each retry increments `attempt_count` and stamps `last_attempt_at`
- retryable failures schedule `next_attempt_at`
- terminal exhaustion clears further retry scheduling
- retry execution is protected by a secret-bearing endpoint
- intro mutation truth remains separate from notification delivery truth

## QA

- `npm run check`
- `npm run smoke:receipts`
- `npm run smoke:notification-retry`
- `npm run smoke:router`

## Artifacts

- FULL ZIP
- Hotfix ZIP
- PATCH
- changed files list
- QA checklist
