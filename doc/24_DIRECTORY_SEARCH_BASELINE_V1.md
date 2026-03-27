# DIRECTORY_SEARCH_BASELINE_V1

## What STEP009 adds

STEP009 adds the first text-driven narrowing layer on top of STEP008 directory filters.

This is still intentionally not a full search engine.

It adds:
- text query
- city narrowing

while preserving the existing:
- single-choice industry bucket
- multi-select skills filter

## Text query semantics

Text query is a plain free-text substring match.

For STEP009 it matches against:
- display name
- LinkedIn name
- headline
- company
- industry
- about

It does not introduce ranking, typo tolerance, or query operators.

## City semantics

City narrowing is a plain free-text substring match against `city_user`.

Reason:
- keeps schema simple
- works with self-managed profile data
- stays truthful to current profile-completion model

## Input mode

Because search text and city require user text entry inside Telegram, STEP009 introduces a persisted pending filter input mode.

Reason:
- avoid callback-payload bloat
- avoid mixing profile edit text input with directory filter text input
- keep `Back / Home / Directory` escape paths explicit

## Truth notes

- STEP009 is still browse narrowing, not ranked search
- no premium/search gating exists yet
- no contact flow exists yet
- no geocoding or city normalization exists yet
