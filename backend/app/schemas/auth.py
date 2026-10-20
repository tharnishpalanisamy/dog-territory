from pydantic import BaseModel , Field 
from datetime import datetime

class UserLogin(BaseModel) :
    email : str 
    password : str 


class UserCreate(BaseModel) : 
    username : str
    email : str 
    password : str 
    date_of_birth : datetime 

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"