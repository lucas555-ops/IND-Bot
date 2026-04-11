# Roll Duel — Next Step Roadmap

## Current most likely next step
**`TDH-LIVE-002 — founder/operator comms live smoke on production`**

### Why it is next
Because the broadcast operator flow is now repacked into dual-composer UX on top of the existing DB-backed comms truth, the next honest move is a real founder/operator smoke for both Broadcast and Notice on production.

## Follow-up after that
- `TDH-LIVE-001 — live deposit / withdraw / real-money verification`
- narrow comms hotfix only if the live notice/broadcast smoke reveals a real edge case

## After TDH-ADMIN-001.7.4
- verify `Конструктор рассылки` end-to-end
- verify `Быстрый пост` end-to-end
- verify outbox/readout clarity after draft/test/launch flows
- confirm Notice publish/deactivate still remains clean and separate
- if confirmed, next likely step: **`TDH-LIVE-001 — live deposit / withdraw / real-money verification`**
- if smoke reveals a real edge case, take only a narrow `TDH-LIVE-002.1` hotfix
