# STEP043.2 work history

- Investigated Vercel runtime warning from `pg` / `pg-connection-string` about `sslmode=require` in `DATABASE_URL`.
- Added `sanitizeConnectionString()` in `src/db/pool.js` to strip `sslmode`, `sslcert`, `sslkey`, and `sslrootcert` before passing the connection string to `pg` while keeping explicit `ssl` config authoritative.
- Updated `.env.example` to keep TLS policy in `DATABASE_SSLMODE` instead of embedding `sslmode` in `DATABASE_URL`.
- Added `scripts/smoke_db_ssl_config_contract.js` and `npm run smoke:db-ssl`.
- Bumped runtime/docs markers to STEP043.2 / 0.43.2 for this hotfix pack.
