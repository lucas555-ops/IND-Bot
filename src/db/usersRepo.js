export async function upsertTelegramUser(client, { telegramUserId, telegramUsername = null }) {
  const result = await client.query(
    `
      insert into users (telegram_user_id, telegram_username)
      values ($1, $2)
      on conflict (telegram_user_id)
      do update set
        telegram_username = excluded.telegram_username,
        last_seen_at = now()
      returning id, telegram_user_id, telegram_username, first_seen_at, last_seen_at, (xmax = 0) as inserted
    `,
    [telegramUserId, telegramUsername]
  );

  return result.rows[0];
}
