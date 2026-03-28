import { readFileSync } from 'node:fs';

const storeSource = readFileSync(new URL('../src/lib/storage/adminStore.js', import.meta.url), 'utf8');
for (const fragment of ['connectedUsers', 'profileStartedUsers', 'readyProfiles', 'firstIntroUsers', 'acceptedIntroUsers', 'noticeVisibilityEstimate', 'latestBroadcastId']) {
  if (!storeSource.includes(fragment)) {
    throw new Error(`Admin store missing STEP040 summary fragment: ${fragment}`);
  }
}

const repoSource = readFileSync(new URL('../src/db/adminRepo.js', import.meta.url), 'utf8');
for (const fragment of ['profile_started_users', 'ready_profiles', 'first_intro_user_count', 'accepted_intro_user_count', 'noticeVisibilityEstimate', 'latestBroadcastId']) {
  if (!repoSource.includes(fragment)) {
    throw new Error(`Admin repo missing STEP040 summary fragment: ${fragment}`);
  }
}

const operatorComposerSource = readFileSync(new URL('../src/bot/composers/operatorComposer.js', import.meta.url), 'utf8');
if (!operatorComposerSource.includes('loadAdminDashboardSummary')) {
  throw new Error('Operator composer must load dashboard summary for STEP040 hubs');
}
for (const fragment of ['buildAdminHomeSurface({ summary: dashboard?.summary?.home || null })', 'buildAdminOperationsSurface({ summary: dashboard?.summary?.operations || null })', 'buildAdminSystemSurface({ summary: dashboard?.summary?.system || null })']) {
  if (!operatorComposerSource.includes(fragment)) {
    throw new Error(`Operator composer missing summary wiring: ${fragment}`);
  }
}

console.log('OK: admin counters contract');
