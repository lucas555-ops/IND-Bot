# 15_NEW_CHAT_HANDOFF

## Executive summary

- Project: LinkedIn Telegram Directory Bot
- Current baseline: STEP024.5
- Current mode: BUILD
- Current focus: intro decisions are real, submitted LinkedIn URLs follow a privacy-first post-decision contract, each intro row has a dedicated detail surface, anti-abuse guards harden retries/duplicates, the directory data layer is split from profile truth, durable service notification receipts are in place, STEP022 adds due receipt retry with attempt metadata and a protected retry endpoint, STEP023 adds protected read-only receipt diagnostics with operator buckets and per-intro summary, STEP024 adds an allowlisted in-Telegram operator/admin diagnostics surface, and STEP024.5 adds deploy-readiness micro-hardening for shared secret compare, dual-mode retry auth, retention-safe notification receipt FK policy, and retry-path runtime guard cleanup
- Next recommended step: STEP025 — live verification / release gate pass
- Must not break: official LinkedIn OIDC baseline, Telegram webhook secret guard, Telegram router contract, `listed + active` browse truth, durable intro request persistence, durable notification receipt truth, operator allowlist gating

## Truth block

### Source-confirmed
- Official LinkedIn login baseline is OIDC / 3-legged OAuth, not scraping
- DB persistence exists when `DATABASE_URL` is configured
- Telegram `setWebhook` supports secret-token integrity guard on inbound requests
- durable notification receipts, retry metadata, protected retry route, protected read-only notification receipt diagnostics, and a Telegram operator diagnostics surface exist in source
- `/ops` command and operator-only home entrypoint now expose read-only receipt diagnostics for allowlisted Telegram user IDs

### Live-confirmed
- Consolidated source tree was syntax-checked and smoke-checked successfully in this repo snapshot
- `/start` home surface exists
- auth scaffold exists
- in-Telegram profile completion exists for text fields and curated skills
- public directory browse, filters, and text/city narrowing exist
- intro requests persist in DB
- intro inbox exposes row-level open-profile actions, real accept/decline decisions, sender review links, accepted-contact unlock buttons, and per-item intro detail surfaces
- docs operating layer exists and is part of project truth

### Inference
- The next narrow runtime step should close live verification and release proof rather than broadening into monetization or a general admin console
- Contact visibility should continue to stay privacy-first and decision-aware before any messaging or premium layer appears

### Blocked / unconfirmed
- no reply/chat flow yet
- no end-user receipt history surface yet
- no premium logic yet
- no broad admin panel yet beyond operator diagnostics
- no production deploy proof yet
- live webhook / callback / DB verification still not closed

### Do not claim
- production readiness
- full messaging system
- LinkedIn scraping/import beyond official baseline
- ranking/search engine maturity
- end-user notification history
- live receipt diagnostics proof without deployment evidence

## Stabilized zones

- official LinkedIn auth baseline
- Telegram webhook secret ingress guard
- Telegram router discipline
- draft profile creation and completion
- curated skill selection
- public browse truth
- intro request durable persistence and dedupe
- durable notification receipt persistence and retry contract
- allowlisted operator diagnostics surface
- docs operating system for the project

## Live verification still needed

- live callback behavior against a real configured LinkedIn app
- real DB-backed intro request creation and inbox visibility in deployed environment
- real webhook delivery after `setWebhook(..., secret_token=...)`
- real retry endpoint access with secret header
- real ops diagnostics endpoint access with secret header
- real `/ops` behavior for an allowlisted operator in deployed runtime
- degraded behavior with missing envs on deployed runtime

## Mini-smoke

Run:
- `npm run check`
- `npm run smoke:env`
- `npm run smoke:auth`
- `npm run smoke:router`
- `npm run smoke:profile`
- `npm run smoke:skills`
- `npm run smoke:directory`
- `npm run smoke:filters`
- `npm run smoke:search`
- `npm run smoke:outbound`
- `npm run smoke:intro`
- `npm run smoke:webhook`
- `npm run smoke:intro-actions`
- `npm run smoke:intro-decisions`
- `npm run smoke:intro-contact`
- `npm run smoke:intro-detail`
- `npm run smoke:guards`
- `npm run smoke:intro-retention`
- `npm run smoke:code-split`
- `npm run smoke:data-split`
- `npm run smoke:receipts`
- `npm run smoke:notification-retry`
- `npm run smoke:cron`
- `npm run smoke:notification-history`
- `npm run smoke:ops`

## Activation prompt

Use `docs/17_START_NEW_CHAT_PROMPT_LINKEDIN_DIRECTORY_BOT.md` when opening a fresh continuation chat.
