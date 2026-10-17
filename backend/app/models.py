from .core.database import Base
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy import String,Enum as SQLEnum,Boolean,DateTime,func,UniqueConstraint
from sqlalchemy import Uuid
import uuid 
from enum import Enum
from datetime import timezone,timedelta,datetime

class StatusEnum(Enum):
    ACTIVE='Active'
    INACTIVE='Inactive'
    DELETED='Deleted'

class User(Base):
    __tablename__ ="users"
    id:Mapped[uuid.UUID]=mapped_column(Uuid(as_uuid=True),primary_key=True,default=uuid.uuid4)
    name:Mapped[str]=mapped_column(String(100))
    email:Mapped[str]=mapped_column(String(100),unique=True,nullable=False)
    hashed_password:Mapped[str]=mapped_column(String(100),nullable=False)
    status:Mapped[StatusEnum]=mapped_column(SQLEnum(StatusEnum),default=StatusEnum.ACTIVE)
    is_verified:Mapped[bool]=mapped_column(Boolean,default=False)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now())
    deleted_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),nullable=True)


    __table_args__=(UniqueConstraint(
        'email',name="unq_email"
    ),)

    



