from pydantic import BaseModel,constr
from datetime import date

class EventBase(BaseModel):
    name: str
    organizer: str
    date: date
    description: str | None = None
    comment: str | None = None
    file_path: str | None=None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int

    class Config:
        orm_mode = True
#ユーザーログインのデータ形式の定義
class UserCreate(BaseModel):
    username:constr(pattern=r'^[a-zA-Z0-9]{5,20}$')
    password:constr(pattern=r'^[a-zA-Z0-9]{5,20}$')
#APIから返すデータ形式の定義
class UserOut(BaseModel):
    id:int
    username:str
    
    class Config:
        orm_mode=True