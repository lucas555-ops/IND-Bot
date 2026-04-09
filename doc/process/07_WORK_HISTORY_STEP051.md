# STEP051 — Invite contacts / Telegram-native inline share layer

## Goal
Add a narrow invite layer to Intro Deck so members can share the bot in a Telegram-native way without pushing the product into reward mechanics or growth-gimmicks.

## What changed
- added `/invite` command and a dedicated `📨 Invite contacts` surface;
- added a primary inline-share CTA plus two fallback actions: `Show link` and `Get invite card`;
- added `member_invites` persistence for invite attribution truth;
- `/start` now parses invite deep links and records first-start attribution when the invited user is genuinely new;
- invite attribution now differentiates source path using distinct start prefixes:
  - `ii_` inline share
  - `il_` raw link
  - `ic_` invite card
- home and help surfaces now expose the invite entrypoint for connected members;
- added honest invite counters and recent invited-contact rows to the invite surface;
- kept scope narrow: no rewards, no quota bonuses, no leaderboard layer.

## Important truth
- invite credit only applies on first start for a genuinely new Telegram user in this product;
- self-referrals are ignored;
- invalid or unknown invite links are ignored;
- `Activated` is derived from current product truth rather than a new synthetic milestone;
- live inline-share depends on BotFather inline-mode config in addition to deploy.

## Verification
- `npm run check`
- `node scripts/smoke_invite_contract.js`
- `node scripts/smoke_command_contract.js`
- `node scripts/smoke_product_surface_contract.js`
- `node scripts/smoke_help_fallback_callback_contract.js`
