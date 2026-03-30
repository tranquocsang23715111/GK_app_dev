from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..schemas import UserCreate, UserLogin
from ..models import User
from ..auth import create_token, get_db

router = APIRouter(prefix="/auth")

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    return {"msg": "User created"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user or db_user.password != user.password:
        return {"error": "Invalid credentials"}

    token = create_token({"user_id": db_user.id})
    return {"access_token": token}