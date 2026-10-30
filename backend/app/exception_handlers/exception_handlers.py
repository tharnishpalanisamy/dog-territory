import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions import (
    EmailAlreadyExists,
    InvalidCredentialsException,
    InvalidRefreshTokenException,
    UserNotFoundException,
)

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(UserNotFoundException)
    async def user_not_found_handler(
        request: Request,
        exc: UserNotFoundException,
    ):
        logger.info("User not found")

        return JSONResponse(
            status_code=404,
            content={"detail": str(exc) or "User not found"},
        )

    @app.exception_handler(EmailAlreadyExists)
    async def email_already_exists_handler(
        request: Request,
        exc: EmailAlreadyExists,
    ):
        logger.info("Registration failed: email already exists")

        return JSONResponse(
            status_code=409,
            content={"detail": str(exc) or "Email already exists"},
        )

    @app.exception_handler(InvalidCredentialsException)
    async def invalid_credentials_handler(
        request: Request,
        exc: InvalidCredentialsException,
    ):
        logger.warning("Authentication failed: invalid credentials")

        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid email or password"},
        )

    @app.exception_handler(InvalidRefreshTokenException)
    async def invalid_refresh_token_handler(
        request: Request,
        exc: InvalidRefreshTokenException,
    ):
        logger.warning("Refresh token validation failed")

        return JSONResponse(
            status_code=401,
            content={"detail": str(exc) or "Invalid or expired refresh token"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request,
        exc: Exception,
    ):
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred"},
        )
