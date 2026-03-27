# 29_STEP011A_DOCS_UPLIFT_DECISIONS

## Goal

Strengthen the project with a real documentation operating system before continuing runtime work.

## What was reviewed

### Fully reviewed and directly integrated
- new-project starter docs bundle:
  - execution contract
  - artifact protocol
  - truth-boundary and spike rules
  - mini-smoke template
  - handoff structure
  - Telegram UI pattern reuse
- already uploaded standalone docs:
  - project bootstrap template
  - Telegram UI pattern reuse
  - Selection UI Contract

### Review limitation
- `md.rar` was reviewable only at filename-manifest level in this environment
- its inner markdown files could not be safely decompressed here
- therefore its filenames were used as **theme prompts only**, not as directly merged source text

## What was selected as genuinely useful for this project

Selected:
- operating manual layer
- handoff standard
- docs-pack spec
- execution contract
- artifact protocol
- truth-boundary rules
- mini-smoke standard
- Telegram router contract
- selection surfaces contract
- work modes

Rejected or not brought in now:
- legal-docs mode
- GPT-builder notes
- brand-system mode
- generic knowledge-pack layer with no direct runtime leverage

## Why these were selected

Because this project is:
- already code-bearing
- Telegram screen-based
- contract-sensitive around LinkedIn/OIDC + persistence + directory state
- vulnerable to docs drift as the STEP count grows

## Effect on future work

From now on, future STEPs should:
- update `00_CURRENT_STATE.md`
- reference the relevant contract docs
- state whether the mode is BUILD, DOCS, SPIKE, HARDENING, or HANDOFF
- keep next-step scope narrow
