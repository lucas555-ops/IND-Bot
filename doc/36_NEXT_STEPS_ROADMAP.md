# 36_NEXT_STEPS_ROADMAP

## Current corridor after STEP024.5

The project now has:
- official LinkedIn OIDC scaffold
- real persistence
- profile completion
- public directory browse + filters + search narrowing
- outbound profile actions
- durable intro request persistence
- fail-closed webhook ingress guard
- row-level intro inbox actions with real accept/decline transitions
- privacy-first post-decision contact rules
- intro detail surfaces for sender/recipient state visibility
- DB-backed webhook update dedupe and short-lived intro action throttles
- intro history retention safety
- split bot runtime composers
- split directory data layer
- durable notification receipts
- protected retry for due notification receipts
- protected read-only receipt diagnostics with per-intro drilldown
- lightweight in-Telegram operator/admin diagnostics surface for allowlisted operator IDs

The next steps should stay narrow.

## STEP021 — completed SPIKE

Result:
- retry is the next correctness gap to close
- user-visible receipt history is not the immediate next runtime step
- the product should not jump into a broad notification center

## STEP022 — completed

Result:
- `notification_receipts` now tracks durable attempt metadata
- due receipts can be claimed and retried safely
- retries stay separate from intro mutation truth
- user-visible receipt history is still intentionally deferred

## STEP023 — completed

Result:
- operator-readable buckets now exist: `sent / failed / skipped / retry_due / exhausted`
- recent receipt history can be queried without raw SQL
- per-intro receipt summary now exists through a protected read-only endpoint
- the product still does not commit to an end-user notification center

## STEP024 — completed

## STEP024.5 — completed

Micro-hardening closes deploy-readiness gaps without changing user UX: shared secret compare helper, Vercel-cron-compatible retry auth, retention-safe notification recipient FK policy, retry-path runtime guard cleanup, and docs/env contract refresh.


Result:
- allowlisted operators can open a read-only diagnostics screen inside Telegram via `/ops`
- home now shows an operator-only diagnostics entrypoint
- the screen surfaces retry_due, failed, exhausted, and per-intro drilldown without adding resend mutations
- the product still does not commit to a broad admin rewrite

## STEP025

**Live verification / release gate pass**

Only after STEP024.5 is source-clean:
- env completeness pass
- live webhook secret verification
- live LinkedIn callback smoke
- live DB intro flow smoke
- live retry + ops diagnostics smoke
- honest go / no-go doc

## STEP026+

Only after retry truth, operator diagnostics, and live verification exist:
- optional per-intro receipt diagnostics in product surfaces
- premium intro quota or paid intro gating
- advanced ranking
- broader admin/moderation surfaces
