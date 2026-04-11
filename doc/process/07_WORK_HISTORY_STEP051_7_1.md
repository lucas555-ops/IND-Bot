# 07_WORK_HISTORY_STEP051_7_1

## STEP051.7.1 — broadcast composer SQL typing hotfix

### Why this step exists

STEP051.7 added optional broadcast media and one optional inline CTA button, but the first live send path exposed a PostgreSQL type-inference failure in the outbox status update flow.

Live symptom:
- the admin `📬 Рассылка` screen showed a raw database error after send/confirm
- error text: `could not determine data type of parameter $9`

This meant the broadcast feature shape was correct, but one nullable SQL parameter in the outbox update path was still relying on implicit database inference.

### What changed

#### SQL typing hardening

The outbox insert/update path in `src/db/adminRepo.js` now explicitly types nullable parameters used by the broadcast send flow.

The hotfix adds explicit casts for nullable values in:
- `createAdminCommOutboxRecord(...)`
- `updateAdminCommOutboxRecord(...)`

The typed parameters now cover the outbox fields that may be null during queue → sending → sent transitions:
- integer counters
- cursor / batch size
- timestamptz fields such as `started_at` / `finished_at`
- text fields such as `last_error`
- bigint foreign-key references
- optional media/button metadata on insert

This removes the PostgreSQL ambiguity that produced the `$9` typing failure.

#### Operator-safe notice hardening

`formatUserFacingError(...)` now treats raw PostgreSQL typing/inference messages as internal errors.

So if a comparable DB error ever leaks again, the operator surface shows a generic admin-safe fallback instead of echoing the raw SQL diagnostic into Telegram.

### What did not change

This step intentionally does **not** change:
- broadcast draft UX
- media/button fields
- smart send routing
- audience logic
- outbox UI layout
- invite layer
- pricing layer
- command/menu polish

### Product result

The founder/operator keeps the STEP051.7 broadcast composer UX, but the send path is now hardened:
- no raw `could not determine data type of parameter ...` notice in the screen
- queue/outbox state updates can safely use nullable timestamps and error fields
- text-only, image-only, image + text, and optional-button broadcast scenarios share the same safer SQL path

### Verification

Source checks run:
- `npm run check`
- `node scripts/smoke_broadcast_contract.js`
- `node scripts/smoke_outbox_contract.js`
- `node scripts/smoke_broadcast_sql_typing_contract.js`

Live status not confirmed — manual verification required.
