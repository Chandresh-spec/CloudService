
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from redis.asyncio import Redis

from ..core.database import get_db_async
from ..core.redis import get_redis_connection
from ..models import User
from ..schemas import RegisterData,OtpBodyIn
from ..auth import hash_password
from ..services.email import Otp, RateLimitExceed,VerifyResult

import logging

logger = logging.getLogger(__name__)

auth_router = APIRouter(
    prefix="/api/auth",
    tags=["userauth"],
)


async def get_otp_service(
    redis: Redis = Depends(get_redis_connection),
) -> Otp:
    # Create an OTP service using the shared Redis client.
    return Otp(redis)


async def issue_otp(email: str, svc: Otp):
    try:
        otp = await svc.issue_and_send(email)

    except RateLimitExceed as e:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"retry after {e}",
        )

    return otp


@auth_router.post("/register")
async def register(
    body: RegisterData,
    db: AsyncSession = Depends(get_db_async),
    svc: Otp = Depends(get_otp_service),
):
    email = body.email.strip().lower()

    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    existing_email = result.scalar_one_or_none()

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )

    user = User(
        name=body.name.strip(),
        email=email,
        hashed_password=hash_password(body.password.strip()),
    )

    db.add(user)

    try:
        await db.commit()
        logger.info("DB committed successfully")

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists",
        )

    otp=await issue_otp(email, svc)

    return {
        "message": "User registered successfully",
        "otp":otp
    }



@auth_router.post('/verify_otp')
async def verify_otp(body:OtpBodyIn,svc:Otp=Depends(get_otp_service),db:AsyncSession=Depends(get_db_async)):
    email=body.email.strip()

    result=await svc.verify_script(email)

    print(result)

    if result == VerifyResult.EXPIRED:
        raise HTTPException(400,detail="Code is expired")

    if result == VerifyResult.LOCKED:
        raise HTTPException(429,"To many Attempts")

    if result == VerifyResult.WRONG:
        raise HTTPException(400,"Enter Otp is Wrong")

    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user=result.scalar_one_or_none()

    user.is_verified=True

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return {
        "message":"Otp Verfication sucessfull"
    }

