# 08_TELEGRAM_UI_ROUTER_CONTRACT

## Why this is mandatory here

This project is a screen-based Telegram product, not a reply-chain utility bot.

Therefore the default model is:

**single-surface router**

- inline callbacks
- edit current message by default
- reply/push fallback only when edit is impossible or harmful
- explicit `Back / Menu / Home`
- every screen as a render function
- one safe UI helper

## Render contract

Route -> compute state -> render screen -> try edit -> fallback only if edit is impossible.

Required helper semantics:
- try edit first
- no silent no-op
- centralized fallback behavior

## Navigation contract

### Back
Local deterministic return by explicit return-context.

### Menu
Hub of the current working mode.

### Home
Global root and safe reset.

These are not interchangeable.

## Callback contract

Callback payloads must be:
- compact
- ordered
- namespaced
- short enough for Telegram limits

Minimum payload should carry:
- action
- entity/context id
- ret

If payload grows, use hydration/token patterns instead of long inline JSON.

## Hot path rule

Hot menu paths must stay DB-light.
Menus are routing surfaces, not dashboards.

## Input mode rule

Any wait-for-input state must provide escape paths:
- Cancel
- Menu
- Home
- Back when needed

Menu/Home transitions must clear pending input state.

## Push-new-surface rule

Do not blindly overwrite:
- receipts
- service/system messages
- confirmations that must remain visible
- contexts where edit breaks UX

## Anti-patterns

- silent failures
- dead ends
- guess-based back navigation
- callback namespace drift
- reply-bot spam instead of app-like navigation
- critical truth stored only in callback payloads
