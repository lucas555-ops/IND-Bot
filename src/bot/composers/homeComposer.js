import { Composer } from 'grammy';
import { safeEditOrReply } from '../../lib/telegram/safeEditOrReply.js';

export function createHomeComposer({ appBaseUrl, buildHomeSurface, clearAllPendingInputs }) {
  const composer = new Composer();

  const renderHome = async (ctx, method = 'edit') => {
    await clearAllPendingInputs(ctx.from.id);
    const surface = await buildHomeSurface(ctx, appBaseUrl);
    if (method === 'reply') {
      await ctx.reply(surface.text, { reply_markup: surface.reply_markup });
      return;
    }
    await safeEditOrReply(ctx, surface.text, { reply_markup: surface.reply_markup });
  };

  composer.command('start', async (ctx) => {
    await renderHome(ctx, 'reply');
  });

  composer.command('menu', async (ctx) => {
    await renderHome(ctx, 'reply');
  });

  composer.callbackQuery('home:root', async (ctx) => {
    await ctx.answerCallbackQuery();
    await renderHome(ctx, 'edit');
  });

  return composer;
}
