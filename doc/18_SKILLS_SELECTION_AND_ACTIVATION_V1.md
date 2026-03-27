# 18_SKILLS_SELECTION_AND_ACTIVATION_V1

## Curated skill catalog in STEP006

- Founder
- Growth
- Sales
- Operations
- Product
- Design
- Development
- Marketing
- Creator
- Recruiting
- B2B SaaS
- Crypto

## Why curated selection first

STEP006 deliberately uses a curated skills set instead of free-text skill input.

Benefits:
- compact callback payloads
- cleaner directory filtering later
- less noisy profile cards
- lower moderation burden
- stable activation logic for the first browseable directory baseline

## Activation rule

A profile becomes directory-ready only when all conditions below are true:

- LinkedIn identity exists
- required text fields are filled:
  - `display_name`
  - `headline_user`
  - `industry_user`
  - `about_user`
- at least 1 curated skill is selected

If the user clears all skills, profile readiness drops back to not-ready and `profile_state` returns to `draft`.

## Surface map

### Profile menu
- shows current skill summary
- exposes `🧠 Skills`
- keeps visibility toggle below readiness summary

### Skills selection
- single-surface inline selection screen
- toggles curated skills immediately
- clear-all action exists
- back/menu/home paths remain explicit

### Preview
- shows selected skills on the draft card
- shows readiness truth after each toggle

## Narrowness rules

STEP006 intentionally does not add:
- free-text skill creation
- public directory browse/list
- search
- premium
- moderation tooling
