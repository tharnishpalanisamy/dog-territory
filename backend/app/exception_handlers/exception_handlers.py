import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions import (
    AssignmentAlreadyClaimedException,
    AssignmentNotFoundException,
    DogNotFoundException,
    EmailAlreadyExists,
    InvalidCredentialsException,
    InvalidRefreshTokenException,
    NotAuthorizedException,
    ReportNotFoundException,
    UserNotFoundException,
    VolunteerAlreadyExistsException,
    VolunteerNotFoundException,
    VolunteerServiceNotAvailable,
)

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI) -> None:

    @app.exception_handler(UserNotFoundException)
    async def user_not_found_handler(
        request: Request,
        exc: UserNotFoundException,
    ) -> JSONResponse:
        logger.info("User not found")

        return JSONResponse(
            status_code=404,
            content={"detail": str(exc) or "User not found"},
        )

    @app.exception_handler(DogNotFoundException)
    async def dog_not_found_handler(
        request: Request,
        exc: DogNotFoundException,
    ) -> JSONResponse:
        logger.info("Dog not found")

        return JSONResponse(
            status_code=404,
            content={"detail": str(exc) or "Dog not found"},
        )

    @app.exception_handler(ReportNotFoundException)
    async def report_not_found_handler(
        request: Request,
        exc: ReportNotFoundException,
    ) -> JSONResponse:
        logger.info("Report not found")
        return JSONResponse(
            status_code=404,
            content={"detail": str(exc) or "Report not found"},
        )

    @app.exception_handler(AssignmentNotFoundException)
    async def assignment_not_found_handler(
        request: Request,
        exc: AssignmentNotFoundException,
    ) -> JSONResponse:
        logger.info("Assignment not found")
        return JSONResponse(
            status_code=404,
            content={"detail": str(exc) or "Assignment not found"},
        )

    @app.exception_handler(AssignmentAlreadyClaimedException)
    async def assignment_already_claimed_handler(
        request: Request,
        exc: AssignmentAlreadyClaimedException,
    ) -> JSONResponse:
        logger.info("Assignment is already assigned")
        return JSONResponse(
            status_code=409,
            content={"detail": str(exc) or "Assignment has already been assigned"},
        )

    @app.exception_handler(VolunteerNotFoundException)
    async def volunteer_not_found_handler(
        request: Request,
        exc: VolunteerNotFoundException,
    ) -> JSONResponse:
        logger.info("Volunteer not found")
        return JSONResponse(
            status_code=404,
            content={"detail": str(exc) or "Volunteer not found"},
        )

    @app.exception_handler(VolunteerServiceNotAvailable)
    async def volunteer_service_not_available_handler(
        request: Request,
        exc: VolunteerServiceNotAvailable,
    ) -> JSONResponse:
        logger.info("Volunteer does not serve the requested location")
        return JSONResponse(
            status_code=422,
            content={"detail": str(exc) or "Volunteer does not serve that location"},
        )

    @app.exception_handler(VolunteerAlreadyExistsException)
    async def volunteer_already_exists_handler(
        request: Request,
        exc: VolunteerAlreadyExistsException,
    ) -> JSONResponse:
        logger.info("Volunteer already exists")
        return JSONResponse(
            status_code=409,
            content={"detail": str(exc) or "Volunteer already exists"},
        )

    @app.exception_handler(EmailAlreadyExists)
    async def email_already_exists_handler(
        request: Request,
        exc: EmailAlreadyExists,
    ) -> JSONResponse:
        logger.info("Registration failed: email already exists")

        return JSONResponse(
            status_code=409,
            content={"detail": str(exc) or "Email already exists"},
        )

    @app.exception_handler(InvalidCredentialsException)
    async def invalid_credentials_handler(
        request: Request,
        exc: InvalidCredentialsException,
    ) -> JSONResponse:
        logger.warning("Authentication failed: invalid credentials")

        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid email or password"},
        )

    @app.exception_handler(InvalidRefreshTokenException)
    async def invalid_refresh_token_handler(
        request: Request,
        exc: InvalidRefreshTokenException,
    ) -> JSONResponse:
        logger.warning("Refresh token validation failed")

        return JSONResponse(
            status_code=401,
            content={"detail": str(exc) or "Invalid or expired refresh token"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    @app.exception_handler(NotAuthorizedException)
    async def not_authorized_handler(
        request: Request,
        exc: NotAuthorizedException,
    ) -> JSONResponse:
        logger.warning("Authorization failed")

        return JSONResponse(
            status_code=403,
            content={
                "detail": str(exc) or "You are not authorized to perform this action"
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred"},
        )
