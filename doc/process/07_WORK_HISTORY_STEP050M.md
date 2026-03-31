# STEP050M — Root Meta Copy Hotfix

## Goal
Align the root landing page meta copy with the updated public preview wording:
- trusted intros and direct contact in Telegram
- LinkedIn as the identity layer

## Scope
- update `index.html` root page meta/title copy
- realign OG/social smoke to the current root OG asset path
- update docs baseline and work history
- no runtime, layout, OG image, or legal page content changes

## Changes
- `<title>` changed to `Intro Deck — Trusted intros and direct contact in Telegram`
- `meta name="description"` changed to `Discover people, request intros or direct contact, and continue inside Telegram, with LinkedIn as the identity layer.`
- `og:title` aligned to the same title
- `og:description` aligned to the same description
- `twitter:title` aligned to the same title
- `twitter:description` aligned to the same description

## Acceptance
- root preview copy uses the new title and description consistently across standard, OG, and Twitter meta tags
- no layout or runtime changes introduced
- source check remains clean

## Verification
- source verification only in this step
- live preview refresh still requires deploy and cache-aware manual verification

- `scripts/smoke_og_social_contract.js` updated from the stale `intro-deck-og-1200x630-v1.png` expectation to the current `intro-deck-og-1200x630.png` asset path
