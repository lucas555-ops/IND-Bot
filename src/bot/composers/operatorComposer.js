import { Composer } from 'grammy';
import { safeEditOrReply } from '../../lib/telegram/safeEditOrReply.js';

function parseOpsIntroRequestId(text = '') {
  const match = String(text).match(/^\/ops(?:@\w+)?(?:\s+(\d+))?/);
  if (!match?.[1]) {
    return null;
  }

  const value = Number.parseInt(match[1], 10);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function createOperatorComposer({ clearAllPendingInputs, buildOperatorDiagnosticsSurface }) {
  const composer = new Composer();

  async function renderOperatorSurface(ctx, options = {}, method = 'edit') {
    await clearAllPendingInputs(ctx.from.id);
    const surface = await buildOperatorDiagnosticsSurface(ctx, options);
    if (method === 'reply') {
      await ctx.reply(surface.text, { reply_markup: surface.reply_markup });
      return;
    }

    await safeEditOrReply(ctx, surface.text, { reply_markup: surface.reply_markup });
  }

  composer.command('ops', async (ctx) => {
    const introRequestId = parseOpsIntroRequestId(ctx.message?.text || '');
    await renderOperatorSurface(ctx, introRequestId ? { introRequestId } : {}, 'reply');
  });

  composer.callbackQuery('ops:diag', async (ctx) => {
    await ctx.answerCallbackQuery();
    await renderOperatorSurface(ctx, {}, 'edit');
  });

  composer.callbackQuery(/^ops:b:(all|due|fal|exh)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const code = ctx.match?.[1];
    const bucket = code === 'due' ? 'retry_due' : code === 'fal' ? 'failed' : code === 'exh' ? 'exhausted' : null;
    await renderOperatorSurface(ctx, bucket ? { bucket } : {}, 'edit');
  });

  composer.callbackQuery(/^ops:i:(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const introRequestId = Number.parseInt(ctx.match?.[1] || '0', 10);
    await renderOperatorSurface(ctx, { introRequestId }, 'edit');
  });

  return composer;
}
