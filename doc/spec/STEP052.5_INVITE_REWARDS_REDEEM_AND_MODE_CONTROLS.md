# STEP052.5 — Invite Rewards Redeem Foundation + Founder Mode Controls

## Goal
Turn the STEP052.3 + STEP052.4 rewards corridor into an operationally usable loop without broad rewrites.

This step adds:
- bounded redeem runtime for Pro
- founder/operator mode controls on the existing admin invite surface
- mode audit trail
- reuse of the canonical Pro subscription rail

## Shipped in this step
- `✨ Redeem for Pro` flow inside invite rewards surfaces
- starter catalog:
  - `100 points -> 7 days Pro`
  - `250 points -> 30 days Pro`
- confirm step with redemption request record before final spend
- redeem completion path writes redemption + ledger debit + Pro extension truth
- founder/operator mode buttons on `👑 Админка -> 🧰 Операции -> 📨 Инвайты`
- recent mode audit in admin invite surface

## Runtime truth
- spendable balance = `available` only
- `pending` stays non-spendable
- `earn_only` keeps redeem blocked but visible
- `live` enables redeem
- `paused` blocks redeem
- `off` blocks redeem

## Host adaptation truth
The host bot has operator allowlist truth, not a separate founder role object.
For this step, mode controls are gated by the existing founder/operator allowlist rather than inventing a new role system.

## Still intentionally not included
- settlement `pending -> available`
- reconciliation / live verification hardening
- broader rewards dashboard
- new catalog items
- payout/token semantics

## Acceptance intent
- redeem uses the existing Pro subscription rail
- repeated confirm on the same redemption request does not double-complete
- admin invite surface stays compact and mode-focused
- docs canon remains in `doc/...`
