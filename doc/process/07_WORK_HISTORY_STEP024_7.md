# 07_WORK_HISTORY_STEP024_7

## STEP
STEP024.7 — deploy-stable webhook/bot-init + public npm registry lock baseline

## Goal
Stabilize the first live Vercel deployment by pinning dependency install behavior to the public npm registry and ensuring the Telegram webhook always awaits a fully initialized grammY bot before update handling.

## What changed
- added root `.npmrc` with `registry=https://registry.npmjs.org/`
- pinned `packageManager` to `npm@10.8.2`
- preserved public registry URLs in `package-lock.json`
- made `createBot()` async with explicit `await bot.init()` inside the bot factory
- ensured `api/webhook.js` awaits `createBot()` before `handleUpdate()`
- added `scripts/smoke_telegram_bot_init_contract.js` to protect the webhook/bot-init contract
- moved repo health/docs markers forward to the deploy-stable baseline

## Why
The live deployment had two practical failure modes: broken dependency resolution when lockfiles referenced an internal registry, and runtime webhook crashes when the first update hit an uninitialized bot instance.

## Outcome
The bot reached a live deploy-stable baseline on Vercel with healthy webhook responses, no pending Telegram updates, and a reproducible dependency-install path.

## Validation
- source verification of public registry lock in `.npmrc` and `package-lock.json`
- source verification that `createBot()` is async and `api/webhook.js` awaits it
- `node scripts/smoke_telegram_bot_init_contract.js`

## Truth
- source-confirmed: yes
- live-confirmed: yes, by operator evidence outside this repo snapshot
- blocked: still needed later OAuth live verification for the LinkedIn connect flow
