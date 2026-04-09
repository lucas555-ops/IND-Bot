# STEP051 — INVITE CONTACTS / TELEGRAM-NATIVE INLINE SHARE LAYER

## Goal

Ship a narrow, Telegram-native invite/referral layer without reward mechanics or growth-gimmicks.

## Shipped contract

- members get a dedicated `Invite contacts` surface in the bot
- the invite surface exposes one primary action: `Share invite`
- the primary action uses Telegram inline mode rather than forcing a raw link first
- the invite surface keeps two fallback paths:
  - `Show link`
  - `Get invite card`
- invite attribution is recorded from `start=` deep links
- attribution truth differentiates source path:
  - `inline_share`
  - `raw_link`
  - `invite_card`
- invite stats stay honest:
  - `Friends invited`
  - `Activated`
- no rewards, no bonus economy, no spam-growth loops

## Router / UX scope

- `/invite` command
- home surface entrypoint: `📨 Invite contacts`
- help surface entrypoint: `📨 Invite contacts`
- invite root callback: `invite:root`
- invite fallback callbacks:
  - `invite:show_link`
  - `invite:send_card`
- inline query result for invite sharing
- `/start <payload>` parsing for invite attribution

## Data contract

### New table

- `member_invites`
  - `referrer_user_id`
  - `invited_user_id`
  - `invite_code`
  - `source`
  - `start_param`
  - `joined_at`
  - `activated_at`

### Current activation truth

For STEP051, `Activated` is derived from current product truth:
- LinkedIn connected, or
- member profile exists.

This keeps the metric narrow and source-confirmable without inventing a new engagement contract.

## Invite-link truth

Invite codes are deterministic from the referrer Telegram user id.
Source path is encoded inside the deep-link prefix:
- `ii_` → inline share
- `il_` → raw link
- `ic_` → invite card

This keeps attribution narrow and removes the need for a second invite-code registry table.

## Copy truth

The invite surface should feel like a human share flow, not a promo wall.
It includes:
- one visible raw invite link
- three ready message ideas
- recent invited contacts
- truthful counters

## Out of scope

- referral rewards
- bonus quotas
- leaderboard/gamification
- group/channel viral mechanics
- off-platform attribution
- analytics breakdowns in admin

## Ops / manual requirement

Telegram inline mode must be enabled in BotFather for the primary `Share invite` button to work as intended.
Source implementation is included in STEP051, but live inline readiness still depends on bot configuration and deploy verification.

## Verification

- source verification included
- live status not confirmed — manual verification required
