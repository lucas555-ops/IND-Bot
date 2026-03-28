# STEP043.1 — Bulk-actions export/hotfix pack repair

## Goal
Close the STEP041/STEP043 bulk-actions deploy break caused by a packaging mismatch and harden the source so the bulk-actions state loader resolves cleanly in runtime.

## Scope
- keep bulk-actions behavior unchanged
- restore source contract for `loadAdminUserSegmentBulkActions`
- import `ADMIN_USER_SEGMENTS` in `adminStore` for segment labels
- bump runtime/docs markers to STEP043.1
- ship corrected full/hotfix artifacts

## Acceptance
- operator composer imports cleanly against adminStore in the shipped package
- hotfix pack contains `src/lib/storage/adminStore.js`
- bulk-actions smoke stays green
- live status still manual-verification-only
