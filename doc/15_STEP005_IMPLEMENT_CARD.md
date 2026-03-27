# STEP005_IMPLEMENT_CARD

## Goal

Add in-Telegram profile draft editing and profile completion surfaces on top of the STEP004 persistence baseline.

## Scope

In:
- profile editor menu callbacks
- profile preview callback
- field edit entrypoints
- persisted edit-session baseline
- text input consumption for profile fields
- readiness calculation
- visibility toggle with guardrails
- router/render updates
- migration for edit sessions
- profile edit smoke coverage

Out:
- skills editing
- public directory browsing
- premium logic
- admin moderation
- deploy automation

## Acceptance

- connected user can open a profile editor surface from home
- user can preview the profile card inside Telegram
- user can start editing supported fields from callback surfaces
- next text message updates the pending field when an edit session exists
- profile state/readiness updates after field save
- visibility cannot be switched to `listed` until required fields are complete
- no fake edit success claims when DB persistence is disabled
- router, storage, and profile smoke checks pass
