# 34_STEP012_IMPLEMENT_CARD

## STEP

STEP012 — intro inbox actions baseline / accept-decline placeholder rows

## Goal

Turn intro inbox from a summary-only surface into a row-level action surface without pretending that intro decision mutation already exists.

## Scope

- render received intro rows with `Open profile`, `Accept`, and `Decline`
- render sent intro rows with `Open profile`
- wire placeholder callbacks for `Accept` and `Decline`
- keep actions honest: no DB mutation, no chat, no contact reveal
- add smoke coverage for intro inbox row actions

## Non-goals

- no status mutation in `intro_requests`
- no reply/chat flow
- no post-accept contact contract
- no notifications

## Acceptance

- intro inbox text clearly states STEP012 placeholder boundary
- received rows expose `Accept` and `Decline`
- sent rows do not expose accept/decline actions
- `Open profile` opens a public directory card when available
- placeholder decision callbacks return to inbox with an honest notice
