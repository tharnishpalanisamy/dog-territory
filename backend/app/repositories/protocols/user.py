from typing import Protocol  

class UserProtocol(Protocol):

    def get_by_id(self , id ) :
        ... 

    def get_by_email(self , email ) :
        ...

    def create(self , user) :
        ... 