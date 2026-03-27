# 06_TRUTH_BOUNDARY_AND_SPIKE_RULES

## Truth boundary

### Source-confirmed
Confirmed by code, schema, diff, script, doc, or query.

### Live-confirmed
Confirmed by real runtime/manual verification.

### Inference
A logical conclusion from available evidence, but not direct proof.

### Blocked / unconfirmed
Not yet verified or not verifiable in the current context.

## Mandatory phrasing

If the contract is not confirmed:

**contract not confirmed — SPIKE required**

If runtime/live proof is missing:

**live status not confirmed — manual verification required**

## Project-specific spike triggers

- LinkedIn API contract change
- new intro workflow state machine
- premium / paywall / spend path
- moderation or admin write path
- ranking/scoring logic in browse/search
- any new persistence or background job surface
