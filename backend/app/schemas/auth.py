from pydantic import BaseModel , Field 
from datetime import datetime , date

class UserLogin(BaseModel) :
    email : str 
    password : str 


class UserCreate(BaseModel) : 
    username : str
    email : str 
    password : str 
    date_of_birth : date | None = Field(default=None)
    created_at : datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"