# 54 — Notification Retry / Receipt History SPIKE

## Current source-confirmed baseline

The project already has:
- durable `notification_receipts`
- event-key dedupe
- best-effort Telegram service delivery for intro create / accept / decline
- persisted delivery states: `pending`, `sent`, `failed`, `skipped`
- a rule that failed receipt delivery must not roll back the already-committed intro mutation

This means the current layer is truthful as a **best-effort push layer**, not as a guaranteed delivery system.

## What is still missing

- no retry worker
- no backoff model
- no max-attempt contract
- no `attempt_count`
- no `next_attempt_at`
- no operator or user receipt-history surface
- no requeue decision for `failed` rows
- no terminal distinction between transient failure and permanent failure

## Failure modes observed from the current design

### 1. Failed rows stay failed forever
Today a `failed` row is durable, but nothing reprocesses it.

### 2. Pending rows are not used as a queue
`pending` is only an insertion-time state before send/mark.
It is not yet a durable due-for-retry queue state.

### 3. There is no attempt history
We know the final stored status, but not:
- how many attempts happened
- when the last attempt happened
- when the next attempt should happen

### 4. Receipt history is DB-only
The history exists in rows, but there is no product or operator surface for reviewing it.

## Options considered

### Option A — keep best-effort only and do nothing
**Reject as next step.**
This keeps truth simple, but leaves failed receipts permanently stranded.

### Option B — synchronous immediate retry inside the same request path
**Reject.**
This would bloat the mutation path and increase webhook/request latency.
It also risks retry storms for transient Telegram/API failures.

### Option C — DB-backed retry worker with narrow cron scan
**Recommend for STEP022.**
This keeps intro mutation truth separate from notification delivery truth.
It matches the current serverless shape better than inline retries.

### Option D — build user-visible receipt history before retry
**Defer.**
History without retry is useful for operators, but weak as the immediate next runtime improvement.
Retry closes a more important correctness gap.

## Recommended corridor

### STEP022 — notification retry baseline
Add:
- `attempt_count`
- `last_attempt_at`
- `next_attempt_at`
- `last_error_code` or normalized failure hint
- `max_attempts` rule in code, not necessarily per-row config
- narrow cron/scan endpoint that claims due failed rows and retries them
- idempotent claim/mark contract so the same receipt is not retried concurrently

Do **not** add user-facing history yet.
Do **not** broaden into a general notification center.

### STEP023 — receipt history/operator visibility baseline
After retry is truthful:
- operator-facing read model or debug query path
- optional per-intro receipt summary for diagnostics
- only then consider whether any end-user receipt history is actually useful

## Data model recommendation for STEP022

Keep the existing `notification_receipts` table and extend it.

Recommended additions:
- `attempt_count integer not null default 0`
- `last_attempt_at timestamptz`
- `next_attempt_at timestamptz`
- `last_error_code text`

Keep existing statuses if possible.
Do not introduce a complex queue-state machine unless the narrow retry baseline proves insufficient.

## Runtime recommendation for STEP022

Use a narrow cron-style scan:
1. select a small batch of due retryable rows
2. claim them transactionally
3. attempt delivery
4. mark `sent` on success
5. increment `attempt_count` and set `next_attempt_at` on retryable failure
6. mark terminal failure only after max attempts

This keeps the current service-message model intact.

## Truth notes

- **Source-confirmed:** current repo supports best-effort receipts with durable event-key dedupe and final delivery-state persistence.
- **Live-confirmed:** source-level checks exist; production delivery behavior still is not proven from this repo snapshot.
- **Inference:** a narrow retry worker is the best next runtime step.
- **Blocked / unconfirmed:** whether end-user receipt history is worth product surface area is still not confirmed.

## Recommendation

Take **STEP022 — notification retry baseline** next.
Keep receipt history as a follow-up after retry truth exists.
