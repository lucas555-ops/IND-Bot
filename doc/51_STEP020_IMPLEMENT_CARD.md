# STEP020 — notification / receipt layer

## Goal
Add a narrow service-message layer on top of the existing intro workflow without turning the bot into a chat system.

## Scope
- durable `notification_receipts`
- best-effort Telegram service messages for:
  - intro request created → recipient
  - intro accepted → requester
  - intro declined → requester
- per-event receipt dedupe
- receipt delivery status persistence
- push-message keyboards that deep-link back into existing inbox/detail surfaces

## Non-goals
- chat / reply threads
- receipt retry worker
- premium / monetization
- broad notification center

## Acceptance
- intro creation can trigger a recipient service message
- intro decisions can trigger requester service messages
- duplicate receipt sends are deduped by durable event key
- failed sends do not roll back the intro mutation itself
- repo docs and smoke baseline are updated to STEP020
