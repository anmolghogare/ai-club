"""
db.py
-----
Shared async database engine and session factory.

This module is intentionally thin — it only creates and exports:
  • `engine`        — the async SQLAlchemy engine
  • `async_session` — the session factory used across the app
  • `Base`          — the declarative base for all ORM models

Having a single, importable `async_session` prevents the auth module
(and any future modules) from needing to re-create their own engines
or import from `main.py`, avoiding circular-import issues.
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

# For production asyncpg driver support, convert postgres:// or postgresql:// to postgresql+asyncpg://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    if not DATABASE_URL.startswith("postgresql+asyncpg://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# `pool_pre_ping=True` drops stale connections before use (important for PaaS).
# Disable statement cache for PgBouncer transaction pooling compatibility.
# Configure connection pooling to reuse warm sessions and minimize remote connection times.
pool_size = int(os.getenv("DB_POOL_SIZE", "5"))
max_overflow = int(os.getenv("DB_MAX_OVERFLOW", "5"))

engine_args = {
    "echo": False,
}

if DATABASE_URL.startswith("sqlite"):
    # SQLite does not support pool_size, max_overflow, or statement_cache_size
    pass
else:
    engine_args.update({
        "pool_pre_ping": False,
        "pool_size": pool_size,
        "max_overflow": max_overflow,
        "pool_recycle": 1800,
        "connect_args": {"statement_cache_size": 0}
    })

engine = create_async_engine(DATABASE_URL, **engine_args)

async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    async with async_session() as session:
        yield session
