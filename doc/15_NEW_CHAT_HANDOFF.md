# 15_NEW_CHAT_HANDOFF

## Executive summary

- Project: LinkedIn Telegram Directory Bot
- Current baseline: STEP047
- Current mode: PRODUCT HARDENING / IDENTITY UPLIFT / CONTACT + DM MONETIZATION FOUNDATION
- Current focus: keep LinkedIn identity bootstrap clean, preserve manual profile edits, and use STEP047 as the narrow base for STEP048 pricing / analytics / ops
- Must not break: LinkedIn OIDC truth, webhook secret guard, router contract, listed/active browse truth, intro persistence, communications/outbox truth, operator allowlist gating

## Source-confirmed

- mature operator/admin layer exists in source
- STEP040 Russian admin analytics drilldowns exist in source
- STEP041 safe bulk actions exist in source
- STEP042 launch runbook and freeze policy exist in source
- STEP043.1 live-verification and rehearsal guidance exist in source
- STEP045 LinkedIn identity auto-seed uplift now exists in source
- STEP046 private handle + paid contact unlock now exists in source
- STEP047 gated member DM relay now exists in source
- LinkedIn callback/user notification copy now explicitly says only the basic identity layer was imported
- profile draft seeding now preserves existing manual display name values on reconnect
- profile-level hidden Telegram username and direct-contact approval flow now exist in source

## Live-confirmed

- syntax/smoke can be run from repo
- docs canon exists
- source-level STEP047 checks pass locally

## Inference

- the next safe product step is STEP048 pricing / analytics / ops, not broad LinkedIn scraping or subscription sprawl
- the strongest monetization rails now are paid direct-contact requests plus gated DM initiation, with analytics/entitlements still to be layered on

## Blocked / unconfirmed

- fresh production `/api/health` / `/api/health?full=1` verification is not closed here
- real deployed LinkedIn callback verification for STEP045 copy/seed behavior is not closed here
- real deployed Telegram Stars direct-contact request flow is not closed here
- real deployed Telegram Stars DM flow is not closed here
- pricing analytics / subscriptions are not implemented yet

## Required wording

When deployment proof is missing, say exactly:
- **live status not confirmed — manual verification required**

When contract certainty is missing, say exactly:
- **contract not confirmed — SPIKE required**

## Key source docs

- `doc/00_CURRENT_STATE.md`
- `doc/spec/STEP045_LINKEDIN_IDENTITY_AUTO_SEED_UPLIFT.md`
- `doc/spec/STEP046_PRIVATE_TELEGRAM_HANDLE_AND_PAID_CONTACT_UNLOCK_V1.md`
- `doc/spec/STEP047_MEMBER_DM_RELAY_V1.md`
- `doc/process/07_WORK_HISTORY_STEP045.md`
- `doc/process/07_WORK_HISTORY_STEP046.md`
- `doc/process/07_WORK_HISTORY_STEP047.md`
- `doc/17_START_NEW_CHAT_PROMPT_LINKEDIN_DIRECTORY_BOT.md`


## STEP048.1 hotfix

- Added schema-compatible profile/directory reads so legacy databases without `member_profiles.telegram_username_hidden` do not break LinkedIn transfer confirm or home/profile loads.
- Purpose: keep pre-STEP046 databases operational while migrations are still being applied.
- Note: paid unlock / DM / pricing features still require STEP046-STEP048 migrations to be applied for full functionality.


## STEP048.3 hotfix

- Scope: LinkedIn connect/relink copy polish + profile editor/preview readability + profile keyboard consistency.
- Product truth: LinkedIn OIDC basics are stored privately; only the initial card name is auto-seeded into public card fields by default.
- UX: profile editor now shows a dedicated LinkedIn block, preview clarifies what is public vs private, and callback success page includes an explicit button back to the bot.
- Buttons: profile preview/input/profile-saved flows now keep Back + Home on one row for tighter Telegram ergonomics.
- No schema changes. Live status not confirmed — manual verification required.


## STEP048.4 hotfix
- Fix: restore STEP048 pricing env contract exports after STEP048.3 UX hotfix accidentally dropped `getSubscriptionConfig` and Pro pricing fields from `src/config/env.js`.
- Impact: Vercel runtime no longer fails on `monetizationStore.js` import during startup.
- Scope: narrow compatibility/hardening only; no product-flow changes.
