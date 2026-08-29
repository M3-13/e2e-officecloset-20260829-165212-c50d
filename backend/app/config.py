"""Application configuration.

Every value is read lazily (inside the ``Settings`` instance, never at import
time in a module body) and every value that the process needs to BOOT has a
working default, so a freshly cloned repository starts without any manual
setup. The only value with no default is ``SECRET_KEY`` — and that one is
*optional* by design: when it is not set, a cryptographically random key is
generated once per process start (see ``RUN.json`` / ``.env.example``).
"""

from __future__ import annotations

import os
import secrets


def _parse_size(raw: str) -> int:
    """Parse a size string like ``5MB``, ``512KB`` or a plain byte count."""
    value = raw.strip()
    upper = value.upper()
    if upper.endswith("MB"):
        return int(float(value[:-2].strip()) * 1024 * 1024)
    if upper.endswith("KB"):
        return int(float(value[:-2].strip()) * 1024)
    return int(value)


class Settings:
    """Runtime configuration sourced from environment variables."""

    def __init__(self) -> None:
        self.database_url: str = os.environ.get("DATABASE_URL", "sqlite:///./wardrobe.db")
        self.secret_key: str = os.environ.get("SECRET_KEY") or secrets.token_urlsafe(32)
        self.frontend_origin: str = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
        self.upload_dir: str = os.environ.get("UPLOAD_DIR", "backend/uploads")
        self.max_upload_size: int = _parse_size(os.environ.get("MAX_UPLOAD_SIZE", "5MB"))


settings = Settings()
