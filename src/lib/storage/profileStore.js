import { withDbClient, isDatabaseConfigured } from '../../db/pool.js';
import { upsertTelegramUser } from '../../db/usersRepo.js';
import { getProfileSnapshotByTelegramUserId } from '../../db/profileRepo.js';

export async function touchTelegramUserAndLoadProfile({ telegramUserId, telegramUsername = null }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      profile: null,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbClient(async (client) => {
    await upsertTelegramUser(client, {
      telegramUserId,
      telegramUsername
    });

    const profile = await getProfileSnapshotByTelegramUserId(client, telegramUserId);

    return {
      persistenceEnabled: true,
      profile,
      reason: profile ? 'profile_loaded' : 'profile_not_found'
    };
  });
}
