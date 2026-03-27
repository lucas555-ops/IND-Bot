# WORK HISTORY — STEP022

## Title

STEP022 — notification retry baseline

## What changed

- extended `notification_receipts` with attempt metadata and retry scheduling fields
- added repo claim functions for first-attempt claim and due retry batch claim
- refactored notification store to schedule retries after retryable failures
- added protected runtime endpoint for due receipt re-delivery
- updated docs, handoff, roadmap, and smoke coverage

## Why

STEP020 gave the project truthful best-effort receipt persistence, but failed rows could remain stranded forever. STEP021 SPIKE established that retry should come before any user-visible receipt history. STEP022 closes that correctness gap while keeping the scope narrow.

## What was intentionally not done

- no user-facing receipt history
- no operator notification center
- no broad worker/orchestration system
- no rollback of intro mutations when notification send fails

## QA

- `npm run check`
- `npm run smoke:receipts`
- `npm run smoke:notification-retry`
- `npm run smoke:router`
