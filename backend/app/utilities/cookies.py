from fastapi import Response

from app.core.config import setting


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key=setting.REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=setting.COOKIE_SECURE,
        samesite=setting.COOKIE_SAMESITE,
        max_age=setting.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path=setting.REFRESH_COOKIE_PATH,
    )


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(
        key=setting.REFRESH_COOKIE_NAME,
        httponly=True,
        secure=setting.COOKIE_SECURE,
        samesite=setting.COOKIE_SAMESITE,
        path=setting.REFRESH_COOKIE_PATH,
    )
