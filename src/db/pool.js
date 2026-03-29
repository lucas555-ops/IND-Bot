import { getDbConfig } from '../config/env.js';

const SSL_CONNECTION_STRING_KEYS = ['sslmode', 'sslcert', 'sslkey', 'sslrootcert'];

let poolPromise = null;

function buildSslOption(sslMode) {
  if (!sslMode || sslMode === 'disable') {
    return false;
  }

  return {
    rejectUnauthorized: sslMode === 'verify-full'
  };
}

export function sanitizeConnectionString(databaseUrl) {
  if (!databaseUrl) {
    return databaseUrl;
  }

  try {
    const parsed = new URL(databaseUrl);
    for (const key of SSL_CONNECTION_STRING_KEYS) {
      parsed.searchParams.delete(key);
    }
    return parsed.toString();
  } catch {
    return databaseUrl;
  }
}

export function isDatabaseConfigured() {
  return getDbConfig().configured;
}

export async function getPool() {
  const dbConfig = getDbConfig();
  if (!dbConfig.configured) {
    return null;
  }

  if (!poolPromise) {
    poolPromise = import('pg').then(({ Pool }) => new Pool({
      connectionString: sanitizeConnectionString(dbConfig.databaseUrl),
      ssl: buildSslOption(dbConfig.sslMode),
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000
    }));
  }

  return poolPromise;
}

export async function withDbClient(fn) {
  const pool = await getPool();
  if (!pool) {
    throw new Error('DATABASE_URL is not configured');
  }

  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export async function withDbTransaction(fn) {
  return withDbClient(async (client) => {
    await client.query('BEGIN');
    try {
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  });
}
