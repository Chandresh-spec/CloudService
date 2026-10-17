from pydantic_settings import BaseSettings,SettingsConfigDict

from functools import lru_cache

class Settings(BaseSettings):
    async_database_url:str
    sync_database_url :str
    pool_size:int
    max_overflow:int
    pool_pre_ping:True
    pool_timeout:int
    pool_recycle:int  
    redis_url:str
    otp_cooldown:int=150
    sends_cooldown:int
    otp_time_limit:int
    max_hourly_limit:int
    attempts_timeout:int=120
    max_attempts:int=2
    otp_secret:str="my name is fast"



    model_config=SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )



@lru_cache
def get_settings():
    return Settings()

settings=get_settings()