"""SQLAlchemy engine, session factory and shared declarative ``Base``."""

from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.config import settings

# SQLite needs this flag so a session can be shared across the (FastAPI)
# thread boundaries; other backends must not receive it.
_connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session]:
    """FastAPI dependency that yields a database session and closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create every table at startup so a fresh server works immediately."""
    from app.models import Outfit, User, WardrobeItem

    _ = (User, WardrobeItem, Outfit)  # register the models on Base.metadata
    Base.metadata.create_all(bind=engine)
