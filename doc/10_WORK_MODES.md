# 10_WORK_MODES

## Purpose

Use a named work mode before changing the repo.
This prevents mixing exploration, coding, and handoff into one blurred step.

## Modes

### BUILD
Use when the contract is already clear and the next narrow implementation step is known.

Output should be:
- code/doc changes
- smoke results
- artifacts

### DOCS
Use when runtime exists but the docs/working system are too weak or drifting.

Output should be:
- docs canon updates
- current-state refresh
- explicit decisions and next step

### SPIKE
Use when the contract is not confirmed.

Output should be:
- question being tested
- what is source-confirmed
- what remains blocked
- recommended narrow implementation shape or stop signal

### HARDENING
Use when a working surface exists but reliability, contract coverage, or degraded behavior is weak.

Output should be:
- narrow reliability changes
- stronger degraded behavior
- more explicit smoke/contract checks
- docs sync on what is now stabilized

### HANDOFF
Use when moving execution to a new chat/context.

Output should be:
- concise executive summary
- truth block
- one next step
- what must not break

## Primary / secondary mode rule

If a step is mixed:
- pick the primary mode first;
- note the secondary mode only if it materially changes output shape;
- record that choice in `00_CURRENT_STATE.md` when needed;
- do not silently merge incompatible output styles.

## Rule

Do not mix BUILD + SPIKE + HANDOFF into one vague mega-step.
Pick the mode first.
