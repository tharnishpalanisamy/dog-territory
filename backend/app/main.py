from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth_router import router as auth_router

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app = FastAPI() 
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)