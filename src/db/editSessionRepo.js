export async function startProfileEditSession(client, { userId, fieldKey, ttlMinutes = 15 }) {
  const result = await client.query(
    `
      insert into profile_edit_sessions (
        user_id,
        field_key,
        expires_at
      )
      values ($1, $2, now() + ($3::text || ' minutes')::interval)
      on conflict (user_id)
      do update set
        field_key = excluded.field_key,
        expires_at = excluded.expires_at,
        updated_at = now()
      returning user_id, field_key, expires_at, updated_at
    `,
    [userId, fieldKey, String(ttlMinutes)]
  );

  return result.rows[0] || null;
}

export async function getActiveProfileEditSessionByTelegramUserId(client, telegramUserId) {
  const result = await client.query(
    `
      select
        pes.user_id,
        pes.field_key,
        pes.expires_at,
        pes.updated_at,
        u.telegram_user_id
      from profile_edit_sessions pes
      join users u on u.id = pes.user_id
      where u.telegram_user_id = $1
        and pes.expires_at > now()
      limit 1
    `,
    [telegramUserId]
  );

  return result.rows[0] || null;
}

export async function clearProfileEditSessionByUserId(client, userId) {
  await client.query('delete from profile_edit_sessions where user_id = $1', [userId]);
}

export async function clearExpiredProfileEditSessions(client) {
  await client.query('delete from profile_edit_sessions where expires_at <= now()');
}
