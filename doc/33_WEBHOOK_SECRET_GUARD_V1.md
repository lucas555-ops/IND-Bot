# 33_WEBHOOK_SECRET_GUARD_V1

STEP011D adds a fail-closed ingress guard for the Telegram webhook endpoint.

## What is real now

- `.env.example` includes `TELEGRAM_WEBHOOK_SECRET`
- `src/config/env.js` validates the secret format
- `api/webhook.js` requires the header `X-Telegram-Bot-Api-Secret-Token`
- mismatched or missing secret header returns `401 invalid_webhook_secret`
- missing configured secret returns `503 webhook_secret_not_configured`
- health/public flags expose whether the secret is configured

## Truth boundary

This step hardens ingress. It does not automate webhook registration. The deploy operator must still set the webhook with Telegram using `secret_token`, and live delivery remains unconfirmed until manually verified. Telegram documents that `setWebhook` can take `secret_token`, and if set, requests contain the `X-Telegram-Bot-Api-Secret-Token` header. citeturn550550search0
