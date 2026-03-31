import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { createAdminSurfaceBuilders } from '../src/bot/surfaces/adminSurfaces.js';
import { loadAdminUserSegmentBulkActions } from '../src/lib/storage/adminStore.js';

const state = await loadAdminUserSegmentBulkActions({ segmentKey: 'listact' });
assert.equal(state.segmentKey, 'listact');
assert.equal(state.persistenceEnabled, false);
assert.match(String(state.reason || ''), /DATABASE_URL is not configured/);

const surfaces = createAdminSurfaceBuilders({ currentStep: 'STEP050I' });
const surface = await surfaces.buildAdminBulkActionsSurface({
  state: {
    ...state,
    persistenceEnabled: false,
    segmentLabel: 'Листинг · активные',
    noticeAction: { supported: true, estimate: 12, templateLabel: 'Reconnect nudge', audienceLabel: 'Active listed users' },
    broadcastAction: { supported: true, estimate: 7, templateLabel: 'Operator update', audienceLabel: 'Active listed users' },
    activeNotice: false
  },
  page: 0
});

const text = surface.text;
assert.match(text, /Массовые действия/);
assert.match(text, /Безопасный режим: только подготовка шаблона/);
assert.match(text, /Reconnect nudge/);
assert.match(text, /Operator update/);

const keyboard = JSON.stringify(surface.reply_markup.inline_keyboard);
for (const callback of ['adm:bulk:user:listact:0:not', 'adm:bulk:user:listact:0:bc', 'adm:usr:page:listact:0']) {
  if (!keyboard.includes(callback)) {
    throw new Error(`Bulk actions keyboard missing callback: ${callback}`);
  }
}

const composerSource = readFileSync(new URL('../src/bot/composers/operatorComposer.js', import.meta.url), 'utf8');
for (const needle of ['adm:bulk:user:', 'prepareAdminUserSegmentBulkNotice', 'prepareAdminUserSegmentBulkBroadcast']) {
  if (!composerSource.includes(needle)) {
    throw new Error(`Operator composer missing bulk actions contract: ${needle}`);
  }
}

console.log('OK: admin bulk actions contract');
