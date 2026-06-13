from pydantic import BaseModel
from datetime import datetime


class SaleCreate(BaseModel):
    product_id: int
    quantity: int


class SaleResponse(BaseModel):
    id: int

    product_id: int

    product_name: str

    product_sku: str

    quantity: int

    unit_price: float

    total_amount: float

    created_at: datetime

    class Config:
        from_attributes = True

class SaleListResponse(BaseModel):
    items: list[SaleResponse]
    total: int
    page: int
    page_size: int
    pages: int