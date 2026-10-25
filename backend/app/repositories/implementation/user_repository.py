from app.models.user import User 
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.exceptions import UserNotFoundException , EmailAlreadyExists

class UserRepository:
    def __init__(self , db:AsyncSession ) :
        self.db = db 

    async def create(self , user ) :
        try : 
            self.db.add(user) 
            await self.db.flush() 
            await self.db.commit()  

            return {
                'message' : 'account created successfully',
                'user_id' : user.id 
            } 
        except IntegrityError :  
            await self.db.rollback() 
            raise EmailAlreadyExists(f'Email Already Exists !')
        except Exception :
            await self.db.rollback()
            raise 

    async def get_by_id(self , id) : 
        statement = select(User).where(
            User.id == id
        ) 

        user = await self.db.scalar(statement)

        if user is None :
            raise UserNotFoundException(f"User with id {id} not found") 

        return user 

    async def get_by_email(self, email) : 
        statement = select(User).where(
            User.email == email
        ) 

        user = await self.db.scalar(statement)

        if user is None :
            raise UserNotFoundException(f"User with email {email} not found") 

        return user

    
