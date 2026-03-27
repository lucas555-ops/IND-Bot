import { getLinkedInConfig } from '../../../src/config/env.js';
import { buildAuthorizeUrl, buildSignedState, fetchOidcDiscovery } from '../../../src/lib/linkedin/oidc.js';

function escapeHtml(input) {
  return String(input)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderHtml({ title, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px auto; max-width: 720px; padding: 0 16px; line-height: 1.5; }
      .card { border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; }
      code { background: #f3f4f6; padding: 2px 6px; border-radius: 6px; }
    </style>
  </head>
  <body>
    <div class="card">
      ${body}
    </div>
  </body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send(renderHtml({
      title: 'Method not allowed',
      body: '<h1>Method not allowed</h1>'
    }));
  }

  const url = new URL(req.url, 'http://localhost');
  const telegramUserId = url.searchParams.get('tg_id');
  const returnTo = url.searchParams.get('ret') || '/menu';
  const redirect = url.searchParams.get('redirect') !== '0';

  if (!telegramUserId || !/^\d+$/.test(telegramUserId)) {
    return res.status(400).send(renderHtml({
      title: 'Invalid Telegram user',
      body: '<h1>Invalid Telegram user</h1><p>The sign-in link is missing a valid Telegram user id.</p>'
    }));
  }

  try {
    const { clientId, redirectUri, stateSecret, stateTtlSeconds, oidcDiscoveryUrl, scopes } = getLinkedInConfig();
    const discovery = await fetchOidcDiscovery(oidcDiscoveryUrl);
    const state = buildSignedState({
      telegramUserId,
      returnTo,
      ttlSeconds: stateTtlSeconds,
      secret: stateSecret
    });

    const authorizeUrl = buildAuthorizeUrl({
      discovery,
      clientId,
      redirectUri,
      scopes,
      state
    });

    if (redirect) {
      res.statusCode = 302;
      res.setHeader('Location', authorizeUrl);
      return res.end();
    }

    return res.status(200).json({ ok: true, authorize_url: authorizeUrl });
  } catch (error) {
    console.error('[linkedin start] failed', error);
    return res.status(500).send(renderHtml({
      title: 'LinkedIn sign-in unavailable',
      body: '<h1>LinkedIn sign-in is unavailable</h1><p>Please try again in a moment.</p>'
    }));
  }
}
