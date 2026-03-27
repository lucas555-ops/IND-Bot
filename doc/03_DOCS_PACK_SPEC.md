# 03_DOCS_PACK_SPEC

## Purpose

This project uses docs as active engineering surface, not passive afterthought.

## Canon layers

### Layer A — project truth
- `00_CURRENT_STATE.md`
- `00_BOOT.md`
- `01_PROJECT_OPERATING_MANUAL.md`

### Layer B — working contracts
- `02_HANDOFF_STANDARD.md`
- `03_DOCS_PACK_SPEC.md`
- `04_EXECUTION_CONTRACT.md`
- `05_ARTIFACT_PROTOCOL.md`
- `06_TRUTH_BOUNDARY_AND_SPIKE_RULES.md`
- `07_MINI_SMOKE_STANDARD.md`
- `08_TELEGRAM_UI_ROUTER_CONTRACT.md`
- `09_SELECTION_SURFACES_CONTRACT.md`
- `10_WORK_MODES.md`

### Layer C — project handoff / readiness docs
- `15_NEW_CHAT_HANDOFF.md`
- `16_RELEASE_READINESS_CHECKLIST.md`

### Layer D — feature baseline docs
- STEP-specific baseline docs such as runtime, persistence, profile, directory, intro

### Layer E — step history
- `docs/process/07_WORK_HISTORY_STEP*.md`

## Maintenance rule

A STEP that changes behavior should also update:
- `00_CURRENT_STATE.md`
- relevant feature baseline doc(s)
- the new `WORK_HISTORY_STEP###.md`
- `15_NEW_CHAT_HANDOFF.md` if the continuation baseline changed

## Anti-drift rule

If README, current state, work history, and feature docs disagree, `00_CURRENT_STATE.md` wins first, then the conflict must be resolved in the same or next narrow docs step.

## Required docs rule

At minimum this repo should always have:
- `docs/README.md`
- `docs/00_BOOT.md`
- `docs/00_CURRENT_STATE.md`
- at least one current handoff doc
- step history for recent work
- release-readiness notes, even if they are still future-facing
