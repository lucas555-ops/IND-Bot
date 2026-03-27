# WORK_HISTORY_STEP010

## Summary

STEP010 added the first outbound action baseline to public directory cards.

## What changed

- added self-managed `linkedin_public_url` field to profile completion
- added URL validation for public LinkedIn member profile links
- added public LinkedIn URL display in profile preview and public directory card
- added `Open LinkedIn` button on directory cards when URL exists
- added `Request intro` placeholder callback for non-viewer cards with `contact_mode = intro_request`
- synced docs and smoke coverage

## Why this step stayed narrow

STEP010 intentionally did not add:
- real intro request persistence
- inbox surfaces
- premium gating
- contact unlock flow
- moderation logic

The step only establishes truthful outbound actions on top of the public card baseline.

## Result

The project now supports:
- public browse of listed + active profiles
- search and filter narrowing
- public card outbound link opening
- explicit intro-request placeholder UX

without pretending that the real contact/request system already exists.
