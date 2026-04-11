import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/db/adminRepo.js', import.meta.url), 'utf8');
const requiredFragments = [
  '$9::integer, coalesce($10::integer, 0), $11::timestamptz, $12::timestamptz, $13::text',
  'estimated_recipient_count = coalesce($3::integer, estimated_recipient_count)',
  'started_at = coalesce($8::timestamptz, started_at)',
  'finished_at = case when $9::timestamptz is not null then $9::timestamptz',
  'last_error = case when $10::text is not null then $10::text else last_error end'
];
for (const fragment of requiredFragments) {
  if (!source.includes(fragment)) {
    throw new Error(`Missing SQL typing guard fragment: ${fragment}`);
  }
}

const notices = readFileSync(new URL('../src/bot/utils/notices.js', import.meta.url), 'utf8');
if (!notices.includes('could not determine data type of parameter')) {
  throw new Error('Operator-safe error formatting must hide raw SQL typing errors');
}

console.log('OK: broadcast SQL typing hotfix contract');
