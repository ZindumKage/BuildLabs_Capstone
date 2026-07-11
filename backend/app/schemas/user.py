from typing import Literal

from pydantic import BaseModel
from pydantic import EmailStr

from datetime import datetime

from app.core.security import hash_password


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: Literal["admin", "manager", "staff", "viewer"] = "staff"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr 
    role: Literal["admin", "manager", "staff", "viewer"]
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
