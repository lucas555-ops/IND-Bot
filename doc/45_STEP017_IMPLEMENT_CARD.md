# STEP017 — intro retention / history safety baseline

## Goal

Preserve intro history when related users or profiles later disappear, without broad soft-delete rewrites.

## What changes

- add intro snapshot columns for sender + target display/headline/LinkedIn URL
- switch intro foreign keys from `ON DELETE CASCADE` to `ON DELETE SET NULL`
- update intro inbox/detail queries to fall back to archived snapshots
- expose archived-history hints in intro inbox/detail surfaces

## What does not change

- no chat/reply layer
- no monetization
- no broad user/profile soft-delete system
- no change to contact-unlock contract from STEP014

## Acceptance

- deleting a related user/profile no longer requires deleting intro history
- surviving participant can still see intro rows and details via archived snapshot fallback
- live profile open buttons disappear when profile is gone
- LinkedIn URL buttons still obey the STEP014 contact contract

## QA

- `npm run check`
- `npm run smoke:intro-detail`
- `npm run smoke:guards`
- `npm run smoke:intro-retention`
