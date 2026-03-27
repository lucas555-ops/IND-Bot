import { getRuntimeGuardConfig } from '../../config/env.js';
import { isDatabaseConfigured, withDbClient } from '../../db/pool.js';
import {
  claimTelegramUpdateReceipt,
  cleanupExpiredTelegramUpdateReceipts,
  cleanupExpiredUserActionGuards
} from '../../db/runtimeGuardRepo.js';

export async function claimWebhookUpdateReceipt({ updateId }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      accepted: true,
      duplicate: false,
      degraded: true,
      reason: 'DATABASE_URL is not configured'
    };
  }

  const { updateDedupeTtlSeconds } = getRuntimeGuardConfig();
  return withDbClient(async (client) => {
    const result = await claimTelegramUpdateReceipt(client, {
      updateId,
      ttlSeconds: updateDedupeTtlSeconds
    });

    return {
      persistenceEnabled: true,
      accepted: Boolean(result.accepted),
      duplicate: Boolean(result.duplicate),
      degraded: false,
      reason: result.duplicate ? 'duplicate_webhook_update' : 'webhook_update_claimed'
    };
  });
}

export async function cleanupExpiredRuntimeGuards() {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      telegramUpdateReceiptsDeletedCount: 0,
      userActionGuardsDeletedCount: 0,
      totalDeletedCount: 0,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbClient(async (client) => {
    const updateReceipts = await cleanupExpiredTelegramUpdateReceipts(client);
    const actionGuards = await cleanupExpiredUserActionGuards(client);
    const totalDeletedCount = updateReceipts.deletedCount + actionGuards.deletedCount;

    return {
      persistenceEnabled: true,
      telegramUpdateReceiptsDeletedCount: updateReceipts.deletedCount,
      userActionGuardsDeletedCount: actionGuards.deletedCount,
      totalDeletedCount,
      reason: totalDeletedCount > 0 ? 'runtime_guards_cleaned' : 'runtime_guards_already_clean'
    };
  });
}
