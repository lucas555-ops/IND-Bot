# PROFILE_CARD_OUTBOUND_ACTIONS_V1

## Purpose

STEP010 adds the first outbound action row on public directory cards.

This is not the real contact system yet.

## What exists now

- `linkedin_public_url` is editable as a self-managed profile field
- the field is optional and is not part of readiness requirements
- the value must be a LinkedIn member profile URL on `linkedin.com`
- public directory cards show `Open LinkedIn` when the URL exists
- public directory cards show `Request intro` only as a placeholder callback when:
  - the viewer is not the owner of the card
  - `contact_mode = intro_request`

## What is still missing

- intro request persistence
- recipient-side inbox
- sender-side outbox
- moderation / abuse rules for requests
- rate limiting
- premium or credit gating

## Truth boundary

The public LinkedIn URL is self-managed by the member.

It is not guaranteed by OIDC and is not treated as an auto-import field.

The intro request button in STEP010 is an honest placeholder, not a hidden or partial implementation.
