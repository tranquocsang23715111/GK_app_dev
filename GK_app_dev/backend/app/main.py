from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .database import Base, engine
from .routers import user, photo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(photo.router)

app.mount("/images", StaticFiles(directory="images"), name="images")


"""
python -m venv venv
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
venv\Scripts\activate
"""