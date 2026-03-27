# WORK HISTORY — STEP019

## Step

STEP019 — data-layer split refactor / `directoryRepo` extraction

## Why this step happened

By STEP018, the bot runtime had already been split into narrower composers. The next structural debt cut was the DB layer: `profileRepo.js` still mixed profile truth with listed-profile browse/search/filter SQL. The goal was to reduce maintenance risk without reopening runtime behavior.

## What changed

- created `src/db/directoryRepo.js`
- moved listed-profile browse/search/filter queries into `directoryRepo.js`
- kept profile truth, visibility, and skills mutations in `profileRepo.js`
- updated storage wiring so directory surfaces now read from `directoryRepo.js`
- added `smoke:data-split` to protect the new repo boundary

## What did not change

- directory/filter/search user-facing behavior
- intro/contact contracts
- anti-abuse guards
- retention/history safety
- Telegram router behavior

## Result

The data layer is easier to extend: future directory/search work has a dedicated repo boundary without re-growing `profileRepo.js` into a mixed-responsibility module.

## Next recommended step

STEP020 — notification / receipt layer
