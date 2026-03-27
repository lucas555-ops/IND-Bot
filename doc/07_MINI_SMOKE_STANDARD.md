# 07_MINI_SMOKE_STANDARD

Use this after every narrow STEP.

## Source smoke

- `npm run check`
- all STEP-relevant smoke scripts
- any new contract script introduced by the STEP

## Contract checks

- flow entrypoint exists
- source of truth is clear
- state transition is not broken
- auth/role boundaries did not get weaker
- hot path cost did not bloat by accident
- duplicate/replay/race surface did not get worse

## Runtime checklist

- one manual happy path
- one manual blocked/guarded path
- one degraded or missing-env path if relevant

## Honest final status

- source-confirmed: yes/no
- live-confirmed: yes/no
- blocked/unconfirmed: exact remaining items
