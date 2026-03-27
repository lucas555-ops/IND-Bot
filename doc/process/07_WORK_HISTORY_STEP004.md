# WORK_HISTORY_STEP004

## What changed

STEP004 moved the project from auth-only scaffold to real persistence baseline.

Added:
- DB env contract
- PostgreSQL pool + transaction helper
- `users` upsert path
- `linkedin_accounts` upsert path
- `member_profiles` draft ensure path
- profile snapshot read path for home surface
- storage smoke coverage

## Why this STEP was needed

STEP003 could validate LinkedIn auth but could not retain durable truth.
STEP004 fixes that without jumping into full profile editing or catalog logic.

## What was intentionally not done

- no edit wizard
- no catalog
- no premium
- no admin panel
- no rollout automation

## Recommended next step

STEP005 — profile draft edit flow / profile completion surfaces
