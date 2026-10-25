
from sqlalchemy.engine import URL
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import setting

DATABASE_URL = URL.create(
    drivername="postgresql+asyncpg",
    username=setting.DB_USER,
    password=setting.DB_PASSWORD,
    host=setting.DB_HOST,
    port=setting.DB_PORT,
    database=setting.DB_NAME,
)

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
