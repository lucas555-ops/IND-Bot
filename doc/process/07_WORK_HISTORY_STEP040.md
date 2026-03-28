# STEP040 — Analytics drilldowns + funnel readouts

## Goal
Turn the existing operator shell into a compact founder-grade control panel with Russian admin copy, live funnel counters, and direct drilldowns into the already-existing operator work surfaces.

## Delivered
- Russian admin/operator shell wording for Admin / Operations / Communications / System
- compact funnel readouts on hub surfaces
- home funnel drilldowns for connected / no-profile / ready-not-listed / listed / no-intro / first-intro / accepted / delivery-failed
- operations drilldowns for connected-no-profile / ready-no-skills / listed-active / listed-inactive / no-intro / intro-p24 / intro-p72 / delivery-issue / retry-due / exhausted
- communications drilldowns for notice-visibility / last-broadcast / outbox-failures / recent-direct
- system drilldowns for retry-due / exhausted / recent-audit / listing-changes / relinks
- Russian admin smoke coverage for shell wording and funnel-drilldown routing

## Persistence
- no new migration required
- reused existing admin summary/read-model queries and expanded aggregate wiring only

## Acceptance
- admin/operator layer is Russian on the STEP040 hub surfaces and key operator read flows
- operator can move from metric to action in 1–2 taps
- STEP028–039.1 routing and operator allowlist behavior remain intact
- source baseline is now STEP040 and docs/health markers are aligned
