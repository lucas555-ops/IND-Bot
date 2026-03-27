# STEP016 — Anti-abuse / retry / dedupe hardening v1

## What this adds

STEP016 adds two narrow guard rails:

1. **Webhook update receipts**
   - DB-backed receipt claim by Telegram `update_id`
   - duplicate updates return early and do not re-run the bot handler

2. **Short-lived intro action throttles**
   - `intro_send:{user}:{targetProfile}`
   - `intro_decision:{user}:{introRequest}`
   - repeated taps inside a short window return a truthful throttle outcome

## What this does not add

- no Redis/KV requirement
- no ban system
- no cross-feature global limiter
- no anti-spam scoring
- no notification fanout

## Degrade behavior

- if DB is not configured, webhook dedupe degrades open and the repo must stay honest about that
- if DB is configured, intro send/decision throttles are DB-backed and durable across serverless invocations

## Truth note

This is hardening, not production proof.

**live status not confirmed — manual verification required**
