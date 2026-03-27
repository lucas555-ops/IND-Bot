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
