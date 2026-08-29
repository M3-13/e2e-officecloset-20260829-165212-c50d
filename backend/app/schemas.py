"""Pydantic schemas: the request/response contracts shared across the API."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from app.models import Category


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str


class ItemCreate(BaseModel):
    name: str
    category: Category


class ItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: Category
    image_url: str


class OutfitCreate(BaseModel):
    name: str
    occasion: str
    item_ids: list[int]


class OutfitOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    occasion: str
    items: list[ItemOut]
