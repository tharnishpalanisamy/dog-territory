from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import EmailAlreadyExists
from app.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user: User) -> User:
        try:
            self.db.add(user)
            await self.db.flush()
            await self.db.refresh(user)

            return user
        except IntegrityError:
            raise EmailAlreadyExists("Email Already Exists !")

    async def get_by_id(self, user_id: int) -> User | None:
        statement = select(User).where(User.id == user_id)
        user = await self.db.scalar(statement)

        return user

    async def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        user = await self.db.scalar(statement)

        return user

    async def update_password(
        self,
        id: int,
        password: str,
    ) -> User:
        query = (
            update(User)
            .where(User.id == id)
            .values(password_hash=password)
            .returning(User)
        )

        result = await self.db.execute(query)
        user = result.scalar_one()
        return user

    async def update(self, user: User, fields: dict[str, str]) -> User:
        for field, value in fields.items():
            setattr(user, field, value)

        await self.db.flush()
        await self.db.refresh(user)
        return user
