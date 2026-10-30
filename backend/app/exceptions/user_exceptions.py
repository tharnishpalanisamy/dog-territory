class UserNotFoundException(Exception) :
    pass 

class EmailAlreadyExists(Exception) :
    pass 

class InvalidCredentialsException(Exception) :
    pass 


class NotAuthorizedException(Exception) : 
    pass 