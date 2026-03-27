# STEP017 — Intro retention / history safety v1

STEP017 hardens intro history without pulling the whole project into a soft-delete rewrite.

## Contract

- `intro_requests` now stores sender + target snapshots at creation time
- `intro_requests` foreign keys now use `ON DELETE SET NULL`
- inbox/detail surfaces prefer live profile data when it exists
- if the live profile is gone, inbox/detail fall back to the archived snapshot
- archived rows no longer expose `Open profile` because no live profile remains
- accepted/sender-link LinkedIn buttons may still use preserved snapshot URLs where allowed by the existing contact contract

## Why this is enough for now

This keeps history truthful for the surviving participant without forcing:
- global user soft-delete
- full archival tables
- broad tombstone mechanics

Those can still come later if production policy requires them.
