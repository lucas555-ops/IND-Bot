# 60_OPERATOR_DIAGNOSTICS_SURFACE_V1

## What exists now

STEP024 adds a lightweight operator/admin diagnostics surface inside Telegram on top of the STEP023 read-only notification diagnostics contract.

## Access model

The surface is gated by:
- `OPERATOR_TELEGRAM_USER_IDS`
- operator-only home entrypoint
- `/ops` command

Unauthorized Telegram users do not receive operator data.

## Surface behavior

The new surface is read-only. It shows:
- aggregate receipt counts
- retry-due rows
- recent failed rows
- recent exhausted rows
- per-intro drilldown using intro request IDs

The surface does not add:
- resend buttons
- requeue buttons
- end-user notification history
- broad admin/moderation screens

## Truth notes

- Durable receipt truth still lives in `notification_receipts`.
- Retry truth still lives in the STEP022 write-path.
- STEP024 only adds operator usability over existing read truth.
- Live delivery and deploy proof are still not confirmed until STEP025 closes the release gate.
