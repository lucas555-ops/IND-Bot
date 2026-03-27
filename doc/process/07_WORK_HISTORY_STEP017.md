# WORK HISTORY — STEP017

## Step

STEP017 — intro retention / history safety baseline

## Delivered

- added archived sender/target snapshot fields on `intro_requests`
- added migration to switch intro foreign keys from cascade delete to set-null retention
- updated intro inbox/detail queries to fall back to archived snapshots
- updated intro render surfaces to label archived snapshot rows honestly
- added retention smoke coverage

## Why

STEP016 protected runtime actions from retries and tap spam.
STEP017 protects intro history from disappearing when related users or profiles are later removed.

## Next

STEP018 — code split refactor
