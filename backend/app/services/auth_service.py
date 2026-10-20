from repositories.auth_repository import AuthRepository 
from core import hash_password
from models.user import User 

class AuthService:
    def __init__(self , db ) :
        self.repository = AuthRepository(db)

    async def authenticate_user(self , user_data) : 
        user = await self.repository.authenticate_user(user_data) 
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
        }

    async def signup_user(self, signup_data ) :
        hashed_password = hash_password(signup_data.password) 

        user = User(
            email = signup_data.email , 
            password_hash = hashed_password , 
            username = signup_data.username
        ) 

        return await self.repository.create_user(user) 