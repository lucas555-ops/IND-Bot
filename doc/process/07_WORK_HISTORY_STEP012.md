# WORK HISTORY — STEP012

## Title

STEP012 — intro inbox actions baseline / accept-decline placeholder rows

## Why this step happened

After STEP011, intro requests were durable DB objects, but inbox was still summary-only. The next honest move was to make the decision surface visible without claiming that state mutation, messaging, or contact unlock already existed.

## What changed

- intro inbox text now states the STEP012 placeholder boundary
- received intro rows now expose `Open profile`, `Accept`, and `Decline`
- sent intro rows now expose `Open profile`
- `Accept` / `Decline` callbacks now return to inbox with an honest placeholder notice
- added smoke coverage for intro inbox row actions

## What this step did not do

- no intro status mutation
- no accepted/declined persistence
- no reply/chat flow
- no post-accept contact contract

## Next recommended step

STEP013 — intro decision persistence baseline / real accept-decline transitions
