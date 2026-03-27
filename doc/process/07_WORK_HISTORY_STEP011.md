# WORK HISTORY — STEP011

## STEP

STEP011 — intro request persistence baseline / send + inbox placeholder surfaces

## Why this STEP existed

The project already had public profile cards and outbound actions, but intro requests were still only a placeholder concept. The next honest move was not messaging, chat, or premium logic. It was to create a durable intro-request object with a first Telegram inbox surface.

## What was added

- `intro_requests` migration
- intro request repo / storage wiring
- real `Request intro` send-path from public cards
- self-request guard
- dedupe by requester user + target profile
- intro inbox placeholder surface with recent received / recent sent summaries

## What was explicitly not added

- accept / decline persistence
- reply flow
- chat / messaging layer
- contact unlock logic
- premium gates

## Truth fixed by STEP011

- intro requests are durable DB objects
- intro inbox exists as a surface
- outbound action row is no longer a fake placeholder for intro creation

## Residual truth after STEP011

- intro negotiation is not built
- inbox is still placeholder-only for actions
- production readiness is not implied

## QA shape

- syntax check
- auth / router / storage / profile / skills / directory / filters / search / outbound / intro smoke coverage

## Next narrow step from STEP011

STEP012 — intro inbox actions baseline / accept-decline placeholder rows
