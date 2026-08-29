"""ORM models: users, wardrobe items and outfits with their relationships."""

from __future__ import annotations

import enum

from sqlalchemy import Column, Enum, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from app.database import Base


class Category(enum.StrEnum):
    """The fixed set of wardrobe categories a clothing item can belong to."""

    oberteil = "oberteil"
    unterteil = "unterteil"
    schuhe = "schuhe"
    accessoires = "accessoires"
    kleid = "kleid"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    items = relationship("WardrobeItem", back_populates="owner", cascade="all, delete-orphan")
    outfits = relationship("Outfit", back_populates="owner", cascade="all, delete-orphan")


class WardrobeItem(Base):
    __tablename__ = "wardrobe_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(Enum(Category), nullable=False)
    image_url = Column(String, nullable=False)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    owner = relationship("User", back_populates="items")


outfit_items = Table(
    "outfit_items",
    Base.metadata,
    Column(
        "outfit_id",
        Integer,
        ForeignKey("outfits.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "item_id",
        Integer,
        ForeignKey("wardrobe_items.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Outfit(Base):
    __tablename__ = "outfits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    occasion = Column(String, nullable=False)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    owner = relationship("User", back_populates="outfits")
    items = relationship("WardrobeItem", secondary=outfit_items)
