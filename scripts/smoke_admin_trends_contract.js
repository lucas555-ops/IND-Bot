import { createAdminSurfaceBuilders } from '../src/bot/surfaces/adminSurfaces.js';

const surfaces = createAdminSurfaceBuilders({ currentStep: 'STEP040' });

const home = await surfaces.buildAdminHomeSurface({
  summary: {
    totalUsers: 120,
    connectedUsers: 90,
    profileStartedUsers: 70,
    readyProfiles: 50,
    readyNotListed: 10,
    listedUsers: 40,
    listedActiveUsers: 30,
    noIntroYet: 20,
    firstIntroUsers: 18,
    acceptedIntroUsers: 7,
    failedDeliveries: 2,
    activeNotice: true,
    latestBroadcastStatus: 'sent_with_failures',
    newUsers24h: 6,
    newUsers7d: 19,
    connected24h: 4,
    connected7d: 11,
    listed24h: 2,
    listed7d: 7,
    intros24h: 9,
    intros7d: 31,
    accepted7d: 5,
    declined7d: 2,
    pendingOlder24h: 3,
    failures24h: 1,
    failures7d: 4,
    broadcasts7d: 2,
    directMessages7d: 7
  }
});
for (const fragment of ['Воронка:', 'Подключили LinkedIn: 90', 'Получили первое интро: 18', 'Последняя рассылка: отправлен с ошибками']) {
  if (!home.text.includes(fragment)) {
    throw new Error(`Admin home missing STEP040 fragment: ${fragment}`);
  }
}
if (!JSON.stringify(home.reply_markup.inline_keyboard).includes('adm:home:funnel:accepted')) {
  throw new Error('Admin home keyboard must expose accepted drilldown');
}

const comms = await surfaces.buildAdminCommunicationsSurface({
  state: {
    notice: { isActive: true, audienceKey: 'READY_NOT_LISTED' },
    noticeVisibilityEstimate: 18,
    broadcastDraft: { body: 'Ready' },
    latestBroadcastStatus: 'partial',
    latestBroadcastRecipients: 12,
    latestBroadcastDelivered: 10,
    latestBroadcastFailed: 2,
    directMessages24h: 1,
    directMessages7d: 6,
    recentOutboxFailures: 3,
    outboxFailures24h: 1,
    outboxFailures7d: 3
  }
});
for (const fragment of ['Активное уведомление: да', 'Видимость notice: 18', 'Последняя рассылка: частично', 'Ошибки outbox 7д: 3']) {
  if (!comms.text.includes(fragment)) {
    throw new Error(`Communications hub missing STEP040 fragment: ${fragment}`);
  }
}

const system = await surfaces.buildAdminSystemSurface({
  summary: {
    retryDue: 2,
    exhausted: 1,
    failedDeliveries: 3,
    recentAuditEvents: 12,
    failures24h: 1,
    failures7d: 4,
    delivered24h: 9,
    delivered7d: 32,
    operatorActions24h: 5,
    operatorActions7d: 15,
    listingChanges7d: 4,
    relinks7d: 1
  }
});
for (const fragment of ['Ждут повтора: 2', 'Исчерпано: 1', 'Ошибки 1/24ч • 4/7д', 'Изменения листинга 4/7д • релинки 1/7д']) {
  if (!system.text.includes(fragment)) {
    throw new Error(`System hub missing STEP040 fragment: ${fragment}`);
  }
}

console.log('OK: admin trends contract');
