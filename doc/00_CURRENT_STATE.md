# 00_CURRENT_STATE

## Snapshot

- Project: LinkedIn Telegram Directory Bot
- Current STEP: STEP024.9
- Phase: repo reconciliation / live-baseline hardening over the existing intro, hardening, retention, split-runtime, receipt, retry, operator, deploy-readiness, and OAuth surfaces
- Primary mode: Telegram SaaS / Bot + Engineering Ops
- Secondary mode: Hardening + Docs / Handoff discipline
- Runtime status: source baseline is now reconciled around the known live STEP024.7 deploy-stable baseline plus the STEP024.8 LinkedIn OAuth route import hotfix, with webhook/bot-init protection, public npm registry lock, public web/legal surfaces, durable notification receipt and retry truth, narrow operator diagnostics, and targeted regression smokes; still not production-ready
- Live status note: current production baseline last confirmed by operator evidence is STEP024.7 deploy-stable until STEP024.9 is actually deployed

## Audit status

- Syntax check: passed
- Smoke suite: passed for auth, oauth-routes, and bot-init contract verification in this reconciliation pass
- Docs link scan: spot-checked for newly added STEP024.7, STEP024.8, and STEP024.9 continuity docs
- Live deployment proof: not included in this repo snapshot

## Included runtime surfaces

- Telegram `/start` home surface
- LinkedIn OAuth start endpoint
- LinkedIn OAuth callback endpoint
- targeted OAuth route import-resolution smoke that verifies both LinkedIn OAuth serverless routes resolve every relative local import to an existing file
- webhook bot-init smoke that verifies `createBot()` stays async and webhook awaits the initialized bot before handling updates
- OIDC discovery + state signing + token exchange + ID token validation + userinfo fallback
- health endpoint
- Telegram webhook ingress with fail-closed secret-token guard
- public browse + per-user filter + text/city narrowing
- intro request persistence + intro inbox decisions + privacy-first contact unlocking
- durable notification receipts, protected retry path, and operator diagnostics surface
- public root, privacy, and terms web/legal surfaces

## What is intentionally still missing

- ranking / recommendations / matching intelligence
- Telegram chat relay, reply, or full inbox messaging
- billing / credits / subscriptions / payments
- moderation / trust / dispute system
- production analytics / alerting / full admin backoffice
- custom domain / branded website beyond the minimal public surfaces

## Current invariant highlights

- official-only LinkedIn auth baseline remains the identity bootstrap path
- public browse only shows profiles that are both `listed` and `active`
- text query and city narrowing exist, but this is still not a search engine with ranking
- intro requests, accept/decline decisions, and decision-aware detail/contact surfaces persist in DB, but reply/chat flows are still intentionally missing
- receipt truth is durable in DB, retry truth is DB-backed, STEP023 adds protected operator read truth, STEP024 adds an allowlisted in-Telegram operator surface without turning the product into a broad notification center, STEP024.5 closes deploy-readiness gaps with shared secret compare, dual-mode retry auth for Vercel cron + manual fallback, retention-safe notification recipient FK policy, and retry-path runtime guard cleanup, STEP024.6 adds public web/legal surfaces plus a Vercel config fix, STEP024.7 is the live deploy-stable baseline with public npm registry lock plus explicit bot initialization before webhook handling, STEP024.8 fixes broken relative imports in the LinkedIn OAuth routes so the connect flow can load on Vercel, and STEP024.9 reconciles both lines into one source-consistent handoff baseline

## What must not break

- official-only LinkedIn auth baseline, including correct serverless route import resolution
- Telegram webhook secret guard
- async `createBot()` contract plus `await bot.init()`
- webhook must await `createBot()` before calling `handleUpdate()`
- current Telegram router discipline
- listed/active visibility truth for public browse
- intro request and decision persistence truth
- durable notification receipt + retry truth
- narrow operator diagnostics scope
- public legal surface availability for LinkedIn/Vercel setup

## Next recommended step

- STEP025 — redeploy STEP024.9 and run real end-to-end LinkedIn connect verification against production env
