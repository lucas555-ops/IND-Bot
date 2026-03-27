# 58 — Notification Receipt History / Operator Diagnostics Baseline V1

## What exists now

The project now has a narrow read-only operator truth layer on top of durable notification receipts and retry metadata.

### Data / query model

`notification_receipts` remains the durable source of truth.

STEP023 adds:
- recent receipt history query path
- derived operator buckets
- per-intro summary query path
- protected read-only diagnostics endpoint

### Operator buckets

The read model exposes these operator-readable buckets:
- `sent`
- `failed`
- `skipped`
- `retry_due`
- `exhausted`

These are derived from durable receipt fields rather than stored as a second source of truth.

### Runtime path

New protected route:
- `GET /api/ops/notification-receipts`

Protected by:
- `x-notification-ops-secret`
- `NOTIFICATION_OPS_SECRET`

Supported filters:
- `intro_request_id`
- `bucket`
- `limit`

Response includes:
- bucket counts
- recent receipt rows
- per-intro summary when `intro_request_id` is provided

## What is intentionally still missing

- end-user receipt history inside Telegram
- resend/requeue mutations from the diagnostics endpoint
- broad admin dashboard
- analytics pipeline
- notification center UX

## Truth notes

- STEP023 is a read-only diagnostics baseline, not a full observability platform.
- Retry truth still lives in STEP022 write-path logic.
- Receipt diagnostics do not make live delivery verified; deployment proof is still required.
