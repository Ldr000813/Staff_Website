from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite データベースURL
SQLALCHEMY_DATABASE_URL = "sqlite:///./events.db"

# SQLite の場合、同時アクセスのために check_same_thread=False が必要
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
