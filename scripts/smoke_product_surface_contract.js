import {
  renderDirectoryFiltersKeyboard,
  renderHomeKeyboard,
  renderHomeText,
  renderIntroDetailText,
  renderIntroInboxKeyboard,
  renderIntroInboxText,
  renderProfilePreviewKeyboard
} from '../src/lib/telegram/render.js';

const homeText = renderHomeText({
  persistenceEnabled: true,
  profileSnapshot: null,
  directoryStats: { totalCount: 0 },
  introInboxStats: { receivedPending: 0, sentPending: 0 }
});

if (homeText.includes('STEP0') || homeText.includes('baseline')) {
  throw new Error('Home text must not expose internal STEP/baseline copy');
}

const homeKeyboard = renderHomeKeyboard({
  appBaseUrl: 'https://example.com',
  telegramUserId: 1,
  persistenceEnabled: true,
  profileSnapshot: { linkedin_sub: 'abc', completion: { isReady: false } }
});
if (homeKeyboard.inline_keyboard.flat().some((button) => button.callback_data === 'home:root')) {
  throw new Error('Home keyboard must not include a Home button on the home surface');
}

const previewKeyboard = renderProfilePreviewKeyboard().inline_keyboard.flat();
if (!previewKeyboard.some((button) => button.callback_data === 'p:menu')) {
  throw new Error('Profile preview keyboard must provide a back-to-profile action');
}

const filtersKeyboardDefault = renderDirectoryFiltersKeyboard().inline_keyboard.flat();
if (filtersKeyboardDefault.some((button) => button.callback_data === 'dir:fc')) {
  throw new Error('Default filter keyboard must not show clear-filters action');
}
if (!filtersKeyboardDefault.some((button) => button.callback_data === 'dir:list:0' && button.text.includes('Back to directory'))) {
  throw new Error('Filter keyboard must provide a back-to-directory action');
}

const inboxText = renderIntroInboxText({
  persistenceEnabled: true,
  inboxState: { counts: { receivedPending: 0, receivedTotal: 0, sentPending: 0, sentTotal: 0 }, received: [], sent: [] }
});
if (inboxText.includes('STEP0') || inboxText.includes('baseline')) {
  throw new Error('Intro inbox text must not expose internal STEP/baseline copy');
}

const detailText = renderIntroDetailText({ persistenceEnabled: true, introRequest: null });
if (detailText.includes('STEP0') || detailText.includes('baseline')) {
  throw new Error('Intro detail text must not expose internal STEP/baseline copy');
}

const inboxKeyboard = renderIntroInboxKeyboard({ inboxState: { received: [], sent: [] } }).inline_keyboard.flat();
if (!inboxKeyboard.some((button) => button.callback_data === 'intro:inbox' && button.text === '🔄 Refresh')) {
  throw new Error('Intro inbox keyboard must use the compact Refresh label');
}

console.log('OK: product surface copy and navigation contract');
