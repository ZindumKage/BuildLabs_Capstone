from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StockAdjustment(BaseModel):
    product_id: int
    quantity: int
    notes: Optional[str] = None


class StockMovementResponse(BaseModel):
    id: int

    product_id: int

    product_name: str

    product_sku: str

    movement_type: str

    quantity: int

    notes: Optional[str]

    created_at: datetime

    class Config:
        from_attributes = True
