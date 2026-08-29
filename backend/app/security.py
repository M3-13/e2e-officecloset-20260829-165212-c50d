"""Password hashing (Argon2) and JWT token creation/decoding.

``hash_password`` stores the password with Argon2's own ``$argon2id$...``
algorithm prefix, so the stored field never contains the plaintext password
and always names the hashing scheme (SPEC AC-19). Tokens carry ``sub`` =
``user_id`` as a string, as required by the shared JWT contract.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError

from app.config import settings

_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Return an Argon2id hash of ``password``, prefixed with the algorithm."""
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Return ``True`` iff ``password`` matches ``password_hash``."""
    try:
        return _hasher.verify(password_hash, password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def create_access_token(user_id: int, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT whose ``sub`` claim is ``user_id``."""
    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=60))
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def decode_token(token: str) -> dict | None:
    """Decode and validate a JWT, returning its payload or ``None`` if invalid."""
    try:
        return jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None
