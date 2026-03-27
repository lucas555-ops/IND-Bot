# 27_STEP011_IMPLEMENT_CARD

## STEP011

Intro request persistence baseline / send + inbox placeholder surfaces.

## Goal

Turn intro requests from a profile-card placeholder into a real persisted baseline without pretending that reply or messaging flows already exist.

## Scope

- add `intro_requests` persistence
- persist send action from public directory cards
- dedupe repeated send attempts
- expose `📥 Intro inbox` surface
- show recent received and sent requests as placeholder-only inbox summaries

## Explicitly out of scope

- accept / decline actions
- request notes or freeform messages
- chat / DM threading
- notifications / digests
- premium gates

## Acceptance

- clicking `✉️ Request intro` creates a durable row when allowed
- duplicate click does not create duplicate rows
- self-request is blocked honestly
- inbox surface loads recent received and sent request summaries
- no fake reply or acceptance state is implied
