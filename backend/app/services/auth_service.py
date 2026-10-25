from app.core import hash_password , verify_password
from app.models.user import User 


class AuthService:
    def __init__(self , db , repository ) :
        self.db = db 
        self.repository = repository

    async def authenticate_user(self , user_data) : 
        user = await self.repository.get_by_email(user_data.email) 
        authenticated = verify_password(user_data.password , user.password_hash)

        if authenticated : 
            return {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            } 
        else : 
            return {
                'message' : 'Login failed ! ' , 
                'info' : 'email or password is incorrect' 
            }

    async def signup_user(self, signup_data ) :
        hashed_password = hash_password(signup_data.password) 

        user = User(
            email = signup_data.email , 
            password_hash = hashed_password , 
            username = signup_data.username
        ) 

        return await self.repository.create_user(user) 