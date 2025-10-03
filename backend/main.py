from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
from typing import List
from urllib.parse import unquote
import models, schemas, crud
import os
from database import SessionLocal, engine

# DB初期化
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS 設定（React 開発サーバーからのアクセスを許可）
origins = [
    "http://localhost:5173",
    "https://staff-website-backend.onrender.com",
    "https://staff-website-hd6pi4j7w-ls-projects-541fc566.vercel.app"
    ]

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 投稿可能なファイル形式
ALLOWED_TYPES = [
    "application/msword",  # .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # .docx
    "application/vnd.ms-excel",  # .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  # .xlsx
    "image/jpeg",
    "image/png",
    "image/gif",
]

# DBセッション依存関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# チュートリアル用
@app.get("/api/")
async def root():
    return {"message": "Hello, FastAPI!"}

# イベント一覧取得
@app.get("/api/events/", response_model=list[schemas.Event])
def read_events(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_events(db, skip=skip, limit=limit)

# ログイン
@app.post("/api/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_username = crud.get_user_by_username(db, user.username)
    if not db_username:
        raise HTTPException(status_code=400, detail="該当ユーザーが存在しません,ユーザー名を確認してください")
    db_user = crud.authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="パスワードが正しくありません")
    return {"id": db_user.id, "username": db_user.username}

# 新規登録
@app.post("/api/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = crud.create_user(db, user)
    return {"id": new_user.id, "username": new_user.username}

# 検索機能
@app.get("/api/events/search", response_model=list[schemas.Event])
def search_events(keyword: str, db: Session = Depends(get_db)):
    return crud.search_events(db, keyword)

# ファイル投稿（複数ファイル対応）
@app.post("/api/events/", response_model=schemas.Event)
async def create_event_with_file(
    name: str = Form(...),
    description: str = Form(...),
    date: str = Form(...),
    organizer: str = Form(...),
    files: List[UploadFile] = File([]),
    db: Session = Depends(get_db)
):
    saved_files = []

    for file in files:
        # ファイル形式チェック
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"対応形式は Word(.doc, .docx), Excel(.xls, .xlsx), 画像(.jpg, .jpeg, .png, .gif) のみです: {file.filename}"
            )

        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        saved_files.append(file.filename)

    # DB にカンマ区切りでファイル名保存
    event_data = schemas.EventCreate(
        name=name,
        description=description,
        date=date,
        organizer=organizer,
        file_path=",".join(saved_files) if saved_files else None
    )
    new_event = crud.create_event(db=db, event=event_data)
    return new_event

# ファイルダウンロード（個別ファイル）
@app.get("/api/files/{filename}")
async def download_file(filename: str):
    decoded_filename = unquote(filename)
    file_path = os.path.join(UPLOAD_DIR, decoded_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=decoded_filename)
