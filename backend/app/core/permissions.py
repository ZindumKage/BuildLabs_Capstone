from curses.ascii import HT

from fastapi import Depends
from fastapi import HTTPException

from app.core.security import get_current_user


def require_roles(*roles):
    def checker(user=Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(
                status_code=403,
                detail="Permission denied"
            )
        return user
    
    return checker