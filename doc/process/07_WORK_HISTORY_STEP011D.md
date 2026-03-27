# WORK HISTORY — STEP011D

## Title

STEP011D — webhook secret token guard

## Why this step happened

A repo-level audit identified that `api/webhook.js` accepted any POST body without verifying the Telegram webhook secret header. That was a real ingress gap and more urgent than new product UX.

## What changed

- added `TELEGRAM_WEBHOOK_SECRET` to `.env.example`
- extended env/public flags with webhook secret readiness
- hardened `api/webhook.js` to fail closed when the secret is missing or mismatched
- added webhook secret smoke coverage

## What this step did not do

- no rate limiting
- no retry dedupe
- no setWebhook automation
- no intro workflow changes

## Next recommended step

STEP012 — intro inbox actions baseline / accept-decline placeholder rows
