from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models, schemas

#イベント関連
def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Event).offset(skip).limit(limit).all()

def get_event(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(
        name=event.name,
        organizer=event.organizer,
        date=event.date,
        description=event.description,
        comment=event.comment,
        file_path=event.file_path  # ← ここが必要
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: int, event: schemas.EventUpdate):
    db_event = get_event(db, event_id)
    if not db_event:
        return None
    for key, value in event.dict(exclude_unset=True).items():
        setattr(db_event, key, value)
    db.commit()
    db.refresh(db_event)
    return db_event

#ログイン関連
pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")
def get_user_by_username(db:Session,username:str):
    return db.query(models.User).filter(models.User.username==username).first()

def create_user(db:Session,user:schemas.UserCreate):
    hashed_password=pwd_context.hash(user.password)
    db_user=models.User(username=user.username,hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db:Session,username:str,password:str):
    user=get_user_by_username(db,username)
    if not user:
        return False
    if not pwd_context.verify(password,user.hashed_password):
        return False
    return user

#検索機能
def search_events(db:Session,keyword:str):
    return db.query(models.Event).filter(
        models.Event.name.contains(keyword)|
        models.Event.description.contains(keyword)
    ).all()