# 56 — Notification Retry Baseline V1

## What exists now

The project now has a narrow retry baseline for durable Telegram service-message receipts.

### Data model

`notification_receipts` now tracks:
- `attempt_count`
- `last_attempt_at`
- `next_attempt_at`
- `max_attempts`
- `last_error_code`

### Runtime path

Two runtime paths now exist:

1. **Immediate delivery path**
   - create durable receipt
   - claim first attempt
   - send Telegram service message
   - mark `sent` or `failed`

2. **Retry path**
   - protected retry endpoint claims due retryable rows
   - retries only rows still eligible by status, due time, and max-attempt contract
   - marks `sent` on success
   - schedules `next_attempt_at` on retryable failure
   - leaves exhausted rows as `failed` with no further scheduling

## What is intentionally still missing

- user-facing receipt history
- operator UI for notifications
- broad worker/orchestration layer
- retry across unrelated product events

## Truth notes

- This is a **retry baseline**, not a guaranteed-delivery system.
- Failed receipt retry still must not roll back already-committed intro mutations.
- Receipt history remains mostly DB-level until a later step proves a user/operator surface is worth it.
