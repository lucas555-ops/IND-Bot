# DIRECTORY_FILTERS_BASELINE_V1

## What STEP008 adds

STEP008 adds the first browse narrowing layer for the public directory.

This is intentionally not a full search engine. It is a compact, explicit filter surface that narrows the already-listed public directory by:

- one industry bucket
- any number of selected skills

## Filter semantics

### Industry

- single-choice
- user can select one curated bucket or clear it
- current buckets:
  - Creator economy
  - B2B SaaS
  - Crypto
  - Agency / services
  - E-commerce
  - Recruiting / HR
  - Media

### Skills

- multi-select
- matches any selected skill
- current skill catalog stays aligned with STEP006 curated skill list

## Storage model

STEP008 persists filter state per Telegram user in `directory_filter_sessions`.

Reason:
- compact callback payloads
- stable Back/Menu/Home behavior
- no need to encode multi-filter state in callback data

This is still a narrow baseline, not a commitment that long-term ephemeral UI state must live in PostgreSQL.
Future steps may move this kind of state to Redis/cache if and when a proper ephemeral state layer is introduced.

## Resulting browse behavior

Directory browse continues to show only:
- `visibility_status = listed`
- `profile_state = active`

STEP008 only narrows that set.
It does not widen it.

## Truth notes

- industry filter is a curated bucket layer over free-text `industry_user`
- skill filter is based on stored `member_profile_skills`
- STEP008 does not claim full-text search or ranking relevance
