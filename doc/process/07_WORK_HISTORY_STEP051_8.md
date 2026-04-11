# 07_WORK_HISTORY_STEP051_8

## STEP051.8 — admin IA cleanup / root declutter pass

### Why this step happened

By STEP051.7.2 the admin runtime itself was already working, but the first `👑 Админка` screen still mixed hub navigation, funnel counters, and leaf actions into one flat wall of buttons. The result was not a broken UI — it was a noisy one. Founder/operator entry did not read like a clear control panel because the root behaved like a hybrid of dashboard, quick actions list, and monitoring surface all at once.

The goal of STEP051.8 was therefore not new feature scope. The goal was to restore information hierarchy: root should show only the main hub sections plus a few meaningful alerts, while users/intros/notice/broadcast remain reachable inside the correct sections.

### What changed

#### 1. Admin root was decluttered

`👑 Админка` now starts with:
- `🧰 Операции`
- `💬 Коммуникации`
- `💳 Монетизация`
- `⚙️ Система`

and only four quick-alert rows beneath them:
- no profile
- ready but not listed
- pending >24h
- delivery issues

Leaf entrypoints such as users, intros, notice, and broadcast were removed from the first screen.

#### 2. Operations hub became the real funnel hub

`🧰 Операции` now exposes the user/profile/catalog/intro funnel more explicitly:
- LinkedIn connected
- no profile
- no skills
- ready but not listed
- no intro yet
- accepted intros
- pending >24h
- delivery issues

Working entries stay below the drilldowns:
- users
- intros
- quality
- delivery

#### 3. Monetization labels were normalized

The monetization keyboard no longer mixes English and Russian fragments like `Contact paid` or `DM paid`. Buttons now read in one operator language layer, for example:
- `Оплачены direct`
- `Оплачены DM`
- `Раскрыт контакт`
- `Принятые DM`
- `Блоки DM`
- `Репорты DM`

#### 4. Admin home summary now carries the fields the new root needs

The existing admin summary already had the underlying counts, but the home slice did not expose all of them consistently. STEP051.8 therefore surfaces:
- `connectedNoProfile`
- `readyNotListed`
- `deliveryIssues`

so the new quick-alert rows on the root screen are source-backed rather than inferred in the UI.

### What did not change

This step did not change:
- invite/share logic
- LinkedIn auth
- broadcast delivery behavior
- broadcast preview/status closure
- pricing logic
- schema shape
- admin runtime routing outside the narrow IA cleanup

### Result

After STEP051.8 the admin experience reads much more like a proper founder/operator control panel:
- root tells you which section to open
- alerts tell you where the current pressure points are
- working actions live one level deeper in the correct hub

This is a navigation and hierarchy cleanup step, not a product-scope expansion.
