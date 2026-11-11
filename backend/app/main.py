import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1 import router_v1
from app.core import limiter, setup_logging
from app.exception_handlers import register_exception_handlers
from app.middleware import log_requests

logger = logging.getLogger(__name__)


setup_logging()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app = FastAPI()
app.state.limiter = limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(log_requests)

app.include_router(router_v1)


register_exception_handlers(app)
