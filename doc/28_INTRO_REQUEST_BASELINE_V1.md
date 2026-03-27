# 28_INTRO_REQUEST_BASELINE_V1

STEP011 introduces the first durable intro-request layer.

## What is real now

- `intro_requests` rows persist in Postgres
- requests are created from public directory cards only
- only `listed + active + intro_request` profiles are valid targets
- duplicate requests reuse the existing row rather than creating a second one
- users can open `📥 Intro inbox` and see recent received and sent summaries

## What is still placeholder-only

- accept / decline actions
- request message body
- inbox item detail screens
- chat handoff
- notifications

## Truth boundary

STEP011 is persistence-first. It proves that intro requests exist as durable objects. It does not pretend that contact negotiation, delivery, or messaging already exist.
