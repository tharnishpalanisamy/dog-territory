from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=255)
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str = Field(max_length=100)
    email: EmailStr = Field(max_length=255)