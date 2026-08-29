"""Account routes (delete own account).

Owned by the 'Konto-Löschung mit vollständiger Datenbereinigung' ticket, which
fills in the concrete endpoints under this router.
"""

from fastapi import APIRouter

account_router = APIRouter(prefix="/api/v1/account", tags=["account"])
