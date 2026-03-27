# STEP010 IMPLEMENT CARD

## Title

STEP010 — profile card outbound actions baseline / public LinkedIn URL + intro-request placeholder

## Goal

Add the first truthful outbound action layer to public directory cards without pretending that real contact flow already exists.

## Scope

- add self-managed `linkedin_public_url` edit path inside Telegram profile completion
- validate that the stored URL is a real LinkedIn public member profile URL
- expose `Open LinkedIn` on public directory cards when the URL is present
- expose `Request intro` as an explicit placeholder callback for non-viewer cards with `contact_mode = intro_request`
- keep intro request as placeholder only; do not add persistence or inbox flow yet
- sync docs and smoke coverage

## Non-goals

- real intro request persistence
- inbox or recipient queue
- premium gating
- external contact unlock
- ranking/search changes

## Acceptance

- user can save a public LinkedIn URL from profile edit flow
- invalid non-LinkedIn URL is rejected
- preview and public directory card show the stored public LinkedIn URL
- directory card keyboard shows `Open LinkedIn` when URL exists
- directory card keyboard shows `Request intro` placeholder only for non-viewer cards
- callback returns an honest placeholder notice instead of fake flow

## QA

- `npm run check`
- `npm run smoke:env`
- `npm run smoke:auth`
- `npm run smoke:router`
- `npm run smoke:storage`
- `npm run smoke:profile`
- `npm run smoke:skills`
- `npm run smoke:directory`
- `npm run smoke:filters`
- `npm run smoke:search`
- `npm run smoke:outbound`
