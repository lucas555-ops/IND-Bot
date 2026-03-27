# 39_STEP014_IMPLEMENT_CARD

## STEP014

Post-decision contact contract.

### Goal
Define a privacy-first and truthful rule for when submitted LinkedIn URLs appear on public cards versus inbox rows after intro decisions.

### In scope
- hide submitted LinkedIn URL on public directory cards when `contact_mode = intro_request` and the viewer is not the profile owner
- allow recipients to review the sender's submitted LinkedIn URL from inbox rows when available
- allow senders to open the target's submitted LinkedIn URL only after the intro request is accepted
- docs sync and smoke coverage

### Out of scope
- Telegram username reveal
- direct chat or reply flow
- notifications or receipts
- monetization
