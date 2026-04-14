# STEP052.8.1 — Admin Invite Copy + Mode Clarity Hotfix

## What changed
- Removed raw `<b>` markup leakage from admin invite deep views by switching those screens to plain structured section labels.
- Reworked admin invite copy so each deep view explains:
  - what the screen is for,
  - what the current mode means,
  - what the next valid operator action is.
- Renamed invite admin navigation labels to clearer Russian admin wording:
  - `Награды`
  - `Подтверждение`
  - `История режима`
- Made rewards mode change feedback clearer in Telegram after operator switches mode.
- Made settlement/reconcile notices clearer and more operator-readable.
- Tightened user invite copy so share formats and next actions read more cleanly.

## What did not change
- No reward rule changes.
- No settlement math changes.
- No redeem flow logic changes.
- No founder/operator role model changes.
- No broad admin shell rewrite outside the invite corridor.

## Why
After the STEP052.8 deep-surface split, the remaining friction was not routing but copy clarity:
- some invite admin screens still showed mixed RU/EN phrasing,
- mode effects were not explained directly enough,
- `<b>` tags leaked into Telegram admin output,
- post-switch feedback could be more explicit.

This hotfix keeps the scope narrow and operator-facing.
