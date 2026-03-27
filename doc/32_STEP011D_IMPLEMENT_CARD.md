# 32_STEP011D_IMPLEMENT_CARD

## STEP

STEP011D — webhook secret token guard

## Goal

Close the current unauthenticated webhook ingress gap before extending intro workflow UX.

## Scope

- add `TELEGRAM_WEBHOOK_SECRET` to env contract
- fail closed in `api/webhook.js` when the secret is missing
- reject mismatched or missing `X-Telegram-Bot-Api-Secret-Token`
- surface webhook secret readiness in health/public flags
- add smoke coverage for the webhook secret contract

## Non-goals

- no Telegram setWebhook automation
- no IP allowlisting
- no retry/dedupe layer
- no rate limiting

## Acceptance

- webhook rejects non-POST methods with 405
- webhook rejects missing/mismatched secret header with 401
- webhook rejects missing configured secret with 503
- webhook still handles valid POST requests after the guard path
- env and docs canon include the secret contract
