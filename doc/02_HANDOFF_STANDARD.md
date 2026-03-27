# 02_HANDOFF_STANDARD

Use this whenever work moves to a new chat or new execution context.

## Required handoff sections

### 1. Executive summary
- Project
- Current baseline / STEP
- Current mode
- Current focus
- One next recommended step
- What must not break

### 2. Truth block
- Source-confirmed
- Live-confirmed
- Inference
- Blocked / unconfirmed
- Do not claim

### 3. Stabilized zones
Only list zones that are genuinely stable.

### 4. Live verification still needed
List flows that still require manual/runtime confirmation.

### 5. Mini-smoke
Include a short smoke set appropriate to the current baseline.

## Rules

- Start with the short executive block, not a giant narrative
- Use one next step, not a roadmap explosion
- Keep the handoff grounded in actual repo state
- Never phrase placeholders as completed production capability
- If strategy changed, update `00_CURRENT_STATE.md` before emitting handoff

## Current-project handoff minimum

For this project, a usable handoff should always mention:
- LinkedIn auth is official OIDC only
- public browse truth = `listed + active`
- intro requests persist, but accept/reply/chat are not done yet
- the current next narrow step, not a speculative roadmap
