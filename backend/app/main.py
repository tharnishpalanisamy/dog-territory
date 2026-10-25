from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth_router import router as auth_router 
from app.exception_handlers import register_exception_handlers

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
register_exception_handlers(app)