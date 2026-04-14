import { readFileSync } from 'node:fs';

const operatorComposerPath = new URL('../src/bot/composers/operatorComposer.js', import.meta.url);
const inviteStorePath = new URL('../src/lib/storage/inviteStore.js', import.meta.url);
const inviteRepoPath = new URL('../src/db/inviteRepo.js', import.meta.url);

const operatorComposer = readFileSync(operatorComposerPath, 'utf8');
for (const token of [
  'adm:invite:mode:(off|earn_only|live|paused)',
  'changeInviteRewardsModeForTelegramUser',
  'adm:invite:audit'
]) {
  if (!operatorComposer.includes(token)) {
    throw new Error(`Operator composer missing STEP052.5 mode-control token: ${token}`);
  }
}

const inviteStore = readFileSync(inviteStorePath, 'utf8');
for (const token of ['setInviteRewardsMode', 'getRecentInviteRewardsModeAudit', 'invite_rewards_mode_changed']) {
  if (!inviteStore.includes(token)) {
    throw new Error(`Invite store missing mode-control token: ${token}`);
  }
}

const inviteRepo = readFileSync(inviteRepoPath, 'utf8');
for (const token of ['invite_program_mode_audit', 'changedByDisplayName', 'previousMode']) {
  if (!inviteRepo.includes(token)) {
    throw new Error(`Invite repo missing mode audit token: ${token}`);
  }
}
