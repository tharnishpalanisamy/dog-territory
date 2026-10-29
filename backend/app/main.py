import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core import setup_logging
from app.exception_handlers import register_exception_handlers
from app.routers import auth_router

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


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.perf_counter()

    method = request.method
    path = request.url.path

    print(f"Incoming request: {method} {path}")

    try:
        response = await call_next(request)
    except Exception:
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        print(
            f"{method} {path} | "
            f"Status: 500 | "
            f"Time: {elapsed_ms:.2f} ms | "
            f"Outcome: Unhandled exception"
        )
        raise

    elapsed_ms = (time.perf_counter() - start_time) * 1000

    print(
        f"{method} {path} | Status: {response.status_code} | Time: {elapsed_ms:.2f} ms"
    )

    return response


app.include_router(auth_router)
register_exception_handlers(app)
