from redis.asyncio import Redis
import hashlib
import secrets
import hmac
from ..config import settings
from enum import Enum
class RateLimitExceed(BaseException):
    def __init__(self,retry_after):
        self.retry_after=max(retry_after,1)



LUA_VERIFY="""
local stored=redis.call('GET',KEYS[1])
if not stored then return -1 end

local attempts=redis.call('INCR',KEYS[2])
if attempts ==1 then redis.call('EXPIRE',KEYS[2],tonumber(ARGV[1])) end

if attempts > tonumber(ARGV[2]) then
   redis.call('DEL',KEYS[1],KEYS[2])
   return -1

end

if stored == ARGV[3]then
   redis.call('DEL',KEYS[1],KEYS[2])
   return 1
end

return 0

"""

class VerifyResult(Enum):
    OK = 1
    WRONG = 0
    EXPIRED = -1
    LOCKED = -2


def _kind(kind:str,email:str):
    return f"opt:{kind}:{email}"

def generate_otp():
    return f"{secrets.randbelow(10*6):06d}"

def hash_otp(email:str,otp:str):
    return hmac.new(f"{email}:{otp}.".encode(),f"{settings.otp_secret}".encode(),hashlib.sha256).hexdigest()


class Otp():
    def __init__(self,redis:Redis):
        self.redis=redis
        self.verify_script=redis.register_script(LUA_VERIFY)



    async def issue_and_send(self,email):
        ok=await self.redis.set(_kind("cooldown",email),1,nx=True,ex=settings.otp_cooldown)
        if  not ok:
            raise RateLimitExceed(await self.redis.ttl(_kind("cooldown",email)))

        sends_key=_kind("sends",email)
        send=await self.redis.ttl(sends_key)
        if send == 1:
            await self.redis.expire(sends_key,settings.sends_cooldown)
        if send > settings.max_hourly_limit:
            raise RateLimitExceed(await self.redis.ttl(sends_key))

        otp=generate_otp()

        pipe=await self.redis.pipeline(transaction=True)
        pipe.set(_kind("code",email),hash_otp(email,otp),ex=settings.otp_time_limit)
        pipe.delete(_kind("attempts",email))

        pipe.execute()
        return otp

    async def verify_otp(self,email,otp):
        res=await self.verify_script(
            keys=[_kind("code",email),
                  _kind("attempts",email)],
            args=[settings.attempts_timeout,settings.max_attempts,otp]
        )
        print(res)

        return VerifyResult(res)

        


    


        

        


        