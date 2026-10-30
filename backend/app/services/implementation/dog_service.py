class DogService :

    def __init__(self , db , repository ) :
        self.db = db 
        self.repository = repository 

    async def create_dog(self, dog_data): 
        pass 
    
    async def get_all_dogs(self): 
        pass

    async def get_dog_by_id(self, id): 
        pass

    async def update_dog_by_id(self, id, dog_data): 
        pass


