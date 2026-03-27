# STEP006_IMPLEMENT_CARD

## Goal

Add curated skills selection and make profile activation/listing readiness depend on at least one selected skill.

## Scope

In:
- curated skills catalog
- skills selection surface inside Telegram
- skill toggle + clear callbacks
- persistent storage through `member_profile_skills`
- readiness update so `active`/directory-ready requires required text fields + at least one skill
- router/render updates
- smoke coverage for skills and activation baseline
- docs sync

Out:
- public directory browse/list
- search
- premium logic
- admin moderation
- deploy automation

## Acceptance

- connected user can open a dedicated skills selection surface from profile menu
- user can toggle curated skills with inline callbacks
- selected skills persist in DB-backed profile snapshot
- user can clear all skills from the surface
- profile is not directory-ready without at least one selected skill
- profile can only be listed when required text fields and at least one skill are present
- home/menu/preview surfaces expose selected skills and readiness state honestly
- router, storage, profile, and skills smoke checks pass
