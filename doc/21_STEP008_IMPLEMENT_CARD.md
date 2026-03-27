# STEP008 — directory filters baseline / industry + skills browse narrowing

## Goal

Add the first real narrowing layer on top of the public directory baseline without turning STEP008 into a search engine, premium surface, or contact flow.

## Scope

- persisted per-user directory filter session
- single-choice industry bucket filter
- multi-select skill filters
- filtered public directory list
- filters surface in Telegram
- docs sync
- smoke coverage

## Non-goals

- text search
- city filter
- premium gating
- intro/contact actions
- ranking logic
- relevance scoring

## Acceptance

- directory list shows current filter summary
- user can open a dedicated filters surface from the directory list and directory card
- industry filter is single-choice bucket toggle
- skills filter is multi-select and matches any selected skill
- clear filters path exists
- filtered browse still only shows `listed + active` profiles
- explicit empty state appears when no listed profiles match current filters
- persistence-disabled mode remains truthful
