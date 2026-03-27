# 35_INTRO_INBOX_ACTIONS_BASELINE_V1

STEP012 extends intro inbox from summary-only counters into row-level action placeholders.

## What is real now

- intro inbox still shows received/sent counts
- each received row exposes:
  - `Open profile`
  - `Accept` placeholder
  - `Decline` placeholder
- each sent row exposes:
  - `Open profile`
- opening a row profile routes to the public directory card when it still exists
- placeholder decision callbacks return to inbox with an explicit notice that real mutation lands in STEP013

## What is still placeholder-only

- `accepted` / `declined` status mutation
- replay/idempotency handling for intro decisions
- post-accept contact reveal contract
- reply/chat surfaces

## Truth boundary

STEP012 is a UI/state-prep step. It makes the decision surface visible without lying that the decision state machine is already implemented.
