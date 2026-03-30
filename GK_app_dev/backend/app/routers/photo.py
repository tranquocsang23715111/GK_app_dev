from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..models import Photo
from ..auth import get_db, get_current_user
import shutil

router = APIRouter(prefix="/photo")


# Upload ảnh
@router.post("/")
def upload(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    import os, uuid

    os.makedirs("images", exist_ok=True)

    # tránh trùng file
    filename = f"{uuid.uuid4()}_{file.filename}"
    path = f"images/{filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    photo = Photo(
        title=title,
        description=description,
        image_url=path,
        user_id=user.id
    )

    db.add(photo)
    db.commit()
    db.refresh(photo)

    return photo


# Lấy danh sách
@router.get("/")
def get_all(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Photo).filter(Photo.user_id == user.id).all()


# Xóa
@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    photo = db.query(Photo).get(id)
    db.delete(photo)
    db.commit()
    return {"msg": "deleted"}


# Update
@router.put("/{id}")
def update(id: int, title: str, description: str, db: Session = Depends(get_db)):
    photo = db.query(Photo).get(id)
    photo.title = title
    photo.description = description
    db.commit()
    return photo


# Search
@router.get("/search")
def search(q: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Photo).filter(
        Photo.title.contains(q),
        Photo.user_id == user.id
    ).all()