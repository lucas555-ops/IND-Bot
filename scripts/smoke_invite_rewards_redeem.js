import { readFileSync, existsSync } from 'node:fs';
import {
  renderInviteRewardsKeyboard,
  renderInviteRedeemKeyboard,
  renderInviteRedeemText,
  renderInviteRedeemConfirmKeyboard,
  renderInviteRedeemConfirmText
} from '../src/lib/telegram/render.js';

const migrationPath = new URL('../migrations/025_invite_rewards_redeem_mode_controls.sql', import.meta.url);
const inviteRepoPath = new URL('../src/db/inviteRepo.js', import.meta.url);
const inviteStorePath = new URL('../src/lib/storage/inviteStore.js', import.meta.url);
const inviteComposerPath = new URL('../src/bot/composers/inviteComposer.js', import.meta.url);
const adminSurfacesPath = new URL('../src/bot/surfaces/adminSurfaces.js', import.meta.url);
const currentStatePath = new URL('../doc/00_CURRENT_STATE.md', import.meta.url);
const specPath = new URL('../doc/spec/STEP052.5_INVITE_REWARDS_REDEEM_AND_MODE_CONTROLS.md', import.meta.url);

if (!existsSync(migrationPath)) {
  throw new Error('Missing STEP052.5 migration');
}
const migration = readFileSync(migrationPath, 'utf8');
for (const token of [
  'invite_program_mode_audit',
  'pro_days integer',
  'reward_ledger_entry_id',
  'subscription_id',
  'requested_at timestamptz'
]) {
  if (!migration.includes(token)) {
    throw new Error(`STEP052.5 migration missing token: ${token}`);
  }
}

const repo = readFileSync(inviteRepoPath, 'utf8');
for (const token of [
  'export function getInviteRewardsCatalog',
  'export function getRedeemCatalogItemByCode',
  'export async function createInviteRewardRedemptionRequest',
  'export async function getInviteRewardRedemptionById',
  'export async function createRedeemDebitLedgerEntry',
  'export async function completeInviteRewardRedemption',
  'export async function failInviteRewardRedemption',
  'export async function appendInviteRewardsModeAudit',
  'export async function getRecentInviteRewardsModeAudit'
]) {
  if (!repo.includes(token)) {
    throw new Error(`Invite repo missing STEP052.5 token: ${token}`);
  }
}

const store = readFileSync(inviteStorePath, 'utf8');
for (const token of [
  'loadInviteRedeemReadModel',
  'beginInviteRewardRedemptionForTelegramUser',
  'confirmInviteRewardRedemptionForTelegramUser',
  'changeInviteRewardsModeForTelegramUser',
  "source: 'invite_rewards'"
]) {
  if (!store.includes(token)) {
    throw new Error(`Invite store missing STEP052.5 token: ${token}`);
  }
}

const composer = readFileSync(inviteComposerPath, 'utf8');
for (const token of [
  "composer.callbackQuery('invite:redeem'",
  'invite:redeem_item:',
  'invite:redeem_confirm:',
  'renderInviteRedeemText',
  'renderInviteRedeemConfirmText'
]) {
  if (!composer.includes(token)) {
    throw new Error(`Invite composer missing redeem token: ${token}`);
  }
}

const adminSurfaces = readFileSync(adminSurfacesPath, 'utf8');
for (const token of ['Mode audit:', 'adm:invite:mode:live', 'adm:invite:audit']) {
  if (!adminSurfaces.includes(token)) {
    throw new Error(`Admin invite surface missing mode-controls token: ${token}`);
  }
}

const liveKeyboard = JSON.stringify(renderInviteRewardsKeyboard({
  rewardsState: { rewardsSummary: { mode: 'live' } }
}).inline_keyboard);
if (!liveKeyboard.includes('invite:redeem')) {
  throw new Error('Points keyboard must expose redeem entry');
}

const redeemKeyboard = JSON.stringify(renderInviteRedeemKeyboard({
  redeemState: {
    mode: 'live',
    rewardsSummary: { availablePoints: 120 },
    catalog: [
      { code: 'pro_7d', label: '7 days Pro', pointsCost: 100 },
      { code: 'pro_30d', label: '30 days Pro', pointsCost: 250 }
    ]
  }
}).inline_keyboard);
for (const token of ['invite:redeem_item:pro_7d', 'invite:points']) {
  if (!redeemKeyboard.includes(token)) {
    throw new Error(`Redeem keyboard missing token: ${token}`);
  }
}

const redeemText = renderInviteRedeemText({
  redeemState: {
    mode: 'earn_only',
    blockedReason: 'redeem_not_live_in_earn_only',
    rewardsSummary: { availablePoints: 10, pendingPoints: 10, redeemedPoints: 0 },
    catalog: [{ code: 'pro_7d', label: '7 days Pro', pointsCost: 100 }]
  }
});
for (const token of ['Redeem for Pro', 'Available: 10', 'Redeem is not live yet']) {
  if (!redeemText.includes(token)) {
    throw new Error(`Redeem text missing token: ${token}`);
  }
}

const confirmText = renderInviteRedeemConfirmText({
  catalogItem: { label: '7 days Pro', pointsCost: 100, proDays: 7 },
  rewardsSummary: { availablePoints: 120 }
});
for (const token of ['Confirm redeem', '100 pts', '7 days Pro']) {
  if (!confirmText.includes(token)) {
    throw new Error(`Redeem confirm text missing token: ${token}`);
  }
}

const confirmKeyboard = JSON.stringify(renderInviteRedeemConfirmKeyboard({ redemptionId: 42 }).inline_keyboard);
if (!confirmKeyboard.includes('invite:redeem_confirm:42')) {
  throw new Error('Redeem confirm keyboard must keep redemption id in callback');
}

const currentState = readFileSync(currentStatePath, 'utf8');
if (!currentState.includes('STEP052.5 — Invite Rewards Redeem Foundation + Founder Mode Controls')) {
  throw new Error('Current state doc must be updated to STEP052.5');
}
if (!existsSync(specPath)) {
  throw new Error('Missing STEP052.5 spec doc');
}
