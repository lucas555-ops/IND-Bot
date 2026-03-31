# STEP050I Repo Consistency Audit

## Verdict

Repo is broadly usable and the current landing/runtime source is healthy at the basic source level, but the package was **not fully consistent** before cleanup.

## What was confirmed healthy

- `npm run check` passed
- `npm run smoke:landing` passed
- `npm run smoke:landing-polish` passed
- `npm run smoke:legal` passed

## What was inconsistent before cleanup

1. `package.json` declared `smoke:admin-bulk-actions`, but the script file was missing.
2. `package.json` declared `smoke:schema-compat`, but the script file was missing.
3. `scripts/smoke_og_social_contract.js` still required the old OG asset path `assets/social/intro-deck-og-1200x630-v1.png`, while the repo uses the clean path `assets/social/intro-deck-og-1200x630.png`.
4. `README.md` was still framed as a STEP047 baseline and listed a broken smoke command.
5. `doc/15_NEW_CHAT_HANDOFF.md` was still centered on STEP049K instead of the current rebuilt landing baseline.
6. The repo root still contained stale one-off leftovers: `README_REPLACE_FILES.txt`, `STEP039_QA_checklist.md`, `STEP039_changed_files.txt`.
7. Docs still claimed a separate schema-compat layer that is not independently asserted by current source/smoke.

## Cleanup applied in STEP050I

- added a real `smoke:admin-bulk-actions` contract script
- removed the broken `smoke:schema-compat` alias
- repaired OG smoke to the clean social asset path
- refreshed README + handoff/start-new-chat docs to current baseline
- removed stale top-level leftovers

## Remaining caution

- Live deploy status is not verified from source alone
- Legacy DB compatibility for pre-STEP046 schemas is **not asserted** by current source package; migrations should be treated as required unless separately verified
