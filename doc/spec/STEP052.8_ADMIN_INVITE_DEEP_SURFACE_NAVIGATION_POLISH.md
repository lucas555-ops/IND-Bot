# STEP052.8 — Admin / Invite Deep-Surface Navigation Polish

## Goal
Tighten the nested navigation inside the admin invite layer and the user invite layer without changing rewards rules, settlement math, or monetization logic.

## What changed
- Split `📨 Инвайты` into four focused read/action views:
  - Overview
  - Rewards
  - Settlement
  - Mode audit
- Keep mode writes only on the focused Rewards view.
- Keep settlement batch/reconcile actions only on the focused Settlement view.
- Keep explicit return rails on every invite admin deep surface.
- Make the user invite root more action-led and easier to understand.
- Remove the dead-end feel from the invite card message by adding navigation back to invite root and points.

## What did not change
- no reward rule changes
- no redeem rule changes
- no settlement math changes
- no new role model
- no admin shell rewrite outside the invite corridor

## Acceptance
- every invite admin deep surface has its own keyboard
- every invite admin deep surface has a clear way back to `🧰 Операции`
- rewards mode switches live only on the focused Rewards view
- settlement actions live only on the focused Settlement view
- invite card message no longer hangs without navigation
- invite root, performance, history, and points keep a consistent navigation pattern
