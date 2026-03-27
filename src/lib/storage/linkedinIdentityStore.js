import { withDbTransaction, isDatabaseConfigured } from '../../db/pool.js';
import { upsertTelegramUser } from '../../db/usersRepo.js';
import { upsertLinkedInAccount } from '../../db/linkedinRepo.js';
import { ensureProfileDraft } from '../../db/profileRepo.js';

export async function persistLinkedInIdentity({ telegramUserId, telegramUsername = null, identity, rawTokenPayload, rawUserInfo }) {
  if (!identity?.linkedinSub) {
    throw new Error('Cannot persist LinkedIn identity without linkedinSub');
  }

  if (!isDatabaseConfigured()) {
    return {
      persisted: false,
      reason: 'DATABASE_URL is not configured',
      telegramUserId,
      identity
    };
  }

  return withDbTransaction(async (client) => {
    const user = await upsertTelegramUser(client, {
      telegramUserId,
      telegramUsername
    });

    const linkedinAccount = await upsertLinkedInAccount(client, {
      userId: user.id,
      identity,
      rawIdentityPayload: {
        identity,
        token: rawTokenPayload,
        userinfo: rawUserInfo
      }
    });

    const profileDraft = await ensureProfileDraft(client, {
      userId: user.id,
      identity
    });

    return {
      persisted: true,
      reason: 'LinkedIn identity persisted and profile draft ensured',
      user,
      linkedinAccount,
      profileDraft
    };
  });
}
