import { Composer } from 'grammy';
import { safeEditOrReply } from '../../lib/telegram/safeEditOrReply.js';
import { decideIntroRequestForTelegramUser } from '../../lib/storage/introRequestStore.js';
import { deliverIntroNotificationReceipt } from '../../lib/storage/notificationStore.js';
import { formatUserFacingError } from '../utils/notices.js';

export function createIntroComposer({
  clearAllPendingInputs,
  buildIntroInboxSurface,
  buildIntroDetailSurface,
  buildDirectoryCardSurface,
  formatIntroDecisionReason
}) {
  const composer = new Composer();

  composer.callbackQuery('intro:inbox', async (ctx) => {
    await ctx.answerCallbackQuery();
    await clearAllPendingInputs(ctx.from.id);
    const surface = await buildIntroInboxSurface(ctx);
    await safeEditOrReply(ctx, surface.text, { reply_markup: surface.reply_markup });
  });

  composer.callbackQuery('intro:noop', async (ctx) => {
    await ctx.answerCallbackQuery({ text: 'No linked public profile card is available for this row yet.' });
  });

  composer.callbackQuery(/^intro:view:(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await clearAllPendingInputs(ctx.from.id);
    const introRequestId = Number.parseInt(ctx.match?.[1] || '0', 10);
    const surface = await buildIntroDetailSurface(ctx, introRequestId);
    await safeEditOrReply(ctx, surface.text, { reply_markup: surface.reply_markup });
  });

  composer.callbackQuery(/^intro:open:(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await clearAllPendingInputs(ctx.from.id);
    const profileId = Number.parseInt(ctx.match?.[1] || '0', 10);
    const surface = await buildDirectoryCardSurface(ctx, profileId, 0, 'Opened from intro inbox.');

    if (!surface.reply_markup?.inline_keyboard?.length || surface.text.includes('Listed profile not found.')) {
      const inboxSurface = await buildIntroInboxSurface(ctx, '⚠️ Linked profile card is not available right now.');
      await safeEditOrReply(ctx, inboxSurface.text, { reply_markup: inboxSurface.reply_markup });
      return;
    }

    await safeEditOrReply(ctx, surface.text, { reply_markup: surface.reply_markup });
  });

  composer.callbackQuery(/^intro:(acc|dec):(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await clearAllPendingInputs(ctx.from.id);
    const action = ctx.match?.[1];
    const introRequestId = Number.parseInt(ctx.match?.[2] || '0', 10);

    const result = await decideIntroRequestForTelegramUser({
      telegramUserId: ctx.from.id,
      telegramUsername: ctx.from.username || null,
      introRequestId,
      decision: action
    }).catch((error) => ({
      persistenceEnabled: true,
      changed: false,
      duplicate: false,
      blocked: false,
      reason: String(error?.message || error),
      inbox: null
    }));

    let notice = 'Intro inbox updated.';
    let receiptResult = null;
    if (!result.persistenceEnabled) {
      notice = '⚠️ Persistence is disabled in this environment.';
    } else if (result.changed && result.reason === 'intro_request_accepted') {
      receiptResult = await deliverIntroNotificationReceipt({
        eventType: 'intro_request_accepted',
        introRequestId: result.introRequest?.intro_request_id
      }).catch((error) => ({
        sent: false,
        duplicate: false,
        skipped: false,
        failed: true,
        reason: String(error?.message || error)
      }));

      notice = `✅ Accepted intro request from ${result.introRequest?.display_name || 'this member'}. If you set a public LinkedIn URL, the requester can open it from the accepted intro.`;
      if (receiptResult?.failed) {
        notice += ' Delivery notice may arrive a little later.';
      }
    } else if (result.changed && result.reason === 'intro_request_declined') {
      receiptResult = await deliverIntroNotificationReceipt({
        eventType: 'intro_request_declined',
        introRequestId: result.introRequest?.intro_request_id
      }).catch((error) => ({
        sent: false,
        duplicate: false,
        skipped: false,
        failed: true,
        reason: String(error?.message || error)
      }));

      notice = `✅ Declined intro request from ${result.introRequest?.display_name || 'this member'}.`;
      if (receiptResult?.failed) {
        notice += ' Delivery notice may arrive a little later.';
      }
    } else if (result.duplicate) {
      notice = `ℹ️ ${formatIntroDecisionReason(result.reason)}`;
    } else if (result.throttled) {
      notice = `⏳ ${formatIntroDecisionReason(result.reason)}`;
    } else if (result.blocked) {
      notice = `⚠️ ${formatIntroDecisionReason(result.reason)}`;
    } else {
      notice = `⚠️ ${formatUserFacingError(result.reason, 'Could not update the intro request right now.')}`;
    }

    const detailRequestId = result.introRequest?.intro_request_id || introRequestId;
    const surface = detailRequestId
      ? await buildIntroDetailSurface(ctx, detailRequestId, notice)
      : await buildIntroInboxSurface(ctx, notice);
    await safeEditOrReply(ctx, surface.text, { reply_markup: surface.reply_markup });
  });

  return composer;
}
