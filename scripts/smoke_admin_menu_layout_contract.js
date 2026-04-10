import { createAdminSurfaceBuilders } from '../src/bot/surfaces/adminSurfaces.js';

function rowHasCallbacks(rows, callbacks) {
  return rows.some((row) => callbacks.every((callback) => row.some((button) => button.callback_data === callback)));
}

const surfaces = createAdminSurfaceBuilders({ currentStep: 'STEP051.6' });

const home = await surfaces.buildAdminHomeSurface({
  summary: {
    connectedUsers: 12,
    profileStartedUsers: 8,
    readyNotListed: 3,
    listedUsers: 5,
    noIntroYet: 4,
    acceptedIntroUsers: 2,
    firstIntroUsers: 3,
    failedDeliveries: 1
  }
});
const homeRows = home.reply_markup.inline_keyboard;
if (!rowHasCallbacks(homeRows, ['adm:ops', 'adm:comms'])) {
  throw new Error('Admin home should pair operations and communications');
}
if (!rowHasCallbacks(homeRows, ['adm:money', 'adm:sys'])) {
  throw new Error('Admin home should pair monetization and system');
}

const comms = await surfaces.buildAdminCommunicationsSurface({
  state: {
    noticeVisibilityEstimate: 9,
    latestBroadcastRecipients: 22,
    recentOutboxFailures: 1,
    directMessages24h: 3,
    notice: { isActive: true, audienceKey: 'ALL' },
    broadcastDraft: { body: 'Hello' }
  }
});
const commRows = comms.reply_markup.inline_keyboard;
if (!rowHasCallbacks(commRows, ['adm:not', 'adm:bc'])) {
  throw new Error('Communications hub should pair notice and broadcast');
}
if (!rowHasCallbacks(commRows, ['adm:tpl', 'adm:outbox'])) {
  throw new Error('Communications hub should pair templates and outbox');
}
if (!rowHasCallbacks(commRows, ['adm:home', 'home:root'])) {
  throw new Error('Communications hub should pair back/admin home navigation');
}

const broadcast = await surfaces.buildAdminBroadcastSurface({
  state: {
    draft: { body: 'Hello world', audienceKey: 'ALL_CONNECTED' },
    estimate: 4,
    latestRecord: null
  }
});
const broadcastRows = broadcast.reply_markup.inline_keyboard;
if (!rowHasCallbacks(broadcastRows, ['adm:bc:edit', 'adm:bc:tpl'])) {
  throw new Error('Broadcast surface should pair edit and templates');
}
if (!rowHasCallbacks(broadcastRows, ['adm:bc:aud', 'adm:bc:preview'])) {
  throw new Error('Broadcast surface should pair audience and preview');
}
if (!rowHasCallbacks(broadcastRows, ['adm:bc:send', 'adm:bc:refresh'])) {
  throw new Error('Broadcast surface should pair send and refresh');
}
if (!rowHasCallbacks(broadcastRows, ['adm:comms', 'home:root'])) {
  throw new Error('Broadcast surface should pair back to communications and home');
}

const notice = await surfaces.buildAdminNoticeSurface({
  state: {
    notice: { isActive: false, audienceKey: 'ALL', body: 'Notice body' },
    estimate: 5
  }
});
const noticeRows = notice.reply_markup.inline_keyboard;
if (!rowHasCallbacks(noticeRows, ['adm:not:edit', 'adm:not:tpl'])) {
  throw new Error('Notice surface should pair edit and templates');
}
if (!rowHasCallbacks(noticeRows, ['adm:not:aud', 'adm:not:preview'])) {
  throw new Error('Notice surface should pair audience and preview');
}
if (!rowHasCallbacks(noticeRows, ['adm:comms', 'home:root'])) {
  throw new Error('Notice surface should pair back to communications and home');
}

console.log('OK: admin menu layout contract');
