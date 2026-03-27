# STEP019 — Data-layer split refactor v1

STEP019 is a structure-only refactor over the STEP018 runtime.

It narrows responsibility boundaries in the DB layer:
- `profileRepo.js` keeps profile truth: draft seed, profile snapshots, field updates, visibility, and skill mutations
- `directoryRepo.js` now owns listed-profile listing, filtering, search, and public-card loading

This step does not change:
- directory visibility rules
- search/filter behavior
- intro flows
- contact contract
- anti-abuse or retention logic

The goal is maintainability: future directory/search work can now land in `directoryRepo.js` without growing `profileRepo.js` back into a mixed-responsibility module.
