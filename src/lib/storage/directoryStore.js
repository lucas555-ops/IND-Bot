import { isDatabaseConfigured, withDbClient } from '../../db/pool.js';
import { getDirectoryFilterSessionByTelegramUserId } from '../../db/directoryFilterRepo.js';
import { getListedProfileCardById, listListedProfilesPage } from '../../db/directoryRepo.js';
import { summarizeDirectoryFilters } from '../profile/contract.js';

export const DIRECTORY_PAGE_SIZE = 5;

function normalizePage(page) {
  const parsed = Number.parseInt(String(page ?? '0'), 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

function buildFilterSummary(filterSession) {
  return summarizeDirectoryFilters({
    selectedIndustrySlug: filterSession?.selected_industry_slug,
    selectedSkillSlugs: filterSession?.selected_skill_slugs || [],
    textQuery: filterSession?.text_query,
    cityQuery: filterSession?.city_query
  });
}

export async function loadDirectoryPage({ page = 0, viewerTelegramUserId = null } = {}) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      page: 0,
      pageSize: DIRECTORY_PAGE_SIZE,
      profiles: [],
      totalCount: 0,
      hasPrev: false,
      hasNext: false,
      filterSession: null,
      filterSummary: summarizeDirectoryFilters(),
      reason: 'DATABASE_URL is not configured'
    };
  }

  const normalizedPage = normalizePage(page);

  return withDbClient(async (client) => {
    const filterSession = viewerTelegramUserId != null
      ? await getDirectoryFilterSessionByTelegramUserId(client, viewerTelegramUserId)
      : null;
    const filterSummary = buildFilterSummary(filterSession);

    const result = await listListedProfilesPage(client, {
      page: normalizedPage,
      pageSize: DIRECTORY_PAGE_SIZE,
      viewerTelegramUserId,
      selectedIndustrySlug: filterSummary.selectedIndustrySlug,
      selectedSkillSlugs: filterSummary.selectedSkillSlugs,
      textQuery: filterSummary.textQuery,
      cityQuery: filterSummary.cityQuery
    });

    return {
      persistenceEnabled: true,
      ...result,
      filterSession,
      filterSummary,
      reason: 'directory_loaded'
    };
  });
}

export async function loadDirectoryCard({ profileId, viewerTelegramUserId = null } = {}) {
  if (!isDatabaseConfigured()) {
    return {
      persistenceEnabled: false,
      profile: null,
      reason: 'DATABASE_URL is not configured'
    };
  }

  const normalizedProfileId = Number.parseInt(String(profileId ?? '0'), 10);
  if (!Number.isFinite(normalizedProfileId) || normalizedProfileId <= 0) {
    return {
      persistenceEnabled: true,
      profile: null,
      reason: 'invalid_profile_id'
    };
  }

  return withDbClient(async (client) => {
    const profile = await getListedProfileCardById(client, {
      profileId: normalizedProfileId,
      viewerTelegramUserId
    });

    return {
      persistenceEnabled: true,
      profile,
      reason: profile ? 'directory_card_loaded' : 'directory_card_missing'
    };
  });
}
