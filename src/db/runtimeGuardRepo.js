export async function cleanupExpiredTelegramUpdateReceipts(client) {
  const result = await client.query(
    `
      delete from telegram_update_receipts
      where expires_at <= now()
    `
  );

  return {
    deletedCount: result.rowCount || 0
  };
}

export async function cleanupExpiredUserActionGuards(client) {
  const result = await client.query(
    `
      delete from user_action_guards
      where expires_at <= now()
    `
  );

  return {
    deletedCount: result.rowCount || 0
  };
}

export async function claimTelegramUpdateReceipt(client, { updateId, ttlSeconds }) {
  if (!Number.isInteger(updateId) || updateId < 0) {
    throw new Error('update_id must be a non-negative integer');
  }

  await cleanupExpiredTelegramUpdateReceipts(client);

  const result = await client.query(
    `
      insert into telegram_update_receipts (
        update_id,
        expires_at
      )
      values ($1, now() + make_interval(secs => $2))
      on conflict (update_id) do nothing
      returning update_id, expires_at
    `,
    [updateId, ttlSeconds]
  );

  return {
    accepted: result.rowCount > 0,
    duplicate: result.rowCount === 0,
    updateId,
    expiresAt: result.rows[0]?.expires_at || null
  };
}

export async function tryAcquireUserActionGuard(client, { guardKey, ttlSeconds }) {
  if (!guardKey) {
    throw new Error('guardKey is required');
  }

  await cleanupExpiredUserActionGuards(client);

  const result = await client.query(
    `
      insert into user_action_guards (
        guard_key,
        expires_at
      )
      values ($1, now() + make_interval(secs => $2))
      on conflict (guard_key)
      do update set expires_at = excluded.expires_at,
                    updated_at = now()
      where user_action_guards.expires_at <= now()
      returning guard_key, expires_at
    `,
    [guardKey, ttlSeconds]
  );

  return {
    acquired: result.rowCount > 0,
    throttled: result.rowCount === 0,
    guardKey,
    expiresAt: result.rows[0]?.expires_at || null
  };
}
