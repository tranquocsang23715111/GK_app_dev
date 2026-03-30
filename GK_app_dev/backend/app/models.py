from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String)
    password = Column(String)

    photos = relationship("Photo", back_populates="owner")


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    image_url = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="photos")