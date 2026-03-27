import {
  getDirectoryFilterInputMeta,
  getIndustryBucketMeta,
  getSkillMeta,
  normalizeDirectoryCityQuery,
  normalizeDirectoryFilterSkills,
  normalizeDirectoryFilterValue,
  normalizeDirectoryIndustryFilter,
  normalizeDirectorySearchQuery,
  trimToNull
} from '../lib/profile/contract.js';

export async function ensureDirectoryFilterSession(client, { userId }) {
  const result = await client.query(
    `
      insert into directory_filter_sessions (
        user_id,
        selected_industry_slug,
        selected_skill_slugs,
        text_query,
        city_query,
        pending_input_kind,
        pending_input_expires_at
      )
      values ($1, null, '{}'::text[], null, null, null, null)
      on conflict (user_id)
      do update set updated_at = now()
      returning user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
    `,
    [userId]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function getDirectoryFilterSessionByUserId(client, userId) {
  const result = await client.query(
    `
      select user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
      from directory_filter_sessions
      where user_id = $1
      limit 1
    `,
    [userId]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function getDirectoryFilterSessionByTelegramUserId(client, telegramUserId) {
  const result = await client.query(
    `
      select
        dfs.user_id,
        dfs.selected_industry_slug,
        dfs.selected_skill_slugs,
        dfs.text_query,
        dfs.city_query,
        dfs.pending_input_kind,
        dfs.pending_input_expires_at,
        dfs.updated_at,
        u.telegram_user_id
      from directory_filter_sessions dfs
      join users u on u.id = dfs.user_id
      where u.telegram_user_id = $1
      limit 1
    `,
    [telegramUserId]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function setDirectoryFilterIndustry(client, { userId, industrySlug }) {
  const normalizedIndustrySlug = normalizeDirectoryIndustryFilter(industrySlug);
  const existing = await ensureDirectoryFilterSession(client, { userId });
  const nextIndustrySlug = existing?.selected_industry_slug === normalizedIndustrySlug ? null : normalizedIndustrySlug;

  const result = await client.query(
    `
      update directory_filter_sessions
      set
        selected_industry_slug = $2,
        updated_at = now()
      where user_id = $1
      returning user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
    `,
    [userId, nextIndustrySlug]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function toggleDirectoryFilterSkill(client, { userId, skillSlug }) {
  const skillMeta = getSkillMeta(skillSlug);
  if (!skillMeta) {
    throw new Error(`Unsupported directory filter skill: ${skillSlug}`);
  }

  const existing = await ensureDirectoryFilterSession(client, { userId });
  const currentSkillSlugs = normalizeDirectoryFilterSkills(existing?.selected_skill_slugs || []);
  const skillSet = new Set(currentSkillSlugs);
  const wasSelected = skillSet.has(skillMeta.slug);

  if (wasSelected) {
    skillSet.delete(skillMeta.slug);
  } else {
    skillSet.add(skillMeta.slug);
  }

  const nextSkillSlugs = Array.from(skillSet).sort();
  const result = await client.query(
    `
      update directory_filter_sessions
      set
        selected_skill_slugs = $2::text[],
        updated_at = now()
      where user_id = $1
      returning user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
    `,
    [userId, nextSkillSlugs]
  );

  return {
    toggledOn: !wasSelected,
    skillMeta,
    filterSession: normalizeDirectoryFilterSessionRow(result.rows[0] || null)
  };
}

export async function startDirectoryFilterInput(client, { userId, kind, ttlMinutes }) {
  const inputMeta = getDirectoryFilterInputMeta(kind);
  if (!inputMeta) {
    throw new Error(`Unsupported directory filter input kind: ${kind}`);
  }

  await ensureDirectoryFilterSession(client, { userId });
  const result = await client.query(
    `
      update directory_filter_sessions
      set
        pending_input_kind = $2,
        pending_input_expires_at = now() + make_interval(mins => $3),
        updated_at = now()
      where user_id = $1
      returning user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
    `,
    [userId, inputMeta.kind, ttlMinutes]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function clearDirectoryFilterInput(client, { userId }) {
  const result = await client.query(
    `
      update directory_filter_sessions
      set
        pending_input_kind = null,
        pending_input_expires_at = null,
        updated_at = now()
      where user_id = $1
      returning user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
    `,
    [userId]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function getActiveDirectoryFilterInputByTelegramUserId(client, telegramUserId) {
  const result = await client.query(
    `
      select
        dfs.user_id,
        dfs.selected_industry_slug,
        dfs.selected_skill_slugs,
        dfs.text_query,
        dfs.city_query,
        dfs.pending_input_kind,
        dfs.pending_input_expires_at,
        dfs.updated_at,
        u.telegram_user_id
      from directory_filter_sessions dfs
      join users u on u.id = dfs.user_id
      where u.telegram_user_id = $1
        and dfs.pending_input_kind is not null
        and dfs.pending_input_expires_at is not null
        and dfs.pending_input_expires_at > now()
      limit 1
    `,
    [telegramUserId]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function applyDirectoryFilterInput(client, { userId, kind, value }) {
  const inputMeta = getDirectoryFilterInputMeta(kind);
  if (!inputMeta) {
    throw new Error(`Unsupported directory filter input kind: ${kind}`);
  }

  const normalizedValue = normalizeDirectoryFilterValue(kind, value);
  const column = inputMeta.kind === 'q' ? 'text_query' : 'city_query';

  const result = await client.query(
    `
      update directory_filter_sessions
      set
        ${column} = $2,
        pending_input_kind = null,
        pending_input_expires_at = null,
        updated_at = now()
      where user_id = $1
      returning user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
    `,
    [userId, normalizedValue]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function clearSingleDirectoryFilterValue(client, { userId, kind }) {
  const inputMeta = getDirectoryFilterInputMeta(kind);
  if (!inputMeta) {
    throw new Error(`Unsupported directory filter input kind: ${kind}`);
  }

  const column = inputMeta.kind === 'q' ? 'text_query' : 'city_query';
  const result = await client.query(
    `
      update directory_filter_sessions
      set
        ${column} = null,
        updated_at = now()
      where user_id = $1
      returning user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
    `,
    [userId]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

export async function clearDirectoryFilterSession(client, { userId }) {
  const result = await client.query(
    `
      insert into directory_filter_sessions (
        user_id,
        selected_industry_slug,
        selected_skill_slugs,
        text_query,
        city_query,
        pending_input_kind,
        pending_input_expires_at
      )
      values ($1, null, '{}'::text[], null, null, null, null)
      on conflict (user_id)
      do update set
        selected_industry_slug = null,
        selected_skill_slugs = '{}'::text[],
        text_query = null,
        city_query = null,
        pending_input_kind = null,
        pending_input_expires_at = null,
        updated_at = now()
      returning user_id, selected_industry_slug, selected_skill_slugs, text_query, city_query, pending_input_kind, pending_input_expires_at, updated_at
    `,
    [userId]
  );

  return normalizeDirectoryFilterSessionRow(result.rows[0] || null);
}

function normalizeDirectoryFilterSessionRow(row) {
  if (!row) {
    return null;
  }

  return {
    user_id: row.user_id,
    selected_industry_slug: normalizeDirectoryIndustryFilter(row.selected_industry_slug),
    selected_skill_slugs: normalizeDirectoryFilterSkills(row.selected_skill_slugs || []),
    text_query: trimToNull(row.text_query),
    city_query: trimToNull(row.city_query),
    pending_input_kind: getDirectoryFilterInputMeta(row.pending_input_kind)?.kind || null,
    pending_input_expires_at: row.pending_input_expires_at,
    updated_at: row.updated_at,
    selected_industry_label: row.selected_industry_slug ? getIndustryBucketMeta(row.selected_industry_slug)?.label || null : null,
    text_query_normalized: row.text_query ? normalizeDirectorySearchQuery(row.text_query) : null,
    city_query_normalized: row.city_query ? normalizeDirectoryCityQuery(row.city_query) : null
  };
}
