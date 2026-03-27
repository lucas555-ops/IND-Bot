# 07_WORK_HISTORY_STEP024_8

## STEP
STEP024.8 — LinkedIn OAuth route import-resolution hotfix + regression smoke

## Goal
Restore the live `Connect LinkedIn` flow by fixing broken relative imports in the two OAuth serverless route files that were crashing before the handler could run.

## What changed
- fixed relative import paths in `api/oauth/start/linkedin.js`
- fixed relative import paths in `api/oauth/callback/linkedin.js`
- added `scripts/smoke_oauth_route_imports.js` to verify that both OAuth route files resolve every relative local import to a real file path before deploy
- added `npm run smoke:oauth-routes`
- synced repo docs, README, package metadata, and `/api/health` to the new repo baseline

## Why
The bot button and generated URL were correct, but Vercel crashed on route invocation because the OAuth files pointed one directory too far upward when importing shared modules from `src/`. Syntax-only checks could not catch this because `node --check` validates parsing, not runtime module resolution.

## Outcome
The LinkedIn OAuth start route can now load on Vercel instead of crashing immediately from `ERR_MODULE_NOT_FOUND`. The callback route is fixed in the same pass so the flow does not fail at the next step.

## Validation
- `npm run check`
- `npm run smoke:auth`
- `npm run smoke:oauth-routes`
- manual source verification of corrected relative paths in both OAuth route files

## Truth
- source-confirmed: yes
- live-confirmed: no
- blocked: still requires redeploy plus a real end-to-end LinkedIn connect test against production env
