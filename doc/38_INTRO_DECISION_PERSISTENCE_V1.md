# 38_INTRO_DECISION_PERSISTENCE_V1

STEP013 upgrades intro inbox actions from placeholder rows into real DB-backed decision transitions.

## Contract

- only the recipient (`target_user_id`) may accept or decline a request
- only `pending` rows are actionable
- repeated clicks on already decided rows do not mutate state again
- accepted and declined rows remain visible in inbox summaries
- acceptance does **not** reveal private contact or create a chat flow

## Reasons

- `intro_request_accepted`
- `intro_request_declined`
- `intro_request_already_accepted`
- `intro_request_already_declined`
- `intro_request_not_actionable_by_user`
- `intro_request_missing`

## Not included yet

- contact contract after acceptance
- notifications / receipts
- detail surfaces
