from pydantic import BaseModel , Field 
from datetime import datetime , date
from sqlalchemy import func

class UserLogin(BaseModel) :
    email : str 
    password : str 


class UserCreate(BaseModel) : 
    username : str
    email : str 
    password : str 

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"