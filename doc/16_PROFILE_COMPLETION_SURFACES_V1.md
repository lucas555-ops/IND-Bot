# 16_PROFILE_COMPLETION_SURFACES_V1

## Supported fields in STEP005

- `display_name`
- `headline_user`
- `company_user`
- `city_user`
- `industry_user`
- `about_user`

## Required fields for listing readiness

- `display_name`
- `headline_user`
- `industry_user`
- `about_user`

A profile becomes ready for listing only when:
- LinkedIn identity exists
- all required self-managed fields above are filled

## Surface map

### Home
- shows LinkedIn connection state
- shows profile completion summary
- opens profile menu and preview once identity exists

### Profile menu
- shows current draft state
- shows completion counters
- shows readiness state
- shows per-field edit entrypoints
- shows preview entrypoint
- shows visibility toggle

### Profile preview
- shows the current card as it would appear in the directory
- lets the user return to edit flow

### Field edit prompt
- started from callback
- creates one persisted edit session per user
- next plain-text message consumes the edit session and updates the target field

## Narrowness rules

STEP005 intentionally does not add:
- skills UI
- category pickers
- public directory
- search
- premium
- moderation
