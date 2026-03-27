# WORK HISTORY — STEP016

## Title

STEP016 — anti-abuse / retry / dedupe hardening

## What changed

- added `telegram_update_receipts` for DB-backed webhook retry/dedupe
- added `user_action_guards` for short-lived intro send / intro decision throttles
- hardened `api/webhook.js` to reject malformed updates and short-circuit duplicate `update_id` deliveries
- kept intro send / decision behavior truthful via throttled outcomes instead of fake success
- updated health/env/docs surfaces to reflect STEP016 baseline

## Why this STEP exists

By STEP015 the intro flow had real persistence, decisions, contact gating, and detail surfaces.
The next narrow risk was duplicate webhook delivery and repeated callback taps, especially under serverless retries.

## What was intentionally not done

- no Redis/KV rewrite
- no global rate limiter
- no moderation/admin layer
- no messaging/premium changes

## Next recommended step

STEP017 — intro retention / history safety baseline
