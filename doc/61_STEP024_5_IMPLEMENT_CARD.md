# 61_STEP024_5_IMPLEMENT_CARD

## STEP024.5 — micro-hardening / deploy-readiness gap close

### Goal
Close narrow infra gaps before STEP025 live verification without expanding user-facing UX.

### Scope
- shared secret compare utility
- dual-mode retry auth: Vercel cron bearer + manual retry secret
- cron config in `vercel.json`
- retention-safe `notification_receipts.recipient_user_id`
- retry-path runtime guard cleanup
- docs/env/smoke refresh

### Acceptance
- secret compare is shared
- retry route accepts `GET + Authorization: Bearer <CRON_SECRET>` and `POST + x-notification-retry-secret`
- `vercel.json` schedules `/api/cron/notification-retry`
- notification receipt recipient FK no longer cascade-deletes history
- retry path cleans expired runtime guards and reports cleanup summary
- docs canon advances to STEP024.5
