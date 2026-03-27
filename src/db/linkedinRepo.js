export async function getLinkedInAccountBySub(client, linkedinSub) {
  const result = await client.query(
    `
      select
        la.id,
        la.user_id,
        la.linkedin_sub,
        la.full_name,
        la.email,
        la.email_verified,
        la.locale,
        la.linked_at,
        la.last_refresh_at,
        u.telegram_user_id,
        u.telegram_username
      from linkedin_accounts la
      join users u on u.id = la.user_id
      where la.linkedin_sub = $1
      limit 1
    `,
    [linkedinSub]
  );

  return result.rows[0] || null;
}

export async function getLinkedInAccountByUserId(client, userId) {
  const result = await client.query(
    `
      select
        la.id,
        la.user_id,
        la.linkedin_sub,
        la.full_name,
        la.email,
        la.email_verified,
        la.locale,
        la.linked_at,
        la.last_refresh_at
      from linkedin_accounts la
      where la.user_id = $1
      limit 1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

export async function upsertLinkedInAccount(client, { userId, identity, rawIdentityPayload }) {
  const result = await client.query(
    `
      insert into linkedin_accounts (
        user_id,
        linkedin_sub,
        full_name,
        given_name,
        family_name,
        picture_url,
        email,
        email_verified,
        locale,
        raw_oidc_claims_json,
        linked_at,
        last_refresh_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, now(), now())
      on conflict (user_id)
      do update set
        linkedin_sub = excluded.linkedin_sub,
        full_name = excluded.full_name,
        given_name = excluded.given_name,
        family_name = excluded.family_name,
        picture_url = excluded.picture_url,
        email = excluded.email,
        email_verified = excluded.email_verified,
        locale = excluded.locale,
        raw_oidc_claims_json = excluded.raw_oidc_claims_json,
        last_refresh_at = now()
      returning id, user_id, linkedin_sub, full_name, email, email_verified, locale, linked_at, last_refresh_at
    `,
    [
      userId,
      identity.linkedinSub,
      identity.name,
      identity.givenName,
      identity.familyName,
      identity.pictureUrl,
      identity.email,
      identity.emailVerified,
      identity.locale,
      JSON.stringify(rawIdentityPayload)
    ]
  );

  return result.rows[0];
}

export async function refreshLinkedInAccountBySub(client, { linkedinSub, userId, identity, rawIdentityPayload }) {
  const result = await client.query(
    `
      update linkedin_accounts
      set
        user_id = $2,
        full_name = $3,
        given_name = $4,
        family_name = $5,
        picture_url = $6,
        email = $7,
        email_verified = $8,
        locale = $9,
        raw_oidc_claims_json = $10::jsonb,
        last_refresh_at = now()
      where linkedin_sub = $1
      returning id, user_id, linkedin_sub, full_name, email, email_verified, locale, linked_at, last_refresh_at
    `,
    [
      linkedinSub,
      userId,
      identity.name,
      identity.givenName,
      identity.familyName,
      identity.pictureUrl,
      identity.email,
      identity.emailVerified,
      identity.locale,
      JSON.stringify(rawIdentityPayload)
    ]
  );

  return result.rows[0] || null;
}

export async function deleteLinkedInAccountByUserId(client, userId) {
  await client.query(
    `
      delete from linkedin_accounts
      where user_id = $1
    `,
    [userId]
  );
}
