# 07_WORK_HISTORY_STEP051_5

## STEP051.5 — pricing surface hotfix

### Why this step exists

After STEP051.4, the user confirmed `/inbox` was fixed, but the promoted `⭐ Plans` button still failed live in production. Vercel logs showed the exact runtime error: `TypeError: renderPricingText is not a function` inside `buildPricingSurface(...)`. This meant the monetization composer and callback routing were wired, but the member pricing render layer was missing from `src/lib/telegram/render.js`.

### What changed

- added `renderPricingText({ pricingState })` to the Telegram render layer;
- added `renderPricingKeyboard({ pricingState })` to the Telegram render layer;
- restored a real member-facing pricing surface for `⭐ Plans`, `/plans`, and `plans:root`;
- kept the STEP051 invite/photo-card, STEP051.3 paired menu layout, and STEP051.4 command parity work unchanged.

### Product result

The user-facing Plans entry is now a real screen again instead of a dead button. Members can see:

- current Pro status;
- monthly Pro price and duration;
- per-action Stars pricing for direct contact and DM opens when Pro is inactive;
- recent purchase receipts when present;
- a clear buy/refresh/home action set.

### What was not changed

- no invite layer changes;
- no LinkedIn auth changes;
- no DM/contact unlock runtime changes;
- no menu IA rewrite;
- no schema or migration changes.

### Verification

Source verification for this step should include:

- `npm run check`
- `node scripts/smoke_pricing_contract.js`
- `node scripts/smoke_command_contract.js`

Live status not confirmed — manual verification required.
