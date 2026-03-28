# STEP043.1 work history

- Fixed deploy-break path after STEP043 where `operatorComposer` imported `loadAdminUserSegmentBulkActions` but the prior hotfix archive did not include `src/lib/storage/adminStore.js`.
- Added `ADMIN_USER_SEGMENTS` import inside `src/lib/storage/adminStore.js` so bulk-action segment labels resolve correctly at runtime.
- Bumped source/docs markers to STEP043.1 / 0.43.1 and repackaged corrected artifacts.
