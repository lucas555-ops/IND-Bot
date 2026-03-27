# 04_EXECUTION_CONTRACT

## Good work

Good work on this project means:
- start from the real baseline
- separate source / live / inference / blocked
- avoid broad rewrites without proof
- choose one narrow next step
- return verifiable artifacts
- say what remains risky or unconfirmed

## Bad work

Bad work means:
- proposing architecture before reading the repo
- acting as though every issue needs redesign
- hiding uncertainty with polished tone
- treating docs as optional
- shipping a step with no clear smoke or rollback

## When a SPIKE is required

A SPIKE is required when:
- an external API contract is still unclear
- a hot path may be getting heavier
- a new data contract is not confirmed
- auth, money, admin, or moderation surfaces are involved
- the safe narrow form of the change is not yet obvious

Use the exact phrase:

**contract not confirmed — SPIKE required**

## When to stop and re-scope

Stop and re-scope when:
- a micro-step suddenly becomes migration + infra + UX rewrite
- a hidden dependency appears
- success cannot be honestly verified within the step
- rollback is no longer simple
