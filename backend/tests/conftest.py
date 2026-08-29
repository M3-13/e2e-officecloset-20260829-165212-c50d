"""Shared pytest configuration.

Sets an in-memory SQLite URL before any test module imports the app, so the
test suite never writes a database file into the repository tree.
"""

import os

os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
