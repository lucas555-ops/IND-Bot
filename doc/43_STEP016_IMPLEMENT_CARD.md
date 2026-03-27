# STEP016 — anti-abuse / retry / dedupe hardening

## Goal

Add narrow DB-backed retry/dedupe protection without broad infra rewrites.

## Scope

- webhook update receipts by `update_id`
- duplicate webhook short-circuit
- short-lived per-user action throttles for intro send / intro decision
- env + health contract updates
- docs sync
- smoke coverage

## Not in scope

- Redis/KV layer
- ranking or abuse scoring
- global rate limiting
- account bans
- messaging or monetization changes

## Acceptance

- duplicate webhook updates can be skipped before `bot.handleUpdate`
- malformed webhook payloads without integer `update_id` are rejected
- repeated intro send taps are short-throttled
- repeated intro decision taps are short-throttled
- current contact contract from STEP014 stays intact
- docs/current-state/handoff are updated to STEP016 truth
