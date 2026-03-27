function normalizeIntroItem(row, role) {
  if (!row) {
    return null;
  }

  return {
    intro_request_id: row.intro_request_id,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    profile_id: row.profile_id,
    display_name: row.display_name,
    headline_user: row.headline_user,
    linkedin_public_url: row.linkedin_public_url,
    archived_snapshot_only: Boolean(row.archived_snapshot_only),
    role
  };
}

function normalizeDecision(decision) {
  if (decision === 'acc') {
    return 'accepted';
  }

  if (decision === 'dec') {
    return 'declined';
  }

  return null;
}

function decisionReasonFromStatus(status) {
  if (status === 'accepted') {
    return 'intro_request_accepted';
  }

  if (status === 'declined') {
    return 'intro_request_declined';
  }

  return 'intro_request_decision_saved';
}

async function loadRequesterSnapshotRow(client, requesterUserId) {
  const result = await client.query(
    `
      select
        u.id as requester_user_id,
        mp.id as profile_id,
        coalesce(nullif(mp.display_name, ''), la.full_name, 'Unknown member') as display_name,
        mp.headline_user,
        mp.linkedin_public_url
      from users u
      left join member_profiles mp on mp.user_id = u.id
      left join linkedin_accounts la on la.user_id = u.id
      where u.id = $1
      limit 1
    `,
    [requesterUserId]
  );

  return result.rows[0] || null;
}

async function loadIntroDetailRow(client, introRequestId, userId) {
  const result = await client.query(
    `
      select
        ir.id as intro_request_id,
        ir.status,
        ir.created_at,
        ir.updated_at,
        case
          when ir.target_user_id = $2 then 'received'
          when ir.requester_user_id = $2 then 'sent'
          else null
        end as role,
        case
          when ir.target_user_id = $2 then requester_mp.id
          else target_mp.id
        end as profile_id,
        case
          when ir.target_user_id = $2 then coalesce(nullif(requester_mp.display_name, ''), requester_la.full_name, ir.requester_display_name, 'Unknown member')
          else coalesce(nullif(target_mp.display_name, ''), target_la.full_name, ir.target_display_name, 'Unknown member')
        end as display_name,
        case
          when ir.target_user_id = $2 then coalesce(requester_mp.headline_user, ir.requester_headline_user)
          else coalesce(target_mp.headline_user, ir.target_headline_user)
        end as headline_user,
        case
          when ir.target_user_id = $2 then coalesce(requester_mp.linkedin_public_url, ir.requester_linkedin_public_url)
          else coalesce(target_mp.linkedin_public_url, ir.target_linkedin_public_url)
        end as linkedin_public_url,
        case
          when ir.target_user_id = $2 then requester_mp.id is null and (
            ir.requester_display_name is not null
            or ir.requester_headline_user is not null
            or ir.requester_linkedin_public_url is not null
          )
          else target_mp.id is null and (
            ir.target_display_name is not null
            or ir.target_headline_user is not null
            or ir.target_linkedin_public_url is not null
          )
        end as archived_snapshot_only
      from intro_requests ir
      left join member_profiles requester_mp on requester_mp.user_id = ir.requester_user_id
      left join linkedin_accounts requester_la on requester_la.user_id = ir.requester_user_id
      left join member_profiles target_mp on target_mp.user_id = ir.target_user_id
      left join linkedin_accounts target_la on target_la.user_id = ir.target_user_id
      where ir.id = $1
        and (ir.target_user_id = $2 or ir.requester_user_id = $2)
      limit 1
    `,
    [introRequestId, userId]
  );

  return result.rows[0] || null;
}

async function loadIntroDecisionRow(client, introRequestId) {
  const result = await client.query(
    `
      select
        ir.id as intro_request_id,
        ir.requester_user_id,
        ir.target_user_id,
        ir.target_profile_id,
        ir.status,
        ir.created_at,
        ir.updated_at,
        mp.id as profile_id,
        coalesce(nullif(mp.display_name, ''), la.full_name, ir.requester_display_name, 'Unknown member') as display_name,
        coalesce(mp.headline_user, ir.requester_headline_user) as headline_user,
        coalesce(mp.linkedin_public_url, ir.requester_linkedin_public_url) as linkedin_public_url,
        mp.id is null and (
          ir.requester_display_name is not null
          or ir.requester_headline_user is not null
          or ir.requester_linkedin_public_url is not null
        ) as archived_snapshot_only
      from intro_requests ir
      left join member_profiles mp on mp.user_id = ir.requester_user_id
      left join linkedin_accounts la on la.user_id = ir.requester_user_id
      where ir.id = $1
      limit 1
    `,
    [introRequestId]
  );

  return result.rows[0] || null;
}

export async function createOrGetIntroRequest(client, { requesterUserId, targetProfileId }) {
  const requester = await loadRequesterSnapshotRow(client, requesterUserId);
  if (!requester) {
    return { created: false, blocked: true, reason: 'requester_user_missing', target: null, introRequest: null };
  }

  const targetResult = await client.query(
    `
      select
        mp.id as profile_id,
        mp.user_id as target_user_id,
        mp.contact_mode,
        mp.visibility_status,
        mp.profile_state,
        coalesce(nullif(mp.display_name, ''), la.full_name, 'Unnamed profile') as display_name,
        mp.headline_user,
        mp.linkedin_public_url
      from member_profiles mp
      join users u on u.id = mp.user_id
      left join linkedin_accounts la on la.user_id = u.id
      where mp.id = $1
      limit 1
    `,
    [targetProfileId]
  );

  const target = targetResult.rows[0] || null;
  if (!target) {
    return { created: false, blocked: true, reason: 'target_profile_missing', target: null, introRequest: null };
  }

  if (String(target.target_user_id) === String(requesterUserId)) {
    return { created: false, blocked: true, reason: 'cannot_request_intro_to_self', target, introRequest: null };
  }

  if (target.visibility_status !== 'listed' || target.profile_state !== 'active') {
    return { created: false, blocked: true, reason: 'target_profile_not_public', target, introRequest: null };
  }

  if (target.contact_mode !== 'intro_request') {
    return { created: false, blocked: true, reason: 'target_profile_not_intro_request_mode', target, introRequest: null };
  }

  const existingResult = await client.query(
    `
      select
        ir.id as intro_request_id,
        ir.status,
        ir.created_at,
        ir.updated_at
      from intro_requests ir
      where ir.requester_user_id = $1
        and ir.target_profile_id = $2
      limit 1
    `,
    [requesterUserId, targetProfileId]
  );

  const existing = existingResult.rows[0] || null;
  if (existing) {
    return {
      created: false,
      blocked: false,
      duplicate: true,
      reason: 'intro_request_already_exists',
      target,
      introRequest: {
        ...existing,
        target_profile_id: target.profile_id,
        target_user_id: target.target_user_id
      }
    };
  }

  const insertResult = await client.query(
    `
      insert into intro_requests (
        requester_user_id,
        target_user_id,
        target_profile_id,
        status,
        requester_display_name,
        requester_headline_user,
        requester_linkedin_public_url,
        target_display_name,
        target_headline_user,
        target_linkedin_public_url
      )
      values ($1, $2, $3, 'pending', $4, $5, $6, $7, $8, $9)
      returning id as intro_request_id, status, created_at, updated_at
    `,
    [
      requesterUserId,
      target.target_user_id,
      target.profile_id,
      requester.display_name,
      requester.headline_user || null,
      requester.linkedin_public_url || null,
      target.display_name,
      target.headline_user || null,
      target.linkedin_public_url || null
    ]
  );

  return {
    created: true,
    blocked: false,
    duplicate: false,
    reason: 'intro_request_created',
    target,
    introRequest: {
      ...insertResult.rows[0],
      target_profile_id: target.profile_id,
      target_user_id: target.target_user_id
    }
  };
}

export async function decideIntroRequest(client, { userId, introRequestId, decision }) {
  const nextStatus = normalizeDecision(decision);
  if (!nextStatus) {
    return {
      changed: false,
      blocked: true,
      reason: 'intro_request_invalid_decision',
      introRequest: null
    };
  }

  const current = await loadIntroDecisionRow(client, introRequestId);
  if (!current) {
    return {
      changed: false,
      blocked: true,
      reason: 'intro_request_missing',
      introRequest: null
    };
  }

  if (String(current.target_user_id) !== String(userId)) {
    return {
      changed: false,
      blocked: true,
      reason: 'intro_request_not_actionable_by_user',
      introRequest: normalizeIntroItem(current, 'received')
    };
  }

  if (current.status !== 'pending') {
    return {
      changed: false,
      blocked: false,
      duplicate: true,
      reason: `intro_request_already_${current.status}`,
      introRequest: normalizeIntroItem(current, 'received')
    };
  }

  const updateResult = await client.query(
    `
      update intro_requests
      set status = $2,
          updated_at = now()
      where id = $1
        and target_user_id = $3
        and status = 'pending'
      returning id as intro_request_id, status, created_at, updated_at, target_profile_id
    `,
    [introRequestId, nextStatus, userId]
  );

  const updated = updateResult.rows[0] || null;
  if (!updated) {
    const raced = await loadIntroDecisionRow(client, introRequestId);
    if (raced?.status) {
      return {
        changed: false,
        blocked: false,
        duplicate: true,
        reason: `intro_request_already_${raced.status}`,
        introRequest: normalizeIntroItem(raced, 'received')
      };
    }

    return {
      changed: false,
      blocked: true,
      reason: 'intro_request_decision_failed',
      introRequest: null
    };
  }

  const latest = await loadIntroDecisionRow(client, introRequestId);
  return {
    changed: true,
    blocked: false,
    duplicate: false,
    reason: decisionReasonFromStatus(updated.status),
    introRequest: normalizeIntroItem(latest || { ...current, ...updated }, 'received')
  };
}

export async function getIntroInboxStateByUserId(client, { userId, limit = 5 }) {
  const countsResult = await client.query(
    `
      select
        count(*) filter (where target_user_id = $1)::int as received_total,
        count(*) filter (where target_user_id = $1 and status = 'pending')::int as received_pending,
        count(*) filter (where requester_user_id = $1)::int as sent_total,
        count(*) filter (where requester_user_id = $1 and status = 'pending')::int as sent_pending
      from intro_requests
      where target_user_id = $1 or requester_user_id = $1
    `,
    [userId]
  );

  const counts = countsResult.rows[0] || { received_total: 0, received_pending: 0, sent_total: 0, sent_pending: 0 };

  const receivedResult = await client.query(
    `
      select
        ir.id as intro_request_id,
        ir.status,
        ir.created_at,
        ir.updated_at,
        mp.id as profile_id,
        coalesce(nullif(mp.display_name, ''), la.full_name, ir.requester_display_name, 'Unknown member') as display_name,
        coalesce(mp.headline_user, ir.requester_headline_user) as headline_user,
        coalesce(mp.linkedin_public_url, ir.requester_linkedin_public_url) as linkedin_public_url,
        mp.id is null and (
          ir.requester_display_name is not null
          or ir.requester_headline_user is not null
          or ir.requester_linkedin_public_url is not null
        ) as archived_snapshot_only
      from intro_requests ir
      left join member_profiles mp on mp.user_id = ir.requester_user_id
      left join linkedin_accounts la on la.user_id = ir.requester_user_id
      where ir.target_user_id = $1
      order by ir.updated_at desc, ir.id desc
      limit $2
    `,
    [userId, limit]
  );

  const sentResult = await client.query(
    `
      select
        ir.id as intro_request_id,
        ir.status,
        ir.created_at,
        ir.updated_at,
        mp.id as profile_id,
        coalesce(nullif(mp.display_name, ''), la.full_name, ir.target_display_name, 'Unknown member') as display_name,
        coalesce(mp.headline_user, ir.target_headline_user) as headline_user,
        coalesce(mp.linkedin_public_url, ir.target_linkedin_public_url) as linkedin_public_url,
        mp.id is null and (
          ir.target_display_name is not null
          or ir.target_headline_user is not null
          or ir.target_linkedin_public_url is not null
        ) as archived_snapshot_only
      from intro_requests ir
      left join member_profiles mp on mp.user_id = ir.target_user_id
      left join linkedin_accounts la on la.user_id = ir.target_user_id
      where ir.requester_user_id = $1
      order by ir.updated_at desc, ir.id desc
      limit $2
    `,
    [userId, limit]
  );

  return {
    counts: {
      receivedTotal: Number(counts.received_total || 0),
      receivedPending: Number(counts.received_pending || 0),
      sentTotal: Number(counts.sent_total || 0),
      sentPending: Number(counts.sent_pending || 0)
    },
    received: (receivedResult.rows || []).map((row) => normalizeIntroItem(row, 'received')),
    sent: (sentResult.rows || []).map((row) => normalizeIntroItem(row, 'sent'))
  };
}

export async function getIntroRequestDetailByUserId(client, { userId, introRequestId }) {
  const detail = await loadIntroDetailRow(client, introRequestId, userId);
  if (!detail) {
    return {
      found: false,
      blocked: true,
      reason: 'intro_request_missing',
      introRequest: null
    };
  }

  return {
    found: true,
    blocked: false,
    reason: 'intro_request_detail_loaded',
    introRequest: normalizeIntroItem(detail, detail.role)
  };
}
