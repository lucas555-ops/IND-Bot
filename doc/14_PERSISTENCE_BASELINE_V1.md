# 14_PERSISTENCE_BASELINE_V1

## Entities wired by STEP005

### users
Source of truth for Telegram participant identity inside the bot runtime.

### linkedin_accounts
Source of truth for OIDC-derived LinkedIn identity payload.

### member_profiles
Source of truth for self-managed directory profile draft.

### profile_edit_sessions
Ephemeral-but-durable input mode state for in-Telegram profile editing.

## Default profile draft contract

On first successful LinkedIn connect:
- `display_name` seeds from LinkedIn name if available
- `visibility_status = hidden`
- `contact_mode = intro_request`
- `profile_state = draft`

This keeps the product honest:
- auth success does not imply public listing
- auth success does not imply profile completion
- auth success does not imply premium unlock

## STEP005 persistence rule

When a user starts editing a field:
- one `profile_edit_sessions` row tracks the pending field
- the next text message consumes that session
- the target field updates in `member_profiles`
- profile readiness recalculates before any listing toggle can succeed
