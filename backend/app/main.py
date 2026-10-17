from fastapi import FastAPI
from .core.database import Base,sync_engine
from .models import User
print(Base.metadata.__dict__)

Base.metadata.create_all(bind=sync_engine)
from .routers import authentication



from contextlib import asynccontextmanager

from fastapi import FastAPI
from redis.asyncio import Redis
from redis.exceptions import ConnectionError, TimeoutError
from redis.backoff import ExponentialBackoff
from redis.retry import Retry

from .config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_client = Redis.from_url(
        settings.redis_url,
        max_connections=10,
        decode_responses=True,
        socket_connect_timeout=5,
        socket_timeout=5,
        socket_keepalive=True,
        health_check_interval=30,
        retry=Retry(
            ExponentialBackoff(cap=5, base=0.2),
            retries=3,
        ),
        retry_on_error=[ConnectionError, TimeoutError],
    )

    app.state.redis = redis_client

    try:
        await redis_client.ping()
        yield
    finally:
        await redis_client.aclose()


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication.auth_router)