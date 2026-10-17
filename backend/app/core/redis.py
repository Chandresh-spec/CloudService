from fastapi import Request
from redis.asyncio import Redis
from redis.exceptions import ConnectionError, TimeoutError
from redis.backoff import ExponentialBackoff
from redis.retry import Retry

from ..config import settings


def get_redis_connection(request: Request) -> Redis:
    # Return the existing client created by lifespan
    return request.app.state.redis