from __future__ import annotations

from typing import Optional

from services import broadcasts as broadcast_service, notices as notice_service

# Compact option codes to stay well below Telegram's 64-byte callback_data limit.
BROADCAST_AUDIENCE_CODES = {
    "ap": "all_private_users",
    "a7": "active_last_7d",
    "rb": "real_balance",
    "pw": "pending_withdrawals",
    "pd": "pending_deposits",
    "ft": "founder_test",
}
BROADCAST_AUDIENCE_BY_KEY = {v: k for k, v in BROADCAST_AUDIENCE_CODES.items()}

BUTTON_PRESET_CODES = {
    "m1": "open_bot_menu",
    "st": "open_bot_start",
}
BUTTON_PRESET_BY_KEY = {v: k for k, v in BUTTON_PRESET_CODES.items()}

NOTICE_TARGET_CODES = {
    "au": "all_users",
    "a7": "active_last_7d",
    "rb": "real_balance",
    "pw": "pending_withdrawals",
    "ft": "founder_test",
}
NOTICE_TARGET_BY_KEY = {v: k for k, v in NOTICE_TARGET_CODES.items()}

NOTICE_SEVERITY_CODES = {
    "i": "info",
    "w": "warning",
    "c": "critical",
}
NOTICE_SEVERITY_BY_KEY = {v: k for k, v in NOTICE_SEVERITY_CODES.items()}

NOTICE_CTA_CODES = {
    "n": "none",
    "b": "balance",
    "l": "leaderboard",
    "g": "groups",
    "i": "invite",
    "s": "support",
    "h": "help",
}
NOTICE_CTA_BY_KEY = {v: k for k, v in NOTICE_CTA_CODES.items()}

NOTICE_EXPIRY_CODES = {
    "n": "never",
    "1": "1d",
    "3": "3d",
    "7": "7d",
}
NOTICE_EXPIRY_BY_KEY = {v: k for k, v in NOTICE_EXPIRY_CODES.items()}


def short_ref(value: str | None, length: int = 8) -> str:
    text = str(value or "").replace("-", "").lower()
    return text[: max(4, min(length, 12))]


def _join(*parts: str) -> str:
    return ":".join([str(part) for part in parts if str(part) != ""])


# Broadcast callbacks

def bc_new() -> str:
    return "bc:n"


def bc_open(broadcast_id: str) -> str:
    return _join("bc", "o", short_ref(broadcast_id))


def bc_source(broadcast_id: str) -> str:
    return _join("bc", "src", short_ref(broadcast_id))


def bc_audience_menu(broadcast_id: str) -> str:
    return _join("bc", "am", short_ref(broadcast_id))


def bc_audience_set(broadcast_id: str, audience_key: str) -> str:
    code = BROADCAST_AUDIENCE_BY_KEY.get(audience_key, "ft")
    return _join("bc", "a", short_ref(broadcast_id), code)


def bc_buttons(broadcast_id: str) -> str:
    return _join("bc", "btn", short_ref(broadcast_id))


def bc_btn_add(broadcast_id: str) -> str:
    return _join("bc", "ba", short_ref(broadcast_id))


def bc_btn_clear(broadcast_id: str) -> str:
    return _join("bc", "bc", short_ref(broadcast_id))


def bc_btn_preset(broadcast_id: str, preset_key: str) -> str:
    code = BUTTON_PRESET_BY_KEY.get(preset_key, "m1")
    return _join("bc", "bp", short_ref(broadcast_id), code)


def bc_preview(broadcast_id: str) -> str:
    return _join("bc", "pv", short_ref(broadcast_id))


def bc_test_self(broadcast_id: str) -> str:
    return _join("bc", "ts", short_ref(broadcast_id))


def bc_test_allow(broadcast_id: str) -> str:
    return _join("bc", "ta", short_ref(broadcast_id))


def bc_test_allow_confirm(broadcast_id: str) -> str:
    return _join("bc", "tac", short_ref(broadcast_id))


def bc_launch(broadcast_id: str) -> str:
    return _join("bc", "ln", short_ref(broadcast_id))


def bc_launch_confirm(broadcast_id: str) -> str:
    return _join("bc", "lnc", short_ref(broadcast_id))


def bc_stop(broadcast_id: str) -> str:
    return _join("bc", "st", short_ref(broadcast_id))


def bc_stop_confirm(broadcast_id: str) -> str:
    return _join("bc", "stc", short_ref(broadcast_id))


def bc_retry(broadcast_id: str) -> str:
    return _join("bc", "rt", short_ref(broadcast_id))


def bc_retry_confirm(broadcast_id: str) -> str:
    return _join("bc", "rtc", short_ref(broadcast_id))


def bc_cancel(broadcast_id: str) -> str:
    return _join("bc", "cx", short_ref(broadcast_id))


def bc_cancel_confirm(broadcast_id: str) -> str:
    return _join("bc", "cxc", short_ref(broadcast_id))



# Broadcast dual-composer / outbox callbacks

def bc_builder_new() -> str:
    return "bc:bn"


def bc_quick_new() -> str:
    return "bc:qn"


def bc_outbox() -> str:
    return "bc:ob"


def bc_builder_text(broadcast_id: str) -> str:
    return _join("bc", "tx", short_ref(broadcast_id))


def bc_builder_photo(broadcast_id: str) -> str:
    return _join("bc", "ph", short_ref(broadcast_id))


def bc_builder_textphoto(broadcast_id: str) -> str:
    return _join("bc", "tp", short_ref(broadcast_id))


# Notice callbacks

def nt_new() -> str:
    return "nt:n"


def nt_open(notice_id: str) -> str:
    return _join("nt", "o", short_ref(notice_id))


def nt_text(notice_id: str) -> str:
    return _join("nt", "tx", short_ref(notice_id))


def nt_severity_menu(notice_id: str) -> str:
    return _join("nt", "sm", short_ref(notice_id))


def nt_severity_set(notice_id: str, severity_key: str) -> str:
    return _join("nt", "s", short_ref(notice_id), NOTICE_SEVERITY_BY_KEY.get(severity_key, "i"))


def nt_target_menu(notice_id: str) -> str:
    return _join("nt", "tm", short_ref(notice_id))


def nt_target_set(notice_id: str, target_key: str) -> str:
    return _join("nt", "t", short_ref(notice_id), NOTICE_TARGET_BY_KEY.get(target_key, "au"))


def nt_cta_menu(notice_id: str) -> str:
    return _join("nt", "cm", short_ref(notice_id))


def nt_cta_set(notice_id: str, cta_key: str) -> str:
    return _join("nt", "c", short_ref(notice_id), NOTICE_CTA_BY_KEY.get(cta_key, "n"))


def nt_expiry_menu(notice_id: str) -> str:
    return _join("nt", "em", short_ref(notice_id))


def nt_expiry_set(notice_id: str, expiry_key: str) -> str:
    return _join("nt", "e", short_ref(notice_id), NOTICE_EXPIRY_BY_KEY.get(expiry_key, "n"))


def nt_preview(notice_id: str) -> str:
    return _join("nt", "pv", short_ref(notice_id))


def nt_publish(notice_id: str) -> str:
    return _join("nt", "pb", short_ref(notice_id))


def nt_publish_confirm(notice_id: str) -> str:
    return _join("nt", "pbc", short_ref(notice_id))


def nt_deactivate(notice_id: str) -> str:
    return _join("nt", "dx", short_ref(notice_id))


def nt_deactivate_confirm(notice_id: str) -> str:
    return _join("nt", "dxc", short_ref(notice_id))


def resolve_broadcast_id(ref: str | None) -> Optional[str]:
    row = broadcast_service.resolve_broadcast_ref(str(ref or ""))
    return str(row.get("broadcast_id")) if row else None


def resolve_notice_id(ref: str | None) -> Optional[str]:
    row = notice_service.resolve_notice_ref(str(ref or ""))
    return str(row.get("notice_id")) if row else None


def decode_broadcast_audience(code: str | None) -> str:
    return BROADCAST_AUDIENCE_CODES.get(str(code or ""), "founder_test")


def decode_button_preset(code: str | None) -> str:
    return BUTTON_PRESET_CODES.get(str(code or ""), "open_bot_menu")


def decode_notice_target(code: str | None) -> str:
    return NOTICE_TARGET_CODES.get(str(code or ""), "all_users")


def decode_notice_severity(code: str | None) -> str:
    return NOTICE_SEVERITY_CODES.get(str(code or ""), "info")


def decode_notice_cta(code: str | None) -> str:
    return NOTICE_CTA_CODES.get(str(code or ""), "none")


def decode_notice_expiry(code: str | None) -> str:
    return NOTICE_EXPIRY_CODES.get(str(code or ""), "never")
