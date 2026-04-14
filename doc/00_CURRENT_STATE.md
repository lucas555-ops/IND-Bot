# 00_CURRENT_STATE

## Project
Intro Deck

## Current source baseline
STEP052.5 — Invite Rewards Redeem Foundation + Founder Mode Controls

## Layer
Product hardening / invite expansion / rewards redeem truth + founder/operator controls

## Source-confirmed
- Invite layer remains a bounded module:
  - `📨 Share invite`
  - `🔗 Link + copy`
  - `🧾 Invite card`
  - `📊 Performance`
  - `📋 Invite history`
- Admin invite snapshot remains read-only under:
  - `👑 Админка` → `🧰 Операции` → `📨 Инвайты`
- Rewards foundation remains implemented in source.
- User read surfaces are now implemented:
  - `🎯 Points` read screen inside invite layer
  - invite root points preview
  - performance/history navigation into points
- Founder/admin invite read truth now includes mode audit and mode-switch controls on the existing admin invite surface.
- User redeem path is now implemented inside invite rewards surfaces.
- Runtime accrual remains mode-gated.
- Safe default remains `off` until manual verification.

## Rewards activation truth
For Intro Deck, a pending reward can exist only when the invited user:
1. is new to the system;
2. arrived through a valid invite attribution;
3. connected LinkedIn;
4. reached listed-ready state (`profile_state = active`) or is already listed.

Not rewardable:
- raw open
- `/start`
- deep-link open only
- self-invite
- existing user
- profile start without listed-ready threshold

## Pending foundation now in source
- activation reward points: `10`
- confirm window: `24h`
- pending reward is created only when mode is `earn_only` or `live`
- `off` and `paused` do not create new pending rewards
- spendable balance is still `available` only

## Runtime integration points
Pending reward accrual check is now re-run after:
- LinkedIn identity persistence
- profile field save
- skill toggle
- visibility toggle

## What this step still does not do
- no settlement job
- no pending -> available transition yet
- no reconciliation / live verification hardening yet

## What must not break
- LinkedIn OIDC truth
- current invite layer
- admin IA and Russian operator layer
- current monetization / pricing surfaces
- webhook/runtime contracts
- docs canon and artifact protocol

## Live truth boundary
- source-confirmed: yes
- live-confirmed: no
- live status not confirmed — manual verification required

## Redeem truth now in source
- starter catalog:
  - `100 points -> 7 days Pro`
  - `250 points -> 30 days Pro`
- redeem runs only from `available`
- redeem stays blocked in `off`, `earn_only`, and `paused`
- successful redeem uses the canonical Pro subscription rail
- repeated confirm on the same redemption request resolves safely without double-completing that request

## Founder/operator controls now in source
- current mode remains visible in `👑 Админка -> 🧰 Операции -> 📨 Инвайты`
- founder/operator allowlist can switch:
  - `off`
  - `earn_only`
  - `live`
  - `paused`
- recent mode audit is visible in the same admin invite surface

## Next recommended step
STEP052.6 — Invite Rewards Settlement + Live Verification Hardening
