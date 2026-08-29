"""Outfit routes.

Owned by the 'Outfit-Endpunkte mit Besitzprüfung' ticket, which fills in the
concrete endpoints under this router.
"""

from fastapi import APIRouter

outfits_router = APIRouter(prefix="/api/v1/outfits", tags=["outfits"])
