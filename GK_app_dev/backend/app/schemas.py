from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class PhotoCreate(BaseModel):
    title: str
    description: str

class PhotoUpdate(BaseModel):
    title: str
    description: str

class PhotoOut(BaseModel):
    id: int
    title: str
    description: str
    image_url: str
    uploaded_at: datetime

    class Config:
        from_attributes = True