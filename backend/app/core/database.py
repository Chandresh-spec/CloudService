from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,DeclarativeBase
from sqlalchemy.ext.asyncio import async_sessionmaker,create_async_engine,AsyncSession
from ..config import settings



sync_engine=create_engine(
    settings.sync_database_url,
    pool_size=settings.pool_size,
    max_overflow=settings.max_overflow,
    pool_pre_ping=settings.pool_pre_ping,
    pool_timeout=settings.pool_timeout,
    pool_recycle=settings.pool_recycle  
)



