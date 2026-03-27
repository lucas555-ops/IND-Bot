# 12_RUNTIME_SCAFFOLD_V1

## STEP005 delta over STEP004

STEP005 keeps the same narrow auth and persistence baseline, then adds one missing product loop: **complete the draft profile inside Telegram**.

What is now wired:
- first Telegram touch upserts `users`
- successful LinkedIn callback upserts `linkedin_accounts`
- successful LinkedIn callback ensures one `member_profiles` row in `draft` + `hidden` state
- home surface can read a profile snapshot and show truthful status
- profile menu and preview callbacks open from Telegram
- field edit prompts create one persisted edit session per user
- next plain-text message updates the pending profile field
- visibility toggle is blocked until required fields are complete

What still remains outside STEP005:
- no skills editing yet
- no directory browsing yet
- no public search yet
- no premium yet
- no admin moderation yet

## Runtime rule

Persistence and completion must behave honestly:
- if `DATABASE_URL` exists, persist and read real state
- if `DATABASE_URL` does not exist, surface disabled persistence instead of pretending data was stored
- if required fields are incomplete, do not pretend the profile is ready for public listing
