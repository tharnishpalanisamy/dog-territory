class DogRepository:
    def __init__(self, db):
        self.db = db

    async def create(self, dog):
        self.db.add(dog)
        await self.db.flush()
        await self.db.refresh(dog)

        return dog

    async def get_all(self):
        pass

    async def get_by_id(self, id):
        pass

    async def update_by_id(self, id, dog):
        pass
