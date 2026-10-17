from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,DeclarativeBase
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import async_sessionmaker,create_async_engine,AsyncSession
from ..config import settings
import logging


logger=logging.getLogger(__name__)

sync_engine=create_engine(
    settings.sync_database_url,
    pool_size=settings.pool_size,
    max_overflow=settings.max_overflow,
    pool_pre_ping=settings.pool_pre_ping,
    pool_timeout=settings.pool_timeout,
    pool_recycle=settings.pool_recycle  
)

sync_Local_Session=sessionmaker(
    bind=sync_engine,
    autoflush=False,
    autocommit=False
)



def get_db():
    session=sync_Local_Session()
    try:
        yield session

    except IntegrityError:
        logger.exception("Database Rollbacked")

    finally:
        session.close



class Base(DeclarativeBase):
    pass




#______________________________Async Session________________________________________________________________________________#

async_engine=create_async_engine(
    settings.sync_database_url,
    pool_size=settings.pool_size,
    max_overflow=settings.max_overflow,
    pool_pre_ping=settings.pool_pre_ping,
    pool_timeout=settings.pool_timeout,
    pool_recycle=settings.pool_recycle  
)

async_Local_Session=async_sessionmaker(
    bind=async_engine,
    autoflush=False,
    autocommit=False,
    class_=AsyncSession
)



async def get_db_async():
    async with async_Local_Session() as session:

        try:
            yield session
        except IntegrityError:
            logger.exception("Db rolledbacked")

        finally:
            await session.close()




