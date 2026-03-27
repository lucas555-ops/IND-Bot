# STEP003 — code-bearing scaffold / auth skeleton

## Goal

Create the first runnable scaffold on top of the corrected LinkedIn API baseline.

## In scope

- repo skeleton
- `.env.example`
- package manifest
- health endpoint
- Telegram `/start` home surface
- LinkedIn auth start endpoint
- LinkedIn callback endpoint
- OIDC discovery/token/userinfo helpers
- signed state helper
- ID token validation helper
- SQL schema draft
- smoke scripts
- docs sync

## Out of scope

- persistence wiring
- directory runtime
- filters UI
- premium/paywall
- admin runtime
- target-env deploy

## Acceptance

- syntax-valid JS scaffold exists
- auth start and callback endpoints exist
- state is signed and verified
- ID token validation path exists
- callback does not pretend persistence already exists
- docs match runtime reality

## Rollback

Cheap. This is a scaffold step and does not mutate a live runtime.
