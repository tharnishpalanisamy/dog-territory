from repositories.auth_repository import AuthRepository 

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