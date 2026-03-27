# 40_POST_DECISION_CONTACT_CONTRACT_V1

STEP014 defines the first truthful contact contract after intro decisions.

## Contract

- in `intro_request` mode, public directory cards do **not** expose the submitted LinkedIn URL to other viewers
- profile owners may still open their own submitted LinkedIn URL from their own card
- recipients may review the sender's submitted LinkedIn URL from received inbox rows when the sender provided one
- senders may open the target's submitted LinkedIn URL from sent inbox rows only after the target accepted the intro request and only when the target provided one
- `external_link` mode remains the only mode that exposes the submitted LinkedIn URL directly on a public directory card

## Non-goals

- this does not reveal Telegram username
- this does not create a reply thread or chat
- this does not add contact receipts or notifications
- this does not change intro request dedupe or decision permissions
