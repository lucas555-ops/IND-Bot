import { getNotificationRetryConfig, getPublicFlags } from '../../src/config/env.js';
import { retryDueNotificationReceipts } from '../../src/lib/storage/notificationStore.js';
import { secretsMatch } from '../../src/lib/crypto/secretCompare.js';

function readRetrySecretHeader(req) {
  return req?.headers?.['x-notification-retry-secret'] || req?.headers?.['X-Notification-Retry-Secret'] || null;
}

function readAuthorizationHeader(req) {
  return req?.headers?.authorization || req?.headers?.Authorization || null;
}

function readAuthorizationBearer(req) {
  const authorization = readAuthorizationHeader(req);
  if (!authorization || typeof authorization !== 'string') {
    return null;
  }

  const [scheme, token] = authorization.split(/\s+/, 2);
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
    return null;
  }

  return token;
}

function resolveRetryAuth({ req, retryConfig }) {
  const cronToken = readAuthorizationBearer(req);
  if (retryConfig.cronSecret && secretsMatch(retryConfig.cronSecret, cronToken)) {
    return {
      authenticated: true,
      mode: 'cron_bearer'
    };
  }

  const retrySecret = readRetrySecretHeader(req);
  if (retryConfig.retrySecret && secretsMatch(retryConfig.retrySecret, retrySecret)) {
    return {
      authenticated: true,
      mode: 'manual_retry_secret'
    };
  }

  return {
    authenticated: false,
    mode: null
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const flags = getPublicFlags();
  const retryConfig = getNotificationRetryConfig();
  if (!flags.notificationReceiptsConfigured) {
    return res.status(503).json({ ok: false, error: 'notification_receipts_not_configured' });
  }

  if (!retryConfig.retrySecret && !retryConfig.cronSecret) {
    return res.status(503).json({ ok: false, error: 'notification_retry_auth_not_configured' });
  }

  const auth = resolveRetryAuth({ req, retryConfig });
  if (!auth.authenticated) {
    return res.status(401).json({ ok: false, error: 'invalid_notification_retry_auth' });
  }

  try {
    const result = await retryDueNotificationReceipts();
    return res.status(200).json({
      ok: true,
      authMode: auth.mode,
      ...result
    });
  } catch (error) {
    console.error('[api/cron/notification-retry] failed', error);
    return res.status(500).json({ ok: false, error: 'notification_retry_failed' });
  }
}
