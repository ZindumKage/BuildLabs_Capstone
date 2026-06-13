from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.user import User
from app.models.product import Product

from app.schemas.dashboard import (
    DashboardResponse
)

from app.services.dashboard_service import (
    DashboardService
)

from app.core.security import (
    get_current_user
)
from app.models.sale import Sale

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "",
    response_model=DashboardResponse
)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    return DashboardService.get_dashboard_data(
        db
    )
    
@router.get("/low-stock")
def low_stock_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    products = (
        db.query(Product)
        .filter(
            Product.quantity <= Product.reorder_level
        )
        .all()
    )

    return products

# app/api/routes/dashboard.py
@router.get("/activities")
def get_recent_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sales = (
        db.query(Sale)
        .order_by(Sale.created_at.desc())
        .limit(10)
        .all()
    )

    activities = [
        {
            "id": sale.id,
            "type": "sale",
            "description": f"Sold {sale.quantity} units of {sale.product.name}",
            "timestamp": sale.created_at,
        }
        for sale in sales
    ]

    return activities 