# STEP051.2 — Home/help menu organization polish

## Goal
Tighten the user-facing menu order so the main Telegram surfaces feel cleaner on mobile without changing product truth or adding new growth mechanics.

## Scope
- Reorder the home surface buttons into a clearer member-first flow.
- Mirror that order on the help surface.
- Promote the existing `Plans` surface into the main home/help navigation.
- Keep invite/photo-card, attribution, LinkedIn, intro, DM, and admin contracts unchanged.

## What changed
- `renderHomeKeyboard()` now uses one cleaner order:
  1. Connect LinkedIn or Edit/Complete profile
  2. Browse directory
  3. Intro inbox
  4. DM inbox
  5. Plans
  6. Invite contacts
  7. Help
  8. Админка (founder/operator only)
- disconnected users with persistence enabled now see:
  1. Connect LinkedIn
  2. Browse directory
  3. Plans
  4. Help
  5. Админка (if allowlisted)
- `renderHelpText()` now mentions plans / Pro status explicitly.
- `renderHelpKeyboard()` now mirrors the same navigation order and includes `⭐ Plans` before `📨 Invite contacts`.
- fallback help surface copy/keyboard in `appSurfaces.js` was aligned to the same order.
- smoke contracts were tightened so order regressions are caught in source checks.

## What did not change
- no schema changes
- no invite storage / attribution changes
- no change to inline photo-card behavior
- no change to LinkedIn auth or browse/inbox business logic
- no change to founder/operator allowlist gating

## Verification
- `npm run check`
- `node scripts/smoke_router_contract.js`
- `node scripts/smoke_command_contract.js`
- `node scripts/smoke_help_fallback_callback_contract.js`
- `node scripts/smoke_invite_contract.js`

## Truth
- This is a surface-organization polish step only.
- Live status not confirmed — manual verification required.
