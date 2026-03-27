# STEP015 — intro detail surfaces / sent-received decision visibility

## Goal

Turn intro inbox rows into dedicated detail surfaces without broadening into chat, monetization, or admin flows.

## Scope

- add intro detail surface per `intro_request`
- expose sender vs recipient perspective clearly
- show decision-aware contact visibility on the detail screen
- preserve existing inbox actions and row-level summary lists
- after `accept/decline`, land on the updated detail surface instead of only refreshing inbox summary

## In

- `intro:view:<id>` callback path
- intro detail text + keyboard rendering
- storage/repo detail loader with requester/target-aware role resolution
- open-profile path from detail screen
- sender LinkedIn / unlocked contact buttons on detail when allowed by STEP014 contact rules
- received pending detail actions for `Accept / Decline`

## Out

- reply/chat flow
- receipts/service-message fanout
- premium/paywall
- notifications
- admin logic

## Acceptance

- every intro inbox row can open a dedicated detail surface
- received detail clearly states pending vs accepted vs declined
- sent detail clearly states pending vs accepted vs declined
- accepted sent detail exposes unlocked contact only when the STEP014 contract allows it
- decision buttons remain recipient-only
- after decision, the user sees the updated detail surface, not a stale row summary

## QA

- `npm run check`
- all existing smoke scripts
- `npm run smoke:intro-detail`

## Artifacts

- FULL ZIP
- Hotfix ZIP
- PATCH
- changed files list
- QA checklist
