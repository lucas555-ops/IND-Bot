# 07_WORK_HISTORY_STEP051_6

## STEP051.6 — admin menu pairing + navigation consistency polish

### Why this step exists

After the STEP051 invite / plans / command fixes were live-confirmed, the remaining UX roughness was concentrated inside the founder/operator admin layer: communications, broadcast, templates, and system menus still used too many single-button rows and repeated stacked `Back` + `Home` rows. On mobile this made the admin flow feel taller, less compact, and less consistent than the user-facing menu layer.

### What changed

- added a shared `buildBackHomeRow(...)` helper in `src/bot/surfaces/adminSurfaces.js`;
- paired the admin home hub entrypoints into `🧰 Операции + 💬 Коммуникации` and `💳 Монетизация + ⚙️ Система`;
- paired the communications hub actions into `📣 Уведомление + 📬 Рассылка` and `📌 Шаблоны + 📤 Исходящие`;
- paired the notice and broadcast action rows (`edit + templates`, `audience + preview`, `send + refresh` where relevant);
- compacted system hub action rows (`runbook + freeze`, `live verification + rehearsal`, `health + audit`);
- standardized many admin surfaces to use one shared `Back + Home` row instead of two separate stacked rows;
- intentionally kept long audience selectors and long template lists single-column where pairing would harm readability.

### Product result

The admin/operator layer now feels more consistent with the already-polished user menus: shorter vertical scans, clearer grouping of related actions, and less wasted height in Telegram. The communications/broadcast flows stay readable, while the most common actions now sit in compact thumb-friendly pairs.

### What was not changed

- no invite/share changes;
- no LinkedIn auth changes;
- no monetization pricing logic changes;
- no schema or migration changes;
- no change to long audience selector labels beyond navigation-row cleanup.

### Verification

Source verification for this step should include:

- `npm run check`
- `node scripts/smoke_admin_polish_contract.js`
- `node scripts/smoke_admin_templates_contract.js`
- `node scripts/smoke_admin_menu_layout_contract.js`

Live status not confirmed — manual verification required.
