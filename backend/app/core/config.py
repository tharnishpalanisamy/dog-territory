from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Points to the backend/ directory
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    # Database configuration
    DB_NAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int = 5432
    DB_USER: str

    # JWT configuration
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    REFRESH_TOKEN_EXPIRE_DAYS: int

    def __init__(self) -> None:
        super().__init__()

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


setting = Settings()
