import { getTelegramConfig } from '../src/config/env.js';
import { createBot } from '../src/bot/createBot.js';
import { claimWebhookUpdateReceipt } from '../src/lib/storage/runtimeGuardStore.js';
import { secretsMatch } from '../src/lib/crypto/secretCompare.js';

function readWebhookSecretHeader(req) {
  return req?.headers?.['x-telegram-bot-api-secret-token'] || req?.headers?.['X-Telegram-Bot-Api-Secret-Token'] || null;
}

function readUpdateId(update) {
  const candidate = update?.update_id;
  return Number.isInteger(candidate) && candidate >= 0 ? candidate : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const { webhookSecret } = getTelegramConfig();
  if (!webhookSecret) {
    return res.status(503).json({ ok: false, error: 'webhook_secret_not_configured' });
  }

  const providedSecret = readWebhookSecretHeader(req);
  if (!secretsMatch(webhookSecret, providedSecret)) {
    return res.status(401).json({ ok: false, error: 'invalid_webhook_secret' });
  }

  const updateId = readUpdateId(req.body);
  if (updateId === null) {
    return res.status(400).json({ ok: false, error: 'invalid_update_id' });
  }

  try {
    const receipt = await claimWebhookUpdateReceipt({ updateId }).catch((error) => {
      console.warn('[api/webhook] runtime guard degraded', error?.message || error);
      return {
        persistenceEnabled: false,
        accepted: true,
        duplicate: false,
        degraded: true,
        reason: 'runtime_guard_failed'
      };
    });

    if (receipt.duplicate) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    const bot = createBot();
    await bot.handleUpdate(req.body);
    return res.status(200).json({ ok: true, dedupeDegraded: Boolean(receipt.degraded) });
  } catch (error) {
    console.error('[api/webhook] failed', error);
    return res.status(500).json({ ok: false, error: 'webhook_failed' });
  }
}
