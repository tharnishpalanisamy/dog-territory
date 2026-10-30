import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import setup_logging
from app.exception_handlers import register_exception_handlers
from app.middleware import log_requests
from app.routers import auth_router, dog_router

logger = logging.getLogger(__name__)


setup_logging()

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

app.middleware("http")(log_requests)

app.include_router(auth_router)
app.include_router(dog_router)


register_exception_handlers(app)
