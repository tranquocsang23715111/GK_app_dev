import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User

SECRET_KEY = "this_is_a_very_strong_secret_key_123456"
security = HTTPBearer()

def create_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm="HS256")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token=Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
        user = db.query(User).get(payload["user_id"])
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")