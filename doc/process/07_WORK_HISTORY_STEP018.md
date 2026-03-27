# WORK HISTORY — STEP018

## Step

STEP018 — bot runtime code split refactor

## Why this step happened

By STEP017, the project had a stable enough runtime contract to safely reduce the monolithic bot wiring layer. The goal was to cut maintenance risk without reopening auth, intro, directory, or contact-contract behavior.

## What changed

- split bot runtime wiring into dedicated composers
- moved surface builders into a dedicated module
- moved notice formatting and pending-input cleanup into dedicated bot utility modules
- kept `createBot.js` as the slim root assembler
- added `smoke:code-split` to guard the new runtime shape

## What did not change

- callback namespaces
- persistence logic
- intro request behavior
- decision/contact/retention contracts
- anti-abuse guards

## Result

The project is easier to maintain without changing user-facing behavior.

## Next recommended step

STEP019 — data-layer split refactor / `directoryRepo` extraction
