import { getRuntimeGuardConfig } from '../../config/env.js';
import { isDatabaseConfigured, withDbTransaction } from '../../db/pool.js';
import { createOrGetIntroRequest, decideIntroRequest, getIntroInboxStateByUserId, getIntroRequestDetailByUserId } from '../../db/introRepo.js';
import { getProfileSnapshotByUserId } from '../../db/profileRepo.js';
import { tryAcquireUserActionGuard } from '../../db/runtimeGuardRepo.js';
import { upsertTelegramUser } from '../../db/usersRepo.js';

export async function loadIntroInboxState({ telegramUserId, telegramUsername = null }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      inbox: null,
      profile: null,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const user = await upsertTelegramUser(client, { telegramUserId, telegramUsername });
    const profile = await getProfileSnapshotByUserId(client, user.id);
    const inbox = await getIntroInboxStateByUserId(client, { userId: user.id });

    return {
      persistenceEnabled: true,
      inbox,
      profile,
      reason: 'intro_inbox_loaded'
    };
  });
}

export async function sendIntroRequestForTelegramUser({ telegramUserId, telegramUsername = null, targetProfileId }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      changed: false,
      created: false,
      duplicate: false,
      blocked: false,
      throttled: false,
      inbox: null,
      target: null,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const user = await upsertTelegramUser(client, { telegramUserId, telegramUsername });
    const profile = await getProfileSnapshotByUserId(client, user.id);

    const { actionThrottleSeconds } = getRuntimeGuardConfig();
    const sendGuard = await tryAcquireUserActionGuard(client, {
      guardKey: `intro_send:${user.id}:${targetProfileId}`,
      ttlSeconds: actionThrottleSeconds
    });

    if (!sendGuard.acquired) {
      const inbox = await getIntroInboxStateByUserId(client, { userId: user.id });
      return {
        persistenceEnabled: true,
        changed: false,
        created: false,
        duplicate: false,
        blocked: false,
        throttled: true,
        inbox,
        target: null,
        introRequest: null,
        reason: 'intro_request_throttled'
      };
    }

    if (!profile?.linkedin_sub) {
      const inbox = await getIntroInboxStateByUserId(client, { userId: user.id });
      return {
        persistenceEnabled: true,
        changed: false,
        created: false,
        duplicate: false,
        blocked: true,
        throttled: false,
        inbox,
        target: null,
        introRequest: null,
        reason: 'connect_linkedin_before_intro_request'
      };
    }

    const result = await createOrGetIntroRequest(client, { requesterUserId: user.id, targetProfileId });
    const inbox = await getIntroInboxStateByUserId(client, { userId: user.id });

    return {
      persistenceEnabled: true,
      changed: Boolean(result.created),
      created: Boolean(result.created),
      duplicate: Boolean(result.duplicate),
      blocked: Boolean(result.blocked),
      throttled: false,
      inbox,
      target: result.target || null,
      introRequest: result.introRequest || null,
      reason: result.reason
    };
  });
}

export async function decideIntroRequestForTelegramUser({ telegramUserId, telegramUsername = null, introRequestId, decision }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      changed: false,
      duplicate: false,
      blocked: false,
      throttled: false,
      introRequest: null,
      inbox: null,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const user = await upsertTelegramUser(client, { telegramUserId, telegramUsername });
    const profile = await getProfileSnapshotByUserId(client, user.id);

    const { actionThrottleSeconds } = getRuntimeGuardConfig();
    const decisionGuard = await tryAcquireUserActionGuard(client, {
      guardKey: `intro_decision:${user.id}:${introRequestId}`,
      ttlSeconds: actionThrottleSeconds
    });

    if (!decisionGuard.acquired) {
      const inbox = await getIntroInboxStateByUserId(client, { userId: user.id });
      return {
        persistenceEnabled: true,
        changed: false,
        duplicate: false,
        blocked: false,
        throttled: true,
        introRequest: null,
        inbox,
        reason: 'intro_decision_throttled'
      };
    }

    if (!profile?.linkedin_sub) {
      const inbox = await getIntroInboxStateByUserId(client, { userId: user.id });
      return {
        persistenceEnabled: true,
        changed: false,
        duplicate: false,
        blocked: true,
        throttled: false,
        introRequest: null,
        inbox,
        reason: 'connect_linkedin_before_intro_decision'
      };
    }

    const result = await decideIntroRequest(client, {
      userId: user.id,
      introRequestId,
      decision
    });
    const inbox = await getIntroInboxStateByUserId(client, { userId: user.id });

    return {
      persistenceEnabled: true,
      changed: Boolean(result.changed),
      duplicate: Boolean(result.duplicate),
      blocked: Boolean(result.blocked),
      throttled: false,
      introRequest: result.introRequest || null,
      inbox,
      reason: result.reason
    };
  });
}

export async function loadIntroRequestDetailForTelegramUser({ telegramUserId, telegramUsername = null, introRequestId }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      introRequest: null,
      profile: null,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const user = await upsertTelegramUser(client, { telegramUserId, telegramUsername });
    const profile = await getProfileSnapshotByUserId(client, user.id);
    const result = await getIntroRequestDetailByUserId(client, { userId: user.id, introRequestId });

    return {
      persistenceEnabled: true,
      introRequest: result.introRequest || null,
      profile,
      blocked: Boolean(result.blocked),
      reason: result.reason
    };
  });
}
