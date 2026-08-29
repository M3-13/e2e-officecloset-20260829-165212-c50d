"""Wardrobe item routes.

Owned by the 'Garderoben-Endpunkte mit Bild-Upload und Besitzprüfung' ticket,
which fills in the concrete endpoints under this router.
"""

from fastapi import APIRouter

items_router = APIRouter(prefix="/api/v1/items", tags=["items"])
