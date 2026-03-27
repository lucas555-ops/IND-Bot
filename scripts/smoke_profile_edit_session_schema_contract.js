import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROFILE_FIELD_KEYS } from '../src/lib/profile/contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationPath = path.join(__dirname, '..', 'migrations', '012_profile_edit_sessions_linkedin_url_field_key.sql');
const migration = fs.readFileSync(migrationPath, 'utf8');

if (!migration.includes('profile_edit_sessions_field_key_check')) {
  throw new Error('STEP025 migration must update profile_edit_sessions_field_key_check');
}

for (const fieldKey of PROFILE_FIELD_KEYS) {
  if (!migration.includes(`'${fieldKey}'`)) {
    throw new Error(`STEP025 migration must allow field key: ${fieldKey}`);
  }
}

console.log('ok');
