# STEP004_IMPLEMENT_CARD

## Goal

Add baseline PostgreSQL persistence for:
- LinkedIn identity
- profile draft creation
- home-surface profile status read path

## Scope

In:
- DB config contract
- pool / transaction helper
- users repo
- linkedin accounts repo
- profile repo
- callback persistence wiring
- home snapshot read path
- migration baseline update
- storage smoke coverage

Out:
- profile edit UX
- catalog search
- premium logic
- moderation
- deploy automation

## Acceptance

- `/start` touches `users` when DB is configured
- callback persists LinkedIn identity when DB is configured
- callback ensures hidden draft profile on first connect
- home surface reflects connected vs disconnected state
- no fake persistence claims when DB is not configured
- storage smoke passes
