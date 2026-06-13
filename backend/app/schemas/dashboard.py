from pydantic import BaseModel



class DashboardResponse(BaseModel):
    total_products: int
    total_stock: int

    low_stock_products: int

    sales_today: int
    sales_this_month: int

    revenue_today: float
    revenue_this_month: float

    best_selling_product: str | None