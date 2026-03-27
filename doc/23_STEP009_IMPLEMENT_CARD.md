# STEP009 — directory search baseline / text query + city narrowing

## Goal

Add the first text-driven narrowing layer to public browse without turning STEP009 into a ranked search engine, premium surface, or contact flow.

## Scope

- persisted directory `text_query`
- persisted directory `city_query`
- pending filter input mode for Telegram text entry
- filtered public directory list with search + city narrowing
- filters surface updates
- docs sync
- smoke coverage

## Non-goals

- ranking logic
- fuzzy relevance scoring
- advanced query syntax
- premium gating
- intro/contact actions

## Acceptance

- directory filters surface exposes search text and city entrypoints
- Telegram text input can update search text and city without colliding with profile edit mode
- search text matches display name, LinkedIn name, headline, company, industry, and about
- city narrowing matches free-text city fragments case-insensitively
- clear-single and clear-all filter paths exist
- filtered browse still only shows `listed + active` profiles
- explicit empty state appears when no listed profiles match current filters
- persistence-disabled mode remains truthful
