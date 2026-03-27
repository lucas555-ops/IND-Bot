# 01_PROJECT_OPERATING_MANUAL

## Purpose

This file defines how this project should be developed.

The goal is not raw speed. The goal is:
- narrow shipping,
- truthful status,
- explicit contracts,
- low-regression continuation.

## Project formula

This is a **Telegram-native professional directory** with:
- LinkedIn OIDC identity bootstrap,
- self-managed profile completion inside Telegram,
- directory browse and narrowing,
- intro-request workflow.

## Primary working lenses

- **Jobs:** focus, clarity, less UI noise
- **Vitalik:** mechanism honesty, audit trail, fact separation
- **Woz:** simple, reliable engineering, minimal change surface
- **Durov:** speed with product sharpness, not bureaucracy
- **Toly:** ship under constraints, keep throughput practical
- **Armani:** coherence, consistency, presentation discipline
- **samczsun:** adversarial thinking, abuse-path awareness
- **Hasu:** sober risk framing, explicit trade-offs, cost of error

These are decision lenses, not roleplay.

## Mode-first rule

Do not start with output.
Start by identifying the mode for the current step.

For this repo the usual modes are:
- BUILD
- DOCS
- SPIKE
- HARDENING
- HANDOFF

The active mode must be inferable from the step itself and should be written into `00_CURRENT_STATE.md` if it materially changes how the work is being run.

## What good work looks like

- Reads the real baseline before proposing changes
- Names what is source-confirmed vs live-confirmed
- Solves the smallest real problem first
- Keeps Telegram UX deterministic
- Preserves continuity between STEPs
- Leaves behind usable docs, not just code

## What bad work looks like

- Treats the repo as if nothing exists yet
- Broadens a small fix into redesign
- Claims production readiness without runtime proof
- Blurs guesswork and facts
- Introduces new surfaces without updating docs/contracts
- Mixes BUILD + SPIKE + HANDOFF into one vague mega-step

## Decision order

When a change is proposed, decide in this order:
1. Is the current behavior real and documented?
2. What mode is this step actually in?
3. Is the target change local or systemic?
4. Is there a contract-risk that needs a SPIKE first?
5. What is the smallest reversible step?
6. What smoke proves the step?
7. What remains unconfirmed after the step?

## First-response discipline for a new project or new major branch

Always make these explicit:
1. probable mode;
2. why that mode;
3. deliverable package;
4. docs/source-of-truth;
5. what must not break;
6. one next narrow step.

## Project-specific no-go zones

Do not casually broaden into:
- LinkedIn scraping
- outreach automation
- full messaging system
- complex ranking engine
- monetization before core contact flow truth is clear
- broad admin/control plane before core member flow hardens
