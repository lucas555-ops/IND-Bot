# DOCS README

## Reading order

1. `00_CURRENT_STATE.md` — current repo truth, current STEP, and next narrow step
2. `00_BOOT.md` — project formula, donor DNA, hard boundaries
3. `01_PROJECT_OPERATING_MANUAL.md` — how work should be run on this repo
4. `04_EXECUTION_CONTRACT.md` — quality bar for every STEP
5. `06_TRUTH_BOUNDARY_AND_SPIKE_RULES.md` — what can and cannot be claimed

## Core operating docs

- `02_HANDOFF_STANDARD.md` — required handoff structure for new chats / new contexts
- `03_DOCS_PACK_SPEC.md` — docs canon, update rules, anti-drift rules
- `05_ARTIFACT_PROTOCOL.md` — what artifacts must exist after a real change
- `07_MINI_SMOKE_STANDARD.md` — minimal QA shape after each narrow STEP
- `10_WORK_MODES.md` — BUILD / DOCS / SPIKE / HARDENING / HANDOFF discipline
- `15_NEW_CHAT_HANDOFF.md` — current ready-to-use handoff for continuing the project
- `16_RELEASE_READINESS_CHECKLIST.md` — release-oriented checklist, currently mostly future-facing
- `17_START_NEW_CHAT_PROMPT_LINKEDIN_DIRECTORY_BOT.md` — full activation prompt for starting a new continuation chat
- `36_NEXT_STEPS_ROADMAP.md` — narrow runtime corridor after STEP024.5

## Core reusable UI contracts

- `08_TELEGRAM_UI_ROUTER_CONTRACT.md` — for all screen-based Telegram surfaces
- `09_SELECTION_SURFACES_CONTRACT.md` — for filters, pickers, and toggles

## Project-specific baseline docs

- `12_RUNTIME_SCAFFOLD_V1.md`
- `14_PERSISTENCE_BASELINE_V1.md`
- `16_PROFILE_COMPLETION_SURFACES_V1.md`
- `18_SKILLS_SELECTION_AND_ACTIVATION_V1.md`
- `20_PUBLIC_DIRECTORY_BASELINE_V1.md`
- `22_DIRECTORY_FILTERS_BASELINE_V1.md`
- `24_DIRECTORY_SEARCH_BASELINE_V1.md`
- `26_PROFILE_CARD_OUTBOUND_ACTIONS_V1.md`
- `28_INTRO_REQUEST_BASELINE_V1.md`
- `33_WEBHOOK_SECRET_GUARD_V1.md`
- `35_INTRO_INBOX_ACTIONS_BASELINE_V1.md`
- `38_INTRO_DECISION_PERSISTENCE_V1.md`
- `40_POST_DECISION_CONTACT_CONTRACT_V1.md`
- `42_INTRO_DETAIL_SURFACES_V1.md`
- `44_ANTI_ABUSE_RETRY_DEDUPE_HARDENING_V1.md`
- `46_INTRO_RETENTION_HISTORY_SAFETY_V1.md`
- `48_CODE_SPLIT_REFACTOR_V1.md`
- `50_DATA_LAYER_SPLIT_REFACTOR_V1.md`
- `52_NOTIFICATION_RECEIPT_LAYER_V1.md`
- `54_NOTIFICATION_RETRY_AND_HISTORY_SPIKE.md`
- `56_NOTIFICATION_RETRY_BASELINE_V1.md`
- `57_STEP023_IMPLEMENT_CARD.md`
- `58_NOTIFICATION_RECEIPT_HISTORY_OPERATOR_BASELINE_V1.md`
- `59_STEP024_IMPLEMENT_CARD.md`
- `61_STEP024_5_IMPLEMENT_CARD.md`
- `62_MICRO_HARDENING_DEPLOY_READINESS_V1.md`
- `60_OPERATOR_DIAGNOSTICS_SURFACE_V1.md`

## Step history

- `docs/process/07_WORK_HISTORY_STEP003.md` ... `docs/process/07_WORK_HISTORY_STEP012.md`
- `docs/process/07_WORK_HISTORY_STEP011A.md` — first docs system uplift
- `docs/process/07_WORK_HISTORY_STEP011B.md` — integration of `md.zip` operating layer
- `docs/process/07_WORK_HISTORY_STEP011C.md` — consolidated audit/reconciliation pass
- `docs/process/07_WORK_HISTORY_STEP011D.md` — webhook secret hardening hotfix
- `docs/process/07_WORK_HISTORY_STEP012.md` — intro inbox row actions baseline
- `docs/process/07_WORK_HISTORY_STEP013.md` — intro decision persistence baseline
- `docs/process/07_WORK_HISTORY_STEP014.md` — post-decision contact contract baseline
- `docs/process/07_WORK_HISTORY_STEP015.md` — intro detail surfaces / sent-received decision visibility
- `docs/process/07_WORK_HISTORY_STEP016.md` — anti-abuse / retry / dedupe hardening
- `docs/process/07_WORK_HISTORY_STEP017.md` — intro retention / history safety baseline
- `docs/process/07_WORK_HISTORY_STEP018.md` — bot runtime code split refactor
- `docs/process/07_WORK_HISTORY_STEP019.md` — data-layer split refactor / directoryRepo extraction
- `docs/process/07_WORK_HISTORY_STEP020.md` — notification / receipt layer
- `docs/process/07_WORK_HISTORY_STEP021.md` — notification retry / receipt history SPIKE
- `docs/process/07_WORK_HISTORY_STEP022.md` — notification retry baseline
- `docs/process/07_WORK_HISTORY_STEP023.md` — receipt history / operator diagnostics baseline
- `docs/process/07_WORK_HISTORY_STEP024.md` — lightweight operator/admin diagnostics surface
- `docs/process/07_WORK_HISTORY_STEP024_5.md` — micro-hardening / deploy-readiness gap close

## Audit / reconciliation docs

- `31_STEP011C_AUDIT_AND_RECONCILIATION.md` — audit findings, fixes, and remaining risks for the consolidated baseline

## Maintenance rule

When a STEP changes runtime or docs truth, update:
- `00_CURRENT_STATE.md`
- the relevant feature baseline doc(s)
- the matching `WORK_HISTORY_STEP###.md`
- `15_NEW_CHAT_HANDOFF.md` if the execution baseline materially changed
- `17_START_NEW_CHAT_PROMPT_LINKEDIN_DIRECTORY_BOT.md` if the new-chat activation baseline materially changed
- `36_NEXT_STEPS_ROADMAP.md` if the next runtime corridor changed
