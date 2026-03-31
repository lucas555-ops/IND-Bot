# 07_WORK_HISTORY_STEP050I

- Step: STEP050I
- Date: 2026-03-31
- Scope: repo consistency cleanup + smoke/doc/root hygiene

## What changed

- added a real `scripts/smoke_admin_bulk_actions_contract.js` so the declared package smoke command resolves and validates the segment bulk-prep contract
- repaired `scripts/smoke_og_social_contract.js` to match the clean OG asset path `assets/social/intro-deck-og-1200x630.png`
- removed the broken `smoke:schema-compat` package alias instead of leaving a declared-but-missing command in source
- refreshed `README.md`, `doc/15_NEW_CHAT_HANDOFF.md`, and `doc/17_START_NEW_CHAT_PROMPT_LINKEDIN_DIRECTORY_BOT.md` so current baseline/mode text matches the rebuilt landing baseline
- removed stale repo-root leftovers: `README_REPLACE_FILES.txt`, `STEP039_QA_checklist.md`, and `STEP039_changed_files.txt`

## Why

- keep the repo root and package scripts truthful to the current source package
- avoid shipping a source archive where advertised smoke commands fail immediately due to missing files
- keep new-chat/handoff docs aligned to the current public landing baseline instead of older STEP049K wording

## Verification

- `npm run check`
- `npm run smoke:landing`
- `npm run smoke:landing-polish`
- `npm run smoke:legal`
- `npm run smoke:og-social`
- `npm run smoke:admin-bulk-actions`
