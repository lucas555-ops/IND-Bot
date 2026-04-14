# STEP052.4 — Invite Rewards Read Surfaces + Founder Read Truth

## Goal
Add read-only rewards surfaces on top of STEP052.3 foundation without enabling redeem or founder mode writes.

## Shipped in this step
- `🎯 Points` screen inside the invite layer
- invite root now previews current points state
- `Performance` and `Invite history` link back to `Points`
- founder/operator `📨 Инвайты` surface now includes rewards mode, totals, top reward inviters, and recent reward events
- no redeem runtime
- no founder mode controls

## User read truth
User can now read:
- `mode`
- `pending`
- `available`
- `redeemed`
- recent reward events

Pending is explicitly non-spendable.

## Founder read truth
Founder/operator can now read from `👑 Админка -> 🧰 Операции -> 📨 Инвайты`:
- current rewards mode
- rewards config snapshot
- pending / available / redeemed totals
- confirmation candidate counts
- top reward inviters
- recent reward events

## Still intentionally not included
- redeem catalog runtime
- founder mode write controls
- settlement `pending -> available`
- cron/worker automation

## Acceptance intent
- invite layer remains bounded
- admin invite screen remains read-first
- user gets rewards truth without misleading spend expectations
- docs canon stays in `doc/...`
