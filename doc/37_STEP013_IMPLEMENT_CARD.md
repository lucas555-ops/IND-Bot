# 37_STEP013_IMPLEMENT_CARD

## STEP013

Intro decision persistence baseline / real accept-decline transitions.

### Goal
Turn inbox action rows into real status mutations for the recipient only, without expanding into contact reveal, reply, or messaging.

### In scope
- real `accepted` / `declined` transitions for `intro_requests`
- recipient-only guard
- replay guard for already decided rows
- inbox refresh showing decision visibility
- docs sync and smoke coverage

### Out of scope
- contact reveal
- intro detail view
- reply or messaging flow
- sender cancellation
- notifications
- monetization
