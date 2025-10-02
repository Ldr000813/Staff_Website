from sqlalchemy import Column, Integer, String, Date, Text
from database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)          # イベント名
    organizer = Column(String(100), nullable=False)     # 主催者名
    date = Column(Date, nullable=False)                 # 開催日
    description = Column(Text)                          # 概要説明
    comment = Column(Text)                              # 主催者コメント
    file_path=Column(String,nullable=True)

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)
    username=Column(String,unique=True,index=True,nullable=False)
    hashed_password=Column(String,nullable=False)