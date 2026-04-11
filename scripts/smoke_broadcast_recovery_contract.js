import { readFileSync } from 'node:fs';
import { createAdminSurfaceBuilders } from '../src/bot/surfaces/adminSurfaces.js';

const surfaces = createAdminSurfaceBuilders({ currentStep: 'STEP051.9' });

const broadcastSurface = await surfaces.buildAdminBroadcastSurface({
  state: {
    draft: {
      body: 'Recovery draft',
      audienceKey: 'ALL_CONNECTED',
      mediaRef: null,
      buttonText: null,
      buttonUrl: null,
      updatedAt: new Date().toISOString()
    },
    estimate: 10,
    latestRecord: {
      id: 91,
      status: 'sent_with_failures',
      delivered_count: 7,
      failed_count: 3,
      retry_due_count: 1,
      exhausted_count: 0,
      pending_count: 0,
      estimated_recipient_count: 10,
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      batch_size: 25,
      cursor: 10,
      last_error: 'chat not found'
    }
  }
});

const keyboard = JSON.stringify(broadcastSurface.reply_markup.inline_keyboard);
for (const callback of ['adm:bc:retry:failed:91', 'adm:bc:retry:retry_due:91']) {
  if (!keyboard.includes(callback)) {
    throw new Error(`Broadcast recovery action missing ${callback}`);
  }
}

const outboxRecordSurface = await surfaces.buildAdminOutboxRecordSurface({
  record: {
    id: 91,
    event_type: 'broadcast',
    status: 'sent_with_failures',
    failed_count: 3,
    retry_due_count: 1,
    exhausted_count: 0,
    pending_count: 0,
    body: 'Hello',
    audience_key: 'ALL_CONNECTED'
  },
  backCallback: 'adm:bc'
});

const recordKeyboard = JSON.stringify(outboxRecordSurface.reply_markup.inline_keyboard);
for (const callback of ['adm:bc:retry:failed:91', 'adm:bc:retry:retry_due:91']) {
  if (!recordKeyboard.includes(callback)) {
    throw new Error(`Outbox record recovery action missing ${callback}`);
  }
}

const storeSource = readFileSync(new URL('../src/lib/storage/adminStore.js', import.meta.url), 'utf8');
for (const fragment of ['retryAdminBroadcastRecoveries', 'listAdminBroadcastDeliveryItemsByStatuses', 'deriveBroadcastTaskStatus']) {
  if (!storeSource.includes(fragment)) {
    throw new Error(`Broadcast recovery store fragment missing: ${fragment}`);
  }
}

console.log('OK: broadcast recovery contract');
