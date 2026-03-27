# STEP015 — Intro detail surfaces v1

## Purpose

Give each intro request a dedicated screen so sender and recipient can inspect the request state without expanding the product into messaging or receipts.

## Baseline

This step sits on top of:
- STEP013 real accept/decline persistence
- STEP014 privacy-first contact contract

## Surface rules

### Received detail

Must show:
- counterpart name/headline
- status
- created/updated dates
- whether sender LinkedIn URL is available for review
- pending actions only if status is `pending`

### Sent detail

Must show:
- counterpart name/headline
- status
- created/updated dates
- whether contact is unlocked
- unlocked contact button only when status is `accepted` and a public LinkedIn URL exists

## Keyboard rules

- `Open profile` when a directory card exists
- `Sender LinkedIn` for received detail only when available
- `Open contact` for sent accepted detail only when allowed by the STEP014 contract
- `Accept / Decline` only for received pending items
- `Back to inbox`
- `Home`

## Explicit non-goals

- chat
- reply thread
- notification fanout
- premium gating
- message body

## Truth note

This is a state-visibility step, not a communication step.
