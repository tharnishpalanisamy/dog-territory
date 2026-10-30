import logging
import time

from fastapi import Request

logger = logging.getLogger(__name__)


async def log_requests(request: Request, call_next):
    start_time = time.perf_counter()
    method = request.method
    path = request.url.path

    logger.info("Incoming request: %s %s", method, path)

    try:
        response = await call_next(request)
    except Exception:
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        logger.exception(
            "%s %s | Status: 500 | Time: %.2f ms | Outcome: Unhandled exception",
            method,
            path,
            elapsed_ms,
        )
        raise

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    status_code = response.status_code
    log_msg = "%s %s | Status: %s | Time: %.2f ms"
    log_args = (method, path, status_code, elapsed_ms)

    # Dynamically change logging level based on HTTP Status Code
    if status_code >= 500:
        logger.error(log_msg, *log_args)
    elif status_code >= 400:
        logger.warning(log_msg, *log_args)
    else:
        logger.info(log_msg, *log_args)

    return response
