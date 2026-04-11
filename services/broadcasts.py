from __future__ import annotations

import json
import logging
import os
import uuid
from datetime import datetime, timedelta, timezone
from html import escape
from typing import Any

import database
from services.audit import log_operator_action

try:  # optional for local smoke / py_compile
    from telegram import InlineKeyboardButton, InlineKeyboardMarkup
    from telegram.error import BadRequest, Forbidden, NetworkError, RetryAfter, TimedOut
except Exception:  # noqa: BLE001
    InlineKeyboardButton = None  # type: ignore[assignment]
    InlineKeyboardMarkup = None  # type: ignore[assignment]
    BadRequest = Forbidden = NetworkError = RetryAfter = TimedOut = Exception  # type: ignore[assignment]

logger = logging.getLogger(__name__)
BOT_USERNAME = os.getenv("BOT_USERNAME", "rollduelbot").strip() or "rollduelbot"

AUDIENCE_CHOICES: dict[str, str] = {
    "all_private_users": "Все приватные пользователи",
    "active_last_7d": "Активные за 7 дней",
    "real_balance": "Пользователи с реальным балансом",
    "pending_withdrawals": "Пользователи с ожидающими выводами",
    "pending_deposits": "Пользователи с ожидающими депозитами",
    "founder_test": "Тестовая когорта founder/operator",
}

BUTTON_PRESETS: dict[str, tuple[str, str]] = {
    "open_bot_menu": ("🤖 Открыть Roll Duel", f"https://t.me/{BOT_USERNAME}?start=menu"),
    "open_bot_start": ("🎮 Открыть бота", f"https://t.me/{BOT_USERNAME}"),
}

BROADCAST_STATUSES = {"draft", "running", "stopped", "completed", "failed"}
BROADCAST_DELIVERY_STATUSES = {"sent", "retry_pending", "failed"}
SUPPORTED_SOURCE_TYPES = {"text", "photo", "video", "animation", "document"}
MAX_BROADCAST_TEXT_LEN = 3500
MAX_BROADCAST_BUTTONS = 3
MAX_BROADCAST_BUTTON_LABEL_LEN = 32
MAX_BROADCAST_URL_LEN = 512
MAX_BROADCAST_RETRY_ATTEMPTS = max(1, min(int(os.getenv("ADMIN_BROADCAST_MAX_RETRIES", "3") or "3"), 7))


def _parse_admin_id_list(raw: str) -> list[int]:
    values: list[int] = []
    for chunk in str(raw or "").split(","):
        chunk = chunk.strip()
        if chunk.isdigit():
            values.append(int(chunk))
    return values


_ADMIN_IDS = sorted(
    {
        *(
            [int(os.getenv("ADMIN_CHAT_ID", "0").strip())]
            if os.getenv("ADMIN_CHAT_ID", "0").strip().isdigit()
            and int(os.getenv("ADMIN_CHAT_ID", "0").strip())
            else []
        ),
        *_parse_admin_id_list(os.getenv("TG_OPERATOR_IDS", "")),
        *_parse_admin_id_list(os.getenv("ADMIN_IDS", "")),
    }
)


def _normalize_audience(value: str | None) -> str:
    key = str(value or "founder_test").strip().lower()
    return key if key in AUDIENCE_CHOICES else "founder_test"


def _normalize_text(value: str | None) -> str:
    text = str(value or "").replace("\r\n", "\n").strip()
    return text[:MAX_BROADCAST_TEXT_LEN]


def _normalize_preview_text(value: str | None) -> str:
    return _normalize_text(value)


def _normalize_source_type(value: str | None) -> str:
    key = str(value or "text").strip().lower()
    return key if key in SUPPORTED_SOURCE_TYPES else "text"


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _active_since_threshold(days: int) -> datetime:
    return _utc_now() - timedelta(days=days)


def _retry_backoff_seconds(next_attempt_number: int) -> int:
    ladder = [30, 120, 300, 900, 1800, 3600]
    index = max(0, min(int(next_attempt_number) - 1, len(ladder) - 1))
    return ladder[index]


def _coerce_int(value: Any) -> int:
    try:
        return int(value or 0)
    except Exception:
        return 0


def _validate_url(value: str) -> str | None:
    url = str(value or "").strip()
    if not url:
        return None
    if len(url) > MAX_BROADCAST_URL_LEN:
        return None
    if not (url.startswith("https://") or url.startswith("http://")):
        return None
    return url


def _parse_buttons(raw: Any) -> list[dict[str, str]]:
    if isinstance(raw, list):
        source = raw
    elif isinstance(raw, str):
        try:
            source = json.loads(raw or "[]")
        except Exception:
            return []
    else:
        return []
    buttons: list[dict[str, str]] = []
    for item in source:
        if not isinstance(item, dict):
            continue
        label = str(item.get("label") or "").strip()[:MAX_BROADCAST_BUTTON_LABEL_LEN]
        url = _validate_url(item.get("url"))
        if label and url:
            buttons.append({"label": label, "url": url})
    return buttons[:MAX_BROADCAST_BUTTONS]


def _buttons_to_json(buttons: list[dict[str, str]] | None) -> str:
    return json.dumps(_parse_buttons(buttons or []), ensure_ascii=False)


def buttons_preview_lines(buttons: list[dict[str, str]] | None) -> list[str]:
    rows = _parse_buttons(buttons or [])
    if not rows:
        return ["• Кнопок пока нет."]
    return [f"• {escape(str(item.get('label') or '—'))} → <code>{escape(str(item.get('url') or '—'))}</code>" for item in rows]


SOURCE_TYPE_LABELS = {
    "text": "текст",
    "photo": "фото",
    "video": "видео",
    "animation": "GIF",
    "document": "документ",
}


def source_type_label(value: str | None) -> str:
    return SOURCE_TYPE_LABELS.get(_normalize_source_type(value), "сообщение")


def buttons_summary(buttons: list[dict[str, str]] | None) -> str:
    rows = _parse_buttons(buttons or [])
    return f"{len(rows)} кноп." if rows else "без кнопок"


def get_button_preset_choices() -> list[tuple[str, str, str]]:
    return [(key, label, url) for key, (label, url) in BUTTON_PRESETS.items()]


def _build_reply_markup(buttons: list[dict[str, str]] | None):
    rows = _parse_buttons(buttons or [])
    if not rows or not InlineKeyboardMarkup or not InlineKeyboardButton:
        return None
    return InlineKeyboardMarkup([[InlineKeyboardButton(item["label"], url=item["url"])] for item in rows])


def _audience_filter_sql(audience: str) -> tuple[str, tuple[Any, ...]]:
    audience = _normalize_audience(audience)
    base = "u.user_id != 0 AND COALESCE(u.is_blocked, 0) = 0"
    params: list[Any] = []
    if audience == "active_last_7d":
        base += " AND u.last_seen_at IS NOT NULL AND u.last_seen_at >= ?"
        params.append(_active_since_threshold(7))
    elif audience == "real_balance":
        base += " AND COALESCE(u.balance, 0) > 0"
    elif audience == "pending_withdrawals":
        base += " AND EXISTS (SELECT 1 FROM withdrawal_requests wr WHERE wr.user_id = u.user_id AND wr.status IN ('requested','reserved','processing'))"
    elif audience == "pending_deposits":
        base += " AND EXISTS (SELECT 1 FROM invoices i WHERE i.user_id = u.user_id AND i.status = 'active')"
    elif audience == "founder_test":
        if _ADMIN_IDS:
            placeholders = ", ".join(["?"] * len(_ADMIN_IDS))
            base += f" AND u.user_id IN ({placeholders})"
            params.extend(_ADMIN_IDS)
        else:
            base += " AND 1 = 0"
    return base, tuple(params)


def _count_recipients(conn, audience: str) -> int:
    where_sql, params = _audience_filter_sql(audience)
    row = conn.execute(f"SELECT COUNT(*) AS total FROM users u WHERE {where_sql}", params).fetchone()
    return int((row[0] if row else 0) or 0)


def _message_preview(text: str) -> str:
    normalized = _normalize_preview_text(text)
    if len(normalized) <= 260:
        return normalized
    return normalized[:257] + "..."


def _hydrate_broadcast_row(row: Any) -> dict[str, Any] | None:
    if not row:
        return None
    item = dict(row)
    item["audience"] = _normalize_audience(item.get("audience"))
    item["message_text"] = _normalize_text(item.get("message_text"))
    item["preview_text"] = _normalize_preview_text(item.get("preview_text") or item.get("message_text"))
    item["source_message_type"] = _normalize_source_type(item.get("source_message_type"))
    item["buttons"] = _parse_buttons(item.get("buttons_json"))
    return item


def _broadcast_has_payload(row: dict[str, Any] | None) -> bool:
    if not row:
        return False
    if row.get("source_chat_id") and row.get("source_message_id"):
        return True
    return bool(_normalize_text(row.get("message_text")))


def _normalize_telegram_error(exc: Exception | str) -> tuple[str, str]:
    raw = str(exc or "unknown_error").strip()
    lowered = raw.lower()
    if "blocked by user" in lowered or "bot was blocked" in lowered or "forbidden: bot was blocked by the user" in lowered:
        return "telegram_blocked", raw
    if "chat not found" in lowered:
        return "telegram_chat_not_found", raw
    if "user is deactivated" in lowered:
        return "telegram_user_deactivated", raw
    if "retry after" in lowered:
        return "telegram_retry_after", raw
    if isinstance(exc, RetryAfter):
        return "telegram_retry_after", raw
    if isinstance(exc, TimedOut):
        return "telegram_timeout", raw
    if isinstance(exc, NetworkError):
        return "telegram_network_error", raw
    if isinstance(exc, Forbidden):
        return "telegram_forbidden", raw
    if isinstance(exc, BadRequest):
        return "telegram_bad_request", raw
    return "telegram_send_failed", raw


def _delivery_progress_in_tx(conn, broadcast_id: str) -> dict[str, int]:
    rows = conn.execute(
        """
        SELECT status, COUNT(*) AS total
        FROM broadcast_deliveries
        WHERE broadcast_id = ?
        GROUP BY status
        """,
        (broadcast_id,),
    ).fetchall()
    counters = {"sent": 0, "retry_pending": 0, "failed": 0}
    for row in rows:
        status = str((row["status"] if hasattr(row, "keys") else row[0]) or "").strip().lower()
        counters[status] = _coerce_int(row["total"] if hasattr(row, "keys") else row[1])
    counters["attempted"] = counters["sent"] + counters["retry_pending"] + counters["failed"]
    return counters


def _broadcast_summary_in_tx(conn, broadcast_id: str) -> dict[str, int]:
    counters = _delivery_progress_in_tx(conn, broadcast_id)
    total_row = conn.execute("SELECT total_count FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
    total_count = _coerce_int((total_row["total_count"] if hasattr(total_row, "keys") else total_row[0]) if total_row else 0)
    counters["total_count"] = total_count
    counters["remaining"] = max(total_count - counters["sent"] - counters["failed"], 0)
    return counters


def _refresh_broadcast_counters_in_tx(conn, broadcast_id: str) -> dict[str, int]:
    counters = _broadcast_summary_in_tx(conn, broadcast_id)
    conn.execute(
        """
        UPDATE broadcasts
        SET sent_count = ?,
            failed_count = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE broadcast_id = ?
        """,
        (counters["sent"], counters["failed"], broadcast_id),
    )
    return counters


def get_broadcast(broadcast_id: str) -> dict[str, Any] | None:
    conn = database.get_connection()
    try:
        row = conn.execute("SELECT * FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
        if not row:
            return None
        item = _hydrate_broadcast_row(row)
        item.update(get_broadcast_delivery_summary(broadcast_id, conn=conn))
        return item
    finally:
        conn.close()


def resolve_broadcast_ref(ref: str) -> dict[str, Any] | None:
    token = str(ref or "").strip().lower().replace("-", "")
    if len(token) < 4:
        return None
    conn = database.get_connection()
    try:
        rows = conn.execute(
            """
            SELECT *
            FROM broadcasts
            WHERE REPLACE(LOWER(broadcast_id), '-', '') LIKE ?
            ORDER BY created_at DESC
            LIMIT 2
            """,
            (f"{token}%",),
        ).fetchall()
        if len(rows) != 1:
            return None
        item = _hydrate_broadcast_row(rows[0])
        item.update(get_broadcast_delivery_summary(str(item.get("broadcast_id")), conn=conn))
        return item
    finally:
        conn.close()


def outbox_snapshot(*, limit: int = 10) -> dict[str, Any]:
    items = list_recent_broadcasts(limit=limit)
    summary = {"draft": 0, "running": 0, "completed": 0, "stopped": 0, "failed": 0, "retry_pending": 0, "failed_deliveries": 0}
    for item in items:
        status = str(item.get("status") or "draft").lower()
        if status in summary:
            summary[status] += 1
        summary["retry_pending"] += int(item.get("retry_pending") or 0)
        summary["failed_deliveries"] += int(item.get("failed_count") or 0)
    next_action = "Создайте новый черновик в одном из режимов."
    active = next((item for item in items if str(item.get("status") or "").lower() == "running"), None)
    if active:
        retry_pending = int(active.get("retry_pending") or 0)
        failed = int(active.get("failed_count") or 0)
        if retry_pending or failed:
            next_action = "Проверьте активную рассылку и при необходимости откройте повтор ошибок."
        else:
            next_action = "Следите за counters и завершением активной рассылки."
    elif summary["draft"]:
        next_action = "Откройте свежий черновик, сделайте предпросмотр и тест перед запуском."
    return {"summary": summary, "items": items, "next_action": next_action, "active": active}


def list_recent_broadcasts(limit: int = 5) -> list[dict[str, Any]]:
    conn = database.get_connection()
    try:
        rows = conn.execute("SELECT * FROM broadcasts ORDER BY created_at DESC LIMIT ?", (max(1, min(limit, 20)),)).fetchall()
        items: list[dict[str, Any]] = []
        for row in rows:
            item = _hydrate_broadcast_row(row)
            item.update(get_broadcast_delivery_summary(str(item.get("broadcast_id")), conn=conn))
            items.append(item)
        return items
    finally:
        conn.close()


def get_active_broadcast() -> dict[str, Any] | None:
    conn = database.get_connection()
    try:
        row = conn.execute("SELECT * FROM broadcasts WHERE status = 'running' ORDER BY started_at DESC, created_at DESC LIMIT 1").fetchone()
        if not row:
            return None
        item = _hydrate_broadcast_row(row)
        item.update(get_broadcast_delivery_summary(str(item.get("broadcast_id")), conn=conn))
        return item
    finally:
        conn.close()


def get_broadcast_delivery_summary(broadcast_id: str, *, conn=None) -> dict[str, int]:
    owns_conn = conn is None
    conn = conn or database.get_connection()
    try:
        return _broadcast_summary_in_tx(conn, broadcast_id)
    finally:
        if owns_conn:
            conn.close()


def create_broadcast_draft(*, operator_id: str, audience: str = "founder_test") -> dict[str, Any]:
    audience = _normalize_audience(audience)
    broadcast_id = str(uuid.uuid4())
    with database.transaction() as conn:
        conn.execute(
            """
            INSERT INTO broadcasts (
                broadcast_id, created_by_operator_id, audience, status, message_text,
                preview_text, buttons_json, total_count, sent_count, failed_count
            ) VALUES (?, ?, ?, 'draft', '', '', '[]', 0, 0, 0)
            """,
            (broadcast_id, operator_id, audience),
        )
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_create_draft", target_type="broadcast", target_id=broadcast_id, reason="telegram_admin", payload={"audience": audience})
    return get_broadcast(broadcast_id) or {"broadcast_id": broadcast_id, "audience": audience, "status": "draft"}


def set_broadcast_text(broadcast_id: str, *, text: str, operator_id: str) -> dict[str, Any]:
    clean_text = _normalize_text(text)
    if not clean_text:
        return {"ok": False, "error": "broadcast_text_required"}
    with database.transaction() as conn:
        row = conn.execute("SELECT status FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
        if not row:
            return {"ok": False, "error": "broadcast_not_found"}
        if str(row[0]).lower() != "draft":
            return {"ok": False, "error": "broadcast_not_editable"}
        conn.execute(
            "UPDATE broadcasts SET message_text = ?, preview_text = ?, source_chat_id = NULL, source_message_id = NULL, source_message_type = 'text', updated_at = CURRENT_TIMESTAMP WHERE broadcast_id = ?",
            (clean_text, _normalize_preview_text(clean_text), broadcast_id),
        )
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_set_text", target_type="broadcast", target_id=broadcast_id, reason="telegram_admin", payload={"length": len(clean_text)})
    return {"ok": True, "broadcast": get_broadcast(broadcast_id)}


def set_broadcast_source_message(broadcast_id: str, *, operator_id: str, source_chat_id: int, source_message_id: int, source_message_type: str, preview_text: str | None) -> dict[str, Any]:
    source_type = _normalize_source_type(source_message_type)
    normalized_preview = _normalize_preview_text(preview_text)
    with database.transaction() as conn:
        row = conn.execute("SELECT status FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
        if not row:
            return {"ok": False, "error": "broadcast_not_found"}
        if str(row[0]).lower() != "draft":
            return {"ok": False, "error": "broadcast_not_editable"}
        conn.execute(
            """
            UPDATE broadcasts
            SET source_chat_id = ?,
                source_message_id = ?,
                source_message_type = ?,
                preview_text = ?,
                message_text = CASE WHEN COALESCE(message_text, '') = '' THEN ? ELSE message_text END,
                updated_at = CURRENT_TIMESTAMP
            WHERE broadcast_id = ?
            """,
            (int(source_chat_id), int(source_message_id), source_type, normalized_preview, normalized_preview, broadcast_id),
        )
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_set_source_message", target_type="broadcast", target_id=broadcast_id, reason="telegram_admin_source_message", payload={"sourceType": source_type, "sourceChatId": int(source_chat_id), "sourceMessageId": int(source_message_id), "previewText": normalized_preview})
    return {"ok": True, "broadcast": get_broadcast(broadcast_id)}


def _mutate_buttons(broadcast_id: str, operator_id: str, *, buttons: list[dict[str, str]], action_type: str, payload: dict[str, Any]) -> dict[str, Any]:
    clean = _parse_buttons(buttons)
    with database.transaction() as conn:
        row = conn.execute("SELECT status FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
        if not row:
            return {"ok": False, "error": "broadcast_not_found"}
        if str(row[0]).lower() != "draft":
            return {"ok": False, "error": "broadcast_not_editable"}
        conn.execute("UPDATE broadcasts SET buttons_json = ?, updated_at = CURRENT_TIMESTAMP WHERE broadcast_id = ?", (_buttons_to_json(clean), broadcast_id))
        log_operator_action(conn, operator_id=operator_id, action_type=action_type, target_type="broadcast", target_id=broadcast_id, reason="telegram_admin_buttons", payload=payload | {"buttonCount": len(clean)})
    return {"ok": True, "broadcast": get_broadcast(broadcast_id)}


def add_broadcast_button(broadcast_id: str, *, operator_id: str, label: str, url: str) -> dict[str, Any]:
    safe_label = str(label or "").strip()[:MAX_BROADCAST_BUTTON_LABEL_LEN]
    safe_url = _validate_url(url)
    if not safe_label or not safe_url:
        return {"ok": False, "error": "broadcast_button_invalid"}
    row = get_broadcast(broadcast_id)
    if not row:
        return {"ok": False, "error": "broadcast_not_found"}
    buttons = list(row.get("buttons") or [])
    if len(buttons) >= MAX_BROADCAST_BUTTONS:
        return {"ok": False, "error": "broadcast_button_limit"}
    buttons.append({"label": safe_label, "url": safe_url})
    return _mutate_buttons(broadcast_id, operator_id, buttons=buttons, action_type="broadcast_add_button", payload={"label": safe_label, "url": safe_url})


def add_broadcast_button_preset(broadcast_id: str, *, operator_id: str, preset: str) -> dict[str, Any]:
    choice = BUTTON_PRESETS.get(str(preset or "").strip())
    if not choice:
        return {"ok": False, "error": "broadcast_button_preset_unknown"}
    label, url = choice
    return add_broadcast_button(broadcast_id, operator_id=operator_id, label=label, url=url)


def clear_broadcast_buttons(broadcast_id: str, *, operator_id: str) -> dict[str, Any]:
    return _mutate_buttons(broadcast_id, operator_id, buttons=[], action_type="broadcast_clear_buttons", payload={})


def set_broadcast_audience(broadcast_id: str, *, audience: str, operator_id: str) -> dict[str, Any]:
    audience = _normalize_audience(audience)
    with database.transaction() as conn:
        row = conn.execute("SELECT status FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
        if not row:
            return {"ok": False, "error": "broadcast_not_found"}
        if str(row[0]).lower() != "draft":
            return {"ok": False, "error": "broadcast_not_editable"}
        conn.execute("UPDATE broadcasts SET audience = ?, updated_at = CURRENT_TIMESTAMP WHERE broadcast_id = ?", (audience, broadcast_id))
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_set_audience", target_type="broadcast", target_id=broadcast_id, reason="telegram_admin", payload={"audience": audience})
    return {"ok": True, "broadcast": get_broadcast(broadcast_id)}


def launch_broadcast(broadcast_id: str, *, operator_id: str) -> dict[str, Any]:
    with database.transaction() as conn:
        row = conn.execute("SELECT * FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
        if not row:
            return {"ok": False, "error": "broadcast_not_found"}
        row_dict = _hydrate_broadcast_row(row)
        if str(row_dict.get("status") or "").lower() != "draft":
            return {"ok": False, "error": "broadcast_not_launchable"}
        if not _broadcast_has_payload(row_dict):
            return {"ok": False, "error": "broadcast_payload_required"}
        audience = _normalize_audience(row_dict.get("audience"))
        total_count = _count_recipients(conn, audience)
        if total_count <= 0:
            return {"ok": False, "error": "broadcast_audience_empty"}
        status = "running"
        conn.execute(
            """
            UPDATE broadcasts
            SET status = ?, total_count = ?, started_at = CURRENT_TIMESTAMP,
                completed_at = NULL,
                stopped_at = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE broadcast_id = ?
            """,
            (status, total_count, broadcast_id),
        )
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_launch", target_type="broadcast", target_id=broadcast_id, reason="telegram_admin", payload={"audience": audience, "estimatedRecipients": total_count, "status": status, "sourceType": row_dict.get("source_message_type"), "buttonCount": len(row_dict.get("buttons") or [])})
    return {"ok": True, "broadcast": get_broadcast(broadcast_id), "estimated_recipients": total_count}


def stop_broadcast(broadcast_id: str, *, operator_id: str) -> dict[str, Any]:
    with database.transaction() as conn:
        row = conn.execute("SELECT * FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
        if not row:
            return {"ok": False, "error": "broadcast_not_found"}
        current_status = str(row["status"] if hasattr(row, "keys") else row[3]).lower()
        if current_status not in {"running", "draft"}:
            return {"ok": False, "error": "broadcast_not_stoppable"}
        conn.execute("UPDATE broadcasts SET status = 'stopped', stopped_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE broadcast_id = ?", (broadcast_id,))
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_stop", target_type="broadcast", target_id=broadcast_id, reason="telegram_admin", payload={"previousStatus": current_status})
    return {"ok": True, "broadcast": get_broadcast(broadcast_id)}


def retry_failed_deliveries_now(broadcast_id: str, *, operator_id: str, reason: str | None = None) -> dict[str, Any]:
    now = _utc_now()
    with database.transaction() as conn:
        row = conn.execute("SELECT * FROM broadcasts WHERE broadcast_id = ?", (broadcast_id,)).fetchone()
        if not row:
            return {"ok": False, "error": "broadcast_not_found"}
        broadcast = dict(row)
        if str(broadcast.get("status") or "").lower() == "draft":
            return {"ok": False, "error": "broadcast_not_retryable"}
        delivery_snapshot = _delivery_progress_in_tx(conn, broadcast_id)
        retryable_count = delivery_snapshot["retry_pending"] + delivery_snapshot["failed"]
        if retryable_count <= 0:
            return {"ok": False, "error": "broadcast_no_retryable_deliveries"}
        conn.execute(
            """
            UPDATE broadcast_deliveries
            SET status = 'retry_pending',
                next_retry_at = ?,
                error_text = CASE WHEN status = 'failed' THEN error_text ELSE error_text END
            WHERE broadcast_id = ? AND status IN ('retry_pending', 'failed')
            """,
            (now, broadcast_id),
        )
        conn.execute(
            """
            UPDATE broadcasts
            SET status = 'running',
                stopped_at = NULL,
                completed_at = NULL,
                started_at = COALESCE(started_at, CURRENT_TIMESTAMP),
                updated_at = CURRENT_TIMESTAMP
            WHERE broadcast_id = ?
            """,
            (broadcast_id,),
        )
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_retry_failed_now", target_type="broadcast", target_id=broadcast_id, reason=reason or "telegram_admin_retry_failed", payload={"previous_status": broadcast.get("status"), "retryable_count": retryable_count})
    return {"ok": True, "broadcast": get_broadcast(broadcast_id), "retryable_count": retryable_count}


def count_recipients(audience: str) -> int:
    conn = database.get_connection()
    try:
        return _count_recipients(conn, audience)
    finally:
        conn.close()


def _select_pending_recipients(conn, broadcast_id: str, audience: str, *, limit: int) -> list[dict[str, Any]]:
    where_sql, params = _audience_filter_sql(audience)
    now = _utc_now()
    rows = conn.execute(
        f"""
        SELECT u.user_id,
               bd.status AS delivery_status,
               bd.attempt_count,
               bd.next_retry_at,
               bd.error_text
        FROM users u
        LEFT JOIN broadcast_deliveries bd
          ON bd.broadcast_id = ? AND bd.user_id = u.user_id
        WHERE {where_sql}
          AND (
                bd.user_id IS NULL
                OR (bd.status = 'retry_pending' AND (bd.next_retry_at IS NULL OR bd.next_retry_at <= ?))
              )
        ORDER BY COALESCE(bd.next_retry_at, CURRENT_TIMESTAMP) ASC, u.user_id ASC
        LIMIT ?
        """,
        (broadcast_id, *params, now, max(1, min(limit, 100))),
    ).fetchall()
    recipients: list[dict[str, Any]] = []
    for row in rows:
        recipients.append({
            "user_id": int(row[0] if not hasattr(row, "keys") else row["user_id"]),
            "delivery_status": None if not hasattr(row, "keys") else row["delivery_status"],
            "attempt_count": _coerce_int(row["attempt_count"] if hasattr(row, "keys") else row[2]),
            "error_text": row["error_text"] if hasattr(row, "keys") else row[4],
        })
    return recipients


def _has_future_retry_pending(conn, broadcast_id: str) -> bool:
    row = conn.execute(
        """
        SELECT 1
        FROM broadcast_deliveries
        WHERE broadcast_id = ?
          AND status = 'retry_pending'
          AND next_retry_at IS NOT NULL
          AND next_retry_at > ?
        LIMIT 1
        """,
        (broadcast_id, _utc_now()),
    ).fetchone()
    return bool(row)


def _finalize_broadcast_status(conn, broadcast_id: str) -> str:
    counters = _refresh_broadcast_counters_in_tx(conn, broadcast_id)
    if counters["retry_pending"] > 0:
        return "running"
    if counters["remaining"] > 0:
        return "running"
    final_status = "completed" if counters["sent"] > 0 or counters["failed"] == 0 else "failed"
    conn.execute(
        """
        UPDATE broadcasts
        SET status = ?,
            completed_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE broadcast_id = ?
        """,
        (final_status, broadcast_id),
    )
    return final_status


async def _send_broadcast_payload(bot: Any, chat_id: int, row: dict[str, Any], *, preview: bool = False) -> dict[str, Any]:
    hydrated = _hydrate_broadcast_row(row) or {}
    reply_markup = _build_reply_markup(hydrated.get("buttons") or [])
    source_chat_id = hydrated.get("source_chat_id")
    source_message_id = hydrated.get("source_message_id")
    if source_chat_id and source_message_id and hasattr(bot, "copy_message"):
        await bot.copy_message(
            chat_id=chat_id,
            from_chat_id=int(source_chat_id),
            message_id=int(source_message_id),
            reply_markup=reply_markup,
        )
        return {"ok": True, "result_code": "sent", "transport": "copy_message", "preview": preview}
    text = _normalize_text(hydrated.get("message_text") or hydrated.get("preview_text") or "")
    if not text:
        raise ValueError("broadcast_payload_required")
    kwargs = {"chat_id": chat_id, "text": text, "disable_web_page_preview": True}
    if reply_markup is not None:
        kwargs["reply_markup"] = reply_markup
    await bot.send_message(**kwargs)
    return {"ok": True, "result_code": "sent", "transport": "send_message", "preview": preview}


async def send_preview_to_operator(bot: Any, broadcast_id: str, *, operator_chat_id: int, operator_id: str) -> dict[str, Any]:
    row = get_broadcast(broadcast_id)
    if not row:
        return {"ok": False, "error": "broadcast_not_found"}
    if not _broadcast_has_payload(row):
        return {"ok": False, "error": "broadcast_payload_required"}
    note_text = (
        "📣 <b>Реальный предпросмотр</b>\n\n"
        "Ниже бот отправит реальный предпросмотр этого сообщения с той же кнопочной клавиатурой."
    )
    if hasattr(bot, "send_message"):
        await bot.send_message(chat_id=operator_chat_id, text=note_text, parse_mode="HTML", disable_web_page_preview=True)
    await _send_broadcast_payload(bot, operator_chat_id, row, preview=True)
    with database.transaction() as conn:
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_preview_send", target_type="broadcast", target_id=broadcast_id, reason="telegram_admin_preview", payload={"operatorChatId": operator_chat_id})
    return {"ok": True}


async def send_test_delivery(bot: Any, broadcast_id: str, *, operator_id: str, scope: str = "self", operator_chat_id: int) -> dict[str, Any]:
    row = get_broadcast(broadcast_id)
    if not row:
        return {"ok": False, "error": "broadcast_not_found"}
    if not _broadcast_has_payload(row):
        return {"ok": False, "error": "broadcast_payload_required"}
    targets: list[int]
    if scope == "allowlist":
        targets = list(_ADMIN_IDS)
    else:
        targets = [operator_chat_id]
    unique_targets = sorted({int(value) for value in targets if int(value)})
    if not unique_targets:
        return {"ok": False, "error": "broadcast_test_targets_empty"}
    ok_count = 0
    failed_count = 0
    failed_codes: list[str] = []
    for target_user_id in unique_targets:
        try:
            await _send_broadcast_payload(bot, target_user_id, row, preview=False)
            ok_count += 1
        except Exception as exc:  # noqa: BLE001
            failed_count += 1
            code, _raw = _normalize_telegram_error(exc)
            failed_codes.append(code)
    with database.transaction() as conn:
        log_operator_action(conn, operator_id=operator_id, action_type="broadcast_test_send", target_type="broadcast", target_id=broadcast_id, reason="telegram_admin_test_send", payload={"scope": scope, "targetCount": len(unique_targets), "okCount": ok_count, "failedCount": failed_count, "failedCodes": failed_codes[:5]})
    if ok_count <= 0:
        return {"ok": False, "error": failed_codes[0] if failed_codes else "broadcast_test_failed", "target_count": len(unique_targets), "failed_count": failed_count, "failed_codes": failed_codes[:5]}
    return {"ok": True, "target_count": len(unique_targets), "ok_count": ok_count, "failed_count": failed_count, "failed_codes": failed_codes[:5]}


async def process_active_broadcasts(bot: Any, *, batch_size: int = 25) -> dict[str, Any]:
    processed = 0
    sent = 0
    failed = 0
    retried = 0
    completed = 0
    conn = database.get_connection()
    try:
        rows = conn.execute("SELECT * FROM broadcasts WHERE status = 'running' ORDER BY started_at ASC, created_at ASC LIMIT 3").fetchall()
    finally:
        conn.close()

    for row in rows:
        broadcast = _hydrate_broadcast_row(row) or {}
        broadcast_id = str(broadcast.get("broadcast_id"))
        audience = _normalize_audience(broadcast.get("audience"))
        if not _broadcast_has_payload(broadcast):
            with database.transaction() as conn_tx:
                conn_tx.execute("UPDATE broadcasts SET status = 'failed', updated_at = CURRENT_TIMESTAMP WHERE broadcast_id = ?", (broadcast_id,))
            continue
        conn_batch = database.get_connection()
        try:
            recipients = _select_pending_recipients(conn_batch, broadcast_id, audience, limit=batch_size)
            has_future_retry = _has_future_retry_pending(conn_batch, broadcast_id)
        finally:
            conn_batch.close()
        if not recipients:
            if has_future_retry:
                continue
            with database.transaction() as conn_tx:
                final_status = _finalize_broadcast_status(conn_tx, broadcast_id)
                if final_status in {"completed", "failed"}:
                    completed += 1
            continue
        for target in recipients:
            target_user_id = int(target["user_id"])
            previous_attempts = _coerce_int(target.get("attempt_count"))
            current_attempt = previous_attempts + 1
            processed += 1
            status = "sent"
            result_code = "sent"
            error_text = None
            delivered_at = _utc_now()
            next_retry_at = None
            try:
                await _send_broadcast_payload(bot, target_user_id, broadcast, preview=False)
                sent += 1
            except Exception as exc:  # noqa: BLE001
                result_code, normalized_error = _normalize_telegram_error(exc)
                retryable = current_attempt < MAX_BROADCAST_RETRY_ATTEMPTS and result_code not in {"telegram_blocked", "telegram_chat_not_found", "telegram_user_deactivated", "telegram_forbidden", "telegram_bad_request"}
                status = "retry_pending" if retryable else "failed"
                error_text = normalized_error[:400]
                delivered_at = None
                next_retry_at = _utc_now() + timedelta(seconds=_retry_backoff_seconds(current_attempt)) if retryable else None
                if retryable:
                    retried += 1
                else:
                    failed += 1
                logger.warning("Broadcast delivery failed | broadcast=%s user=%s attempt=%s/%s retryable=%s code=%s error=%s", broadcast_id, target_user_id, current_attempt, MAX_BROADCAST_RETRY_ATTEMPTS, retryable, result_code, exc)
            with database.transaction() as conn_tx:
                conn_tx.execute(
                    """
                    INSERT INTO broadcast_deliveries (
                        broadcast_id, user_id, status, error_text, attempt_count,
                        last_attempt_at, next_retry_at, delivered_at, last_result_code
                    )
                    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
                    ON CONFLICT (broadcast_id, user_id) DO UPDATE SET
                        status = EXCLUDED.status,
                        error_text = EXCLUDED.error_text,
                        attempt_count = EXCLUDED.attempt_count,
                        last_attempt_at = CURRENT_TIMESTAMP,
                        next_retry_at = EXCLUDED.next_retry_at,
                        delivered_at = EXCLUDED.delivered_at,
                        last_result_code = EXCLUDED.last_result_code,
                        sent_at = CASE WHEN EXCLUDED.delivered_at IS NOT NULL THEN CURRENT_TIMESTAMP ELSE broadcast_deliveries.sent_at END
                    """,
                    (broadcast_id, target_user_id, status, error_text, current_attempt, next_retry_at, delivered_at, result_code),
                )
                conn_tx.execute("UPDATE broadcasts SET last_sent_user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE broadcast_id = ?", (target_user_id, broadcast_id))
                _refresh_broadcast_counters_in_tx(conn_tx, broadcast_id)
        conn_final = database.get_connection()
        try:
            pending_left = _select_pending_recipients(conn_final, broadcast_id, audience, limit=1)
            future_retry_left = _has_future_retry_pending(conn_final, broadcast_id)
        finally:
            conn_final.close()
        if not pending_left and not future_retry_left:
            with database.transaction() as conn_tx:
                final_status = _finalize_broadcast_status(conn_tx, broadcast_id)
                if final_status in {"completed", "failed"}:
                    completed += 1
    return {"processed": processed, "sent": sent, "failed": failed, "retried": retried, "completed": completed}


def render_broadcast_receipt(row: dict[str, Any] | None) -> str:
    hydrated = _hydrate_broadcast_row(row) if row else None
    if not hydrated:
        return "Рассылка не найдена."
    audience = _normalize_audience(hydrated.get("audience"))
    preview = escape(_message_preview(str(hydrated.get("preview_text") or hydrated.get("message_text") or "")))
    retry_pending = _coerce_int(hydrated.get("retry_pending"))
    failed = _coerce_int(hydrated.get("failed_count") or hydrated.get("failed"))
    total = _coerce_int(hydrated.get("total_count"))
    return (
        f"<b>Рассылка</b>\n"
        f"• Статус: <b>{escape(str(hydrated.get('status') or '—'))}</b>\n"
        f"• Аудитория: <code>{escape(audience)}</code>\n"
        f"• Тип источника: <b>{escape(str(hydrated.get('source_message_type') or 'text'))}</b>\n"
        f"• Кнопки: <b>{len(hydrated.get('buttons') or [])}</b>\n"
        f"• Отправлено: <b>{_coerce_int(hydrated.get('sent_count') or hydrated.get('sent'))}</b> / {total}\n"
        f"• Ожидают ретрая: <b>{retry_pending}</b>\n"
        f"• Ошибок: <b>{failed}</b>\n"
        f"• Предпросмотр: {preview or '—'}"
    )
