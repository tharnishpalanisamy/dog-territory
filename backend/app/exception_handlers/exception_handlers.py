
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions import (
    UserNotFoundException,
    EmailAlreadyExists,
    InvalidCredentialsException,
)


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(UserNotFoundException)
    async def user_not_found_handler(
        request: Request,
        exc: UserNotFoundException,
    ):
        return JSONResponse(
            status_code=404,
            content={"detail": str(exc) or "User not found"},
        )

    @app.exception_handler(EmailAlreadyExists)
    async def email_already_exists_handler(
        request: Request,
        exc: EmailAlreadyExists,
    ):
        return JSONResponse(
            status_code=409,
            content={"detail": str(exc) or "Email already exists"},
        )

    @app.exception_handler(InvalidCredentialsException)
    async def invalid_credentials_handler(
        request: Request,
        exc: InvalidCredentialsException,
    ):
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid email or password"},
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
