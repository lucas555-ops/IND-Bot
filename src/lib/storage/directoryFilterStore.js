import { isDatabaseConfigured, withDbTransaction } from '../../db/pool.js';
import { upsertTelegramUser } from '../../db/usersRepo.js';
import {
  applyDirectoryFilterInput,
  clearDirectoryFilterInput,
  clearDirectoryFilterSession,
  clearSingleDirectoryFilterValue,
  ensureDirectoryFilterSession,
  getActiveDirectoryFilterInputByTelegramUserId,
  getDirectoryFilterSessionByTelegramUserId,
  setDirectoryFilterIndustry,
  startDirectoryFilterInput,
  toggleDirectoryFilterSkill
} from '../../db/directoryFilterRepo.js';
import {
  getDirectoryFilterInputMeta,
  getIndustryBucketMeta,
  getSkillMeta,
  summarizeDirectoryFilters
} from '../profile/contract.js';

const FILTER_INPUT_TTL_MINUTES = 20;

async function loadOrCreateDirectoryFilterSession(client, telegramUserId) {
  let session = await getDirectoryFilterSessionByTelegramUserId(client, telegramUserId);
  if (session) {
    return session;
  }

  const user = await upsertTelegramUser(client, {
    telegramUserId,
    telegramUsername: null
  });

  return ensureDirectoryFilterSession(client, { userId: user.id });
}

function buildSummary(filterSession) {
  return summarizeDirectoryFilters({
    selectedIndustrySlug: filterSession?.selected_industry_slug,
    selectedSkillSlugs: filterSession?.selected_skill_slugs || [],
    textQuery: filterSession?.text_query,
    cityQuery: filterSession?.city_query
  });
}

export async function loadDirectoryFilterState({ telegramUserId }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      filterSession: null,
      filterSummary: summarizeDirectoryFilters(),
      pendingInput: null,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const filterSession = await loadOrCreateDirectoryFilterSession(client, telegramUserId);
    return {
      persistenceEnabled: true,
      filterSession,
      filterSummary: buildSummary(filterSession),
      pendingInput: getDirectoryFilterInputMeta(filterSession?.pending_input_kind),
      reason: 'directory_filters_loaded'
    };
  });
}

export async function beginDirectoryFilterInputForTelegramUser({ telegramUserId, kind }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      started: false,
      reason: 'DATABASE_URL is not configured'
    };
  }

  const inputMeta = getDirectoryFilterInputMeta(kind);
  if (!inputMeta) {
    throw new Error(`Unsupported directory filter input kind: ${kind}`);
  }

  return withDbTransaction(async (client) => {
    const session = await loadOrCreateDirectoryFilterSession(client, telegramUserId);
    const filterSession = await startDirectoryFilterInput(client, {
      userId: session.user_id,
      kind,
      ttlMinutes: FILTER_INPUT_TTL_MINUTES
    });

    return {
      persistenceEnabled: true,
      started: true,
      inputMeta,
      filterSession,
      filterSummary: buildSummary(filterSession),
      reason: 'directory_filter_input_started'
    };
  });
}

export async function cancelDirectoryFilterInputForTelegramUser({ telegramUserId }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      cleared: false,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const session = await loadOrCreateDirectoryFilterSession(client, telegramUserId);
    const filterSession = await clearDirectoryFilterInput(client, { userId: session.user_id });
    return {
      persistenceEnabled: true,
      cleared: true,
      filterSession,
      filterSummary: buildSummary(filterSession),
      reason: 'directory_filter_input_cleared'
    };
  });
}

export async function applyDirectoryFilterInputForTelegramUser({ telegramUserId, text }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      consumed: false,
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const session = await getActiveDirectoryFilterInputByTelegramUserId(client, telegramUserId);
    if (!session?.user_id || !session.pending_input_kind) {
      return {
        persistenceEnabled: true,
        consumed: false,
        reason: 'no_active_directory_filter_input'
      };
    }

    const filterSession = await applyDirectoryFilterInput(client, {
      userId: session.user_id,
      kind: session.pending_input_kind,
      value: text
    });

    return {
      persistenceEnabled: true,
      consumed: true,
      inputMeta: getDirectoryFilterInputMeta(session.pending_input_kind),
      filterSession,
      filterSummary: buildSummary(filterSession),
      reason: 'directory_filter_input_applied'
    };
  });
}

export async function toggleDirectoryIndustryFilterForTelegramUser({ telegramUserId, industrySlug }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      changed: false,
      filterSession: null,
      filterSummary: summarizeDirectoryFilters(),
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const session = await loadOrCreateDirectoryFilterSession(client, telegramUserId);
    const filterSession = await setDirectoryFilterIndustry(client, {
      userId: session.user_id,
      industrySlug
    });

    return {
      persistenceEnabled: true,
      changed: true,
      industryMeta: getIndustryBucketMeta(industrySlug),
      filterSession,
      filterSummary: buildSummary(filterSession),
      reason: 'directory_industry_filter_toggled'
    };
  });
}

export async function toggleDirectorySkillFilterForTelegramUser({ telegramUserId, skillSlug }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      changed: false,
      filterSession: null,
      filterSummary: summarizeDirectoryFilters(),
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const session = await loadOrCreateDirectoryFilterSession(client, telegramUserId);
    const result = await toggleDirectoryFilterSkill(client, {
      userId: session.user_id,
      skillSlug
    });

    return {
      persistenceEnabled: true,
      changed: true,
      toggledOn: result.toggledOn,
      skillMeta: getSkillMeta(skillSlug),
      filterSession: result.filterSession,
      filterSummary: buildSummary(result.filterSession),
      reason: 'directory_skill_filter_toggled'
    };
  });
}

export async function clearSingleDirectoryFilterForTelegramUser({ telegramUserId, kind }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      changed: false,
      filterSession: null,
      filterSummary: summarizeDirectoryFilters(),
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const session = await loadOrCreateDirectoryFilterSession(client, telegramUserId);
    const filterSession = await clearSingleDirectoryFilterValue(client, {
      userId: session.user_id,
      kind
    });

    return {
      persistenceEnabled: true,
      changed: true,
      inputMeta: getDirectoryFilterInputMeta(kind),
      filterSession,
      filterSummary: buildSummary(filterSession),
      reason: 'directory_single_filter_cleared'
    };
  });
}

export async function clearDirectoryFiltersForTelegramUser({ telegramUserId }) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      changed: false,
      filterSession: null,
      filterSummary: summarizeDirectoryFilters(),
      reason: 'DATABASE_URL is not configured'
    };
  }

  return withDbTransaction(async (client) => {
    const session = await loadOrCreateDirectoryFilterSession(client, telegramUserId);
    const filterSession = await clearDirectoryFilterSession(client, {
      userId: session.user_id
    });

    return {
      persistenceEnabled: true,
      changed: true,
      filterSession,
      filterSummary: summarizeDirectoryFilters(),
      reason: 'directory_filters_cleared'
    };
  });
}
