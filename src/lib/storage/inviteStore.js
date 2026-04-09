import { withDbClient, withDbTransaction, isDatabaseConfigured } from '../../db/pool.js';
import { createInviteAttribution, getInviteAttributionByInvitedUserId, getUserByTelegramUserId, loadInviteSnapshotByUserId, parseInviteStartParam } from '../../db/inviteRepo.js';
import { upsertTelegramUser } from '../../db/usersRepo.js';
import { getTelegramConfig } from '../../config/env.js';

export async function loadInviteSurfaceState({ telegramUserId, telegramUsername = null }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      inviteCode: null,
      inviteLink: null,
      inlineInviteLink: null,
      inviteCardLink: null,
      shareInlineQuery: 'invite',
      invitedCount: 0,
      activatedCount: 0,
      invitedBy: null,
      invited: [],
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbClient(async (client) => {
    const user = await upsertTelegramUser(client, {
      telegramUserId,
      telegramUsername
    });

    const snapshot = await loadInviteSnapshotByUserId(client, {
      userId: user.id,
      telegramUserId: user.telegram_user_id,
      botUsername: getTelegramConfig().botUsername
    });

    return {
      persistenceEnabled: true,
      ...snapshot,
      reason: 'invite_snapshot_loaded'
    };
  });
}

export async function attemptInviteAttributionForTelegramUser({ telegramUserId, telegramUsername = null, startParam = null }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      created: false,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const parsed = parseInviteStartParam(startParam);
    if (!parsed) {
      return {
        persistenceEnabled: true,
        created: false,
        ignored: true,
        reason: 'start_param_not_invite'
      };
    }

    const invitedUser = await upsertTelegramUser(client, {
      telegramUserId,
      telegramUsername
    });

    if (String(invitedUser.telegram_user_id) === String(parsed.referrerTelegramUserId)) {
      return {
        persistenceEnabled: true,
        created: false,
        invalid: true,
        reason: 'self_referral'
      };
    }

    const existing = await getInviteAttributionByInvitedUserId(client, invitedUser.id);
    if (existing) {
      return {
        persistenceEnabled: true,
        created: false,
        alreadyLinked: true,
        reason: 'already_linked',
        invitedBy: existing.invitedBy || null
      };
    }

    if (!invitedUser.inserted) {
      return {
        persistenceEnabled: true,
        created: false,
        existingUser: true,
        reason: 'existing_user_not_eligible'
      };
    }

    const referrerUser = await getUserByTelegramUserId(client, parsed.referrerTelegramUserId);
    if (!referrerUser) {
      return {
        persistenceEnabled: true,
        created: false,
        invalid: true,
        reason: 'unknown_referrer'
      };
    }

    const attribution = await createInviteAttribution(client, {
      referrerUserId: referrerUser.id,
      invitedUserId: invitedUser.id,
      inviteCode: parsed.inviteCode,
      source: parsed.source,
      startParam: parsed.raw
    });

    const linked = await getInviteAttributionByInvitedUserId(client, invitedUser.id);

    return {
      persistenceEnabled: true,
      created: true,
      reason: 'invite_linked',
      inviteId: attribution.inviteId,
      invitedBy: linked?.invitedBy || null,
      source: parsed.source
    };
  });
}
