import { sanitizeConnectionString } from '../src/db/pool.js';

const input = 'postgres://user:pass@host:5432/dbname?sslmode=require&sslrootcert=/tmp/root.crt&application_name=intro-deck';
const output = sanitizeConnectionString(input);
const parsed = new URL(output);

if (parsed.searchParams.has('sslmode')) {
  throw new Error('sslmode should be stripped from DATABASE_URL before pg parses it');
}

if (parsed.searchParams.has('sslrootcert')) {
  throw new Error('sslrootcert should be stripped when explicit ssl config is used');
}

if (parsed.searchParams.get('application_name') !== 'intro-deck') {
  throw new Error('non-ssl query params must be preserved');
}

console.log('OK: db ssl connection-string sanitization contract holds');
