# 59_STEP024_IMPLEMENT_CARD

## Goal

Add a lightweight operator/admin diagnostics surface over the STEP023 read-only notification diagnostics contract, without broadening into resend mutations, a general notification center, or a large admin rewrite.

## Scope

In scope:
- allowlisted operator gate for diagnostics surfaces
- `/ops` Telegram command
- operator-only home entrypoint
- bucket-filtered diagnostics screen for `retry_due`, `failed`, and `exhausted`
- per-intro drilldown from recent diagnostics rows
- docs sync
- smoke coverage for the new operator surface

Out of scope:
- resend / requeue mutation path
- analytics warehouse
- broad admin console
- end-user notification history

## Files

- `.env.example`
- `api/health.js`
- `docs/00_CURRENT_STATE.md`
- `docs/15_NEW_CHAT_HANDOFF.md`
- `docs/36_NEXT_STEPS_ROADMAP.md`
- `docs/59_STEP024_IMPLEMENT_CARD.md`
- `docs/60_OPERATOR_DIAGNOSTICS_SURFACE_V1.md`
- `docs/README.md`
- `docs/process/07_WORK_HISTORY_STEP024.md`
- `package.json`
- `scripts/smoke_env_contract.js`
- `scripts/smoke_operator_diagnostics_surface_contract.js`
- `src/bot/composers/operatorComposer.js`
- `src/bot/createBot.js`
- `src/bot/surfaces/appSurfaces.js`
- `src/config/env.js`
- `src/lib/storage/notificationStore.js`
- `src/lib/telegram/render.js`

## Acceptance

STEP024 is done when:
- `/ops` opens a read-only operator diagnostics surface for allowlisted Telegram user IDs
- home exposes an operator-only entrypoint
- the surface shows bucket counts plus recent `retry_due`, `failed`, and `exhausted` rows
- the surface supports per-intro drilldown
- no resend/requeue mutation path is introduced
- docs canon moves to STEP024
- the new smoke contract passes
