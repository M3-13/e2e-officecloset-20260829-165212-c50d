"""Authentication routes (register, login, logout).

Owned by the 'Registrierung, Anmeldung, Abmeldung und Rate-Limiting' ticket,
which fills in the concrete endpoints under this router.
"""

from fastapi import APIRouter

auth_router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
