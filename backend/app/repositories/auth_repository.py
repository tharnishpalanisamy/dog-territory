from models.user import User 
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from exceptions import UserNotFoundException

class AuthRepository:
    def __init__(self , db:AsyncSession ) :
        self.db = db 

    async def authenticate_user(self , login_data) : 
        statement = select(User).where(
            User.email == login_data.email
        ) 

        user = await self.db.scalar(statement)

        if user is None :
            raise UserNotFoundException(f"User with email {login_data.email} not found") 

        return user 

    async def create_user(self , user ) :
        try : 
            self.db.add(user) 
            await self.db.flush() 
            await self.db.commit()  

            return {
                'message' : 'account created successfully'
            } 
        except Exception :
            await self.db.rollback()
            raise 
