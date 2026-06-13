from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.user import User
from app.models.stock_movement import StockMovement

from app.schemas.stock import StockAdjustment, StockMovementResponse

from app.core.security import get_current_user

from app.services.inventory_service import InventoryService

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.post("/add-stock")
def add_stock(
    payload: StockAdjustment,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = InventoryService.add_stock(
        db=db,
        product_id=payload.product_id,
        quantity=payload.quantity,
        notes=payload.notes,
    )

    return {
        "message": "Stock added successfully",
        "product_id": product.id,
        "current_stock": product.quantity,
    }


@router.post("/remove-stock")
def remove_stock(
    payload: StockAdjustment,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = InventoryService.remove_stock(
        db=db,
        product_id=payload.product_id,
        quantity=payload.quantity,
        notes=payload.notes,
    )

    return {
        "message": "Stock removed successfully",
        "product_id": product.id,
        "current_stock": product.quantity,
    }


@router.get("/history")
def get_stock_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    movements = (
        db.query(StockMovement)
        .order_by(
            StockMovement.created_at.desc()
        )
        .all()
    )

    items = [
        {
            "id": movement.id,
            "product_id": movement.product_id,
            "product_name": movement.product.name,
            "product_sku": movement.product.sku,
            "movement_type": movement.movement_type,
            "quantity": movement.quantity,
            "notes": movement.notes,
            "created_at": movement.created_at,
        }
        for movement in movements
    ]

    return {
        "items": items,
        "total": len(items),
        "page": 1,
        "pages": 1,
    }

@router.get("/history/{product_id}")
def get_product_history(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    movements = (
        db.query(StockMovement)
        .order_by(
            StockMovement.created_at.desc()
        )
        .all()
    )

    items = [
        {
            "id": movement.id,
            "product_id": movement.product_id,
            "product_name": movement.product.name,
            "product_sku": movement.product.sku,
            "movement_type": movement.movement_type,
            "quantity": movement.quantity,
            "notes": movement.notes,
            "created_at": movement.created_at,
        }
        for movement in movements
    ]

    return {
        "items": items,
        "total": len(items),
        "page": 1,
        "pages": 1,
    }