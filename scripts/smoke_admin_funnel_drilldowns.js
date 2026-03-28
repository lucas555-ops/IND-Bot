import { readFileSync } from 'node:fs';
import { createAdminSurfaceBuilders } from '../src/bot/surfaces/adminSurfaces.js';

const surfaces = createAdminSurfaceBuilders({ currentStep: 'STEP040' });
const home = await surfaces.buildAdminHomeSurface({ summary: { connectedUsers: 9, profileStartedUsers: 7, readyNotListed: 2, listedUsers: 5, noIntroYet: 3, acceptedIntroUsers: 1, firstIntroUsers: 4, failedDeliveries: 2 } });
const ops = await surfaces.buildAdminOperationsSurface({ summary: { connectedNoProfile: 2, readyNoSkills: 1, listedActive: 4, listedInactive: 1, noIntroYet: 3, pendingOlder24h: 2, staleIntros: 1, deliveryIssues: 2 } });
const comms = await surfaces.buildAdminCommunicationsSurface({ state: { noticeVisibilityEstimate: 8, latestBroadcastRecipients: 12, recentOutboxFailures: 2, directMessages24h: 1 } });
const system = await surfaces.buildAdminSystemSurface({ summary: { retryDue: 2, exhausted: 1, recentAuditEvents: 5, listingChanges7d: 3, relinks7d: 1 } });

for (const callback of ['adm:home:funnel:connected', 'adm:home:funnel:dlv_fail']) {
  if (!JSON.stringify(home.reply_markup).includes(callback)) throw new Error(`Home keyboard missing ${callback}`);
}
for (const callback of ['adm:ops:funnel:conn_noprofile', 'adm:ops:funnel:intro_p72']) {
  if (!JSON.stringify(ops.reply_markup).includes(callback)) throw new Error(`Ops keyboard missing ${callback}`);
}
for (const callback of ['adm:comms:funnel:notice_visibility', 'adm:comms:funnel:outbox_fail']) {
  if (!JSON.stringify(comms.reply_markup).includes(callback)) throw new Error(`Comms keyboard missing ${callback}`);
}
for (const callback of ['adm:sys:funnel:retry_due', 'adm:sys:funnel:relinks']) {
  if (!JSON.stringify(system.reply_markup).includes(callback)) throw new Error(`System keyboard missing ${callback}`);
}

const operatorComposerSource = readFileSync(new URL('../src/bot/composers/operatorComposer.js', import.meta.url), 'utf8');
for (const fragment of ['adm:home:funnel:(connected|noprofile|ready_not_listed|listed|nointro|firstintro|accepted|dlv_fail)', 'adm:ops:funnel:(conn_noprofile|ready_no_skills|listed_active|listed_inactive|no_intro|intro_p24|intro_p72|delivery_issue|retry_due|exhausted)', 'adm:comms:funnel:(notice_visibility|last_bc|outbox_fail|direct_recent)', 'adm:sys:funnel:(retry_due|exhausted|audit_recent|listing_changes|relinks)']) {
  if (!operatorComposerSource.includes(fragment)) throw new Error(`Operator composer missing funnel regex: ${fragment}`);
}

console.log('OK: admin funnel drilldowns contract');
