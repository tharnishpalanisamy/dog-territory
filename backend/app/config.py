
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    DB_NAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int = 5432
    DB_USER : str 

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


setting = Settings()
