from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

import math

from app.core.database import get_db

from app.models.user import User
from app.models.sale import Sale

from app.schemas.sale import (
    SaleCreate,
    SaleResponse,
    SaleListResponse,
)

from app.services.sales_service import (
    SalesService,
)

from app.core.security import (
    get_current_user,
)

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


def build_sale_response(sale: Sale):
    return {
        "id": sale.id,
        "product_id": sale.product_id,
        "product_name": sale.product.name,
        "product_sku": sale.product.sku,
        "quantity": sale.quantity,
        "unit_price": sale.unit_price,
        "total_amount": sale.total_amount,
        "created_at": sale.created_at,
    }


@router.post(
    "",
    response_model=SaleResponse,
)
def create_sale(
    payload: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sale = SalesService.create_sale(
        db=db,
        product_id=payload.product_id,
        quantity=payload.quantity,
    )

    return build_sale_response(sale)


@router.get(
    "",
    response_model=SaleListResponse,
)
def get_sales(
    page: int = 1,
    page_size: int = 15,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Sale)

    total = query.count()

    sales = (
        query
        .order_by(Sale.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = [
        build_sale_response(sale)
        for sale in sales
    ]

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": math.ceil(total / page_size) if total else 1,
    }


@router.get(
    "/product/{product_id}",
    response_model=list[SaleResponse],
)
def get_product_sales(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sales = (
        db.query(Sale)
        .filter(Sale.product_id == product_id)
        .order_by(Sale.created_at.desc())
        .all()
    )

    return [
        build_sale_response(sale)
        for sale in sales
    ]