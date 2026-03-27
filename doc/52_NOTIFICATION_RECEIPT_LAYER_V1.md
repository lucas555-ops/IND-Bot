# 52 — Notification / Receipt Layer V1

## What this layer does

This layer adds **best-effort out-of-band Telegram service messages** on top of the existing intro workflow.

Events covered in STEP020:
- `intro_request_created`
- `intro_request_accepted`
- `intro_request_declined`

## What it does not do

- does not create a chat system
- does not change intro decision truth
- does not retry failed deliveries automatically
- does not change privacy/contact rules from STEP014

## Delivery model

1. Intro mutation happens first.
2. After the mutation commits, the service attempts to claim a durable notification receipt row.
3. If the receipt event key already exists, delivery is skipped as duplicate.
4. If claimed, the bot sends a Telegram `sendMessage` service message to the counterparty.
5. Receipt status is persisted as `sent`, `failed`, or `skipped`.

## Baseline truth

- receipt delivery is **best-effort**
- intro persistence remains source of truth
- a failed receipt must not revert an already-saved intro mutation
- service messages use push surfaces instead of overwriting the active inline UI flow

## Current event coverage

### intro_request_created
Recipient gets:
- a push message announcing the request
- `View intro`
- `Open inbox`

### intro_request_accepted / intro_request_declined
Requester gets:
- a push message announcing the decision
- `View intro`

## Future work

- retry path for failed receipts
- optional receipt history surfaces
- richer service message throttling or batching if needed
