# STEP052.4 — Work History

## Summary
Added read-only rewards surfaces on top of the STEP052.3 rewards foundation.

## Shipped
- added `🎯 Points` screen to the invite module
- invite root now previews rewards mode plus pending/available snapshot
- performance/history keyboards now expose the Points read surface
- admin `📨 Инвайты` view now includes rewards read truth: mode, totals, top reward inviters, recent reward events, and pending confirmation counts
- added smoke coverage for rewards read surfaces
- updated current state and step docs

## Intentional limits
- no redeem runtime yet
- no founder mode switching yet
- no settlement path yet
- no broad invite/home IA rewrite

## Truth boundary
- source-confirmed: rewards read surfaces are implemented in code and docs
- live-confirmed: not confirmed
- live status not confirmed — manual verification required
