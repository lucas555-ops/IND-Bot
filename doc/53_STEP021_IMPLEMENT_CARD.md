# STEP021 — notification retry / receipt history SPIKE

## Goal
Produce a truthful design-and-risk baseline for notification retry and receipt history without pretending the runtime worker or user-visible history already exists.

## Scope
- audit the current `notification_receipts` model
- identify failure states and retry gaps
- decide whether receipt history should be operator-only, user-visible, or both
- recommend one narrow implementation corridor for STEP022
- update docs canon and handoff baseline

## Non-goals
- no retry worker yet
- no cron endpoint yet
- no user-facing receipt history surface yet
- no broad observability system
- no monetization changes

## Acceptance
- current receipt truth is described accurately
- failure/retry gaps are named explicitly
- one recommended STEP022 corridor exists
- docs canon is updated to reflect STEP021 as a SPIKE step
