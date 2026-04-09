# STEP051.4 — Command parity hotfix

## Goal
Fix the live command regressions without widening scope: `/start` should render once, `/menu` should remain the visible home fallback, and `/inbox` should always answer with either the real inbox or a product-safe fallback.

## What changed
- removed the duplicate `/start` runtime ownership from the home composer so start/deep-link handling now lives only in the invite composer;
- kept `/menu` as the explicit visible home fallback;
- hardened `/inbox` rendering with a catch-all fallback path and Telegram-safe text clamping so the slash command does not fail silently when the inbox surface grows too large or throws;
- fixed the accidental home-render argument leak where `appBaseUrl` could be passed into the home surface as if it were a notice;
- updated command/router smoke coverage to assert exactly one `/start` handler and an `/inbox` fallback path.

## Important truth
- this step does not change invite attribution, photo-card behavior, LinkedIn auth, pricing, DM logic, intro decision logic, or the paired menu layout;
- `/start` remains required in runtime for deep links and first-start flows even though it should stay out of the visible BotFather command list;
- live status not confirmed — manual verification required.

## Verification
- `npm run check`
- `node scripts/smoke_command_contract.js`
- `node scripts/smoke_intro_inbox_actions_contract.js`
- `node scripts/smoke_product_surface_contract.js`
- `node scripts/smoke_help_fallback_callback_contract.js`
- `node scripts/smoke_router_contract.js`
