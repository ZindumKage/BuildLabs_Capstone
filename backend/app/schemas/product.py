from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    category: Optional[str] = None
    price: float
    quantity: int = 0
    reorder_level: int = 10


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    reorder_level: Optional[int] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    description: Optional[str]
    category: Optional[str]
    price: float
    quantity: int

    is_low_stock: bool = False

    reorder_level: int
    created_at: datetime

    class Config:
        from_attributes = True
        
class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int