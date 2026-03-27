# 16_RELEASE_READINESS_CHECKLIST

This project is not release-ready yet.
This checklist exists now to prevent future “we'll define release later” drift.

## Product truth

- [ ] Auth flow is manually verified against a real LinkedIn app
- [ ] Current listed/active visibility behavior is manually verified
- [ ] Intro request flow is verified end to end in deployed environment
- [ ] All placeholder surfaces are explicitly documented

## Runtime / env

- [ ] `DATABASE_URL` configured
- [ ] LinkedIn client env configured
- [ ] callback URL configured in LinkedIn app
- [ ] degraded behavior without optional envs remains truthful

## Smoke

- [ ] `npm run check`
- [ ] all current smoke scripts pass
- [ ] smoke set is documented in current handoff

## Docs

- [ ] `00_CURRENT_STATE.md` matches the actual repo baseline
- [ ] feature baseline docs match runtime behavior
- [ ] current handoff is refreshed
- [ ] recent work history is complete

## Not release-ready while any of these are true

- [ ] accept/decline/reply/chat intro flow is still undefined but implied in UX copy
- [ ] premium/admin surfaces exist only as ideas
- [ ] official/manual runtime verification has not been done


## STEP024.5 additions

- Set `CRON_SECRET` for Vercel cron bearer auth.
- Keep `NOTIFICATION_RETRY_SECRET` only for manual curl/backward-compatible retry execution.
- Apply `migrations/011_notification_receipts_retention_policy_and_guard_cleanup.sql` after 001-010.
- Verify `/api/cron/notification-retry` accepts both `GET + Authorization: Bearer <CRON_SECRET>` and `POST + x-notification-retry-secret`.
- Verify retry path reports `guardCleanup` in JSON output.
