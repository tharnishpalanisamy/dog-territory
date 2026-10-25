from app.core import hash_password , verify_password
from app.models.user import User 
from app.exceptions import UserNotFoundException , InvalidCredentialsException
from app.core import create_access_token


class AuthService:
    def __init__(self , db , repository ) :
        self.db = db 
        self.repository = repository

    async def authenticate_user(self, user_data):
        try:
            user = await self.repository.get_by_email(
                user_data.email
            )
        except UserNotFoundException:
            raise InvalidCredentialsException(f'Invalid Email or Password')

        if not verify_password(
            user_data.password,
            user.password_hash,
        ):
            raise InvalidCredentialsException(f'Invalid Email or Password') 

        access_token = create_access_token(user.id) 
        return { 
            'access_token' : access_token , 
            'token_type' : 'bearer' ,
            'user' : {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            }
            
        }

    
    async def signup_user(self, signup_data ) :
        hashed_password = hash_password(signup_data.password) 

        user = User(
            email = signup_data.email , 
            password_hash = hashed_password , 
            username = signup_data.username
        ) 

        return await self.repository.create(user) 