# WORK HISTORY — STEP020

## Title
Notification / receipt layer

## What changed
- added durable `notification_receipts`
- added best-effort Telegram service messages for intro create / accept / decline events
- added receipt delivery persistence and dedupe by event key
- added notification render helpers and smoke coverage

## Why
The intro workflow already had persistence, decisions, contact contract, detail surfaces, and retry/dedupe guards. The next narrow layer was non-destructive service messaging.

## What did not change
- no chat flow
- no reply thread
- no monetization
- no retry worker for failed notifications
- no change to privacy-first contact contract
