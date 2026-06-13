from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.stock_movement import StockMovement


class InventoryService:

    @staticmethod
    def add_stock(
        db: Session,
        product_id: int,
        quantity: int,
        notes: str = None
    ):
        product = (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        product.quantity += quantity

        movement = StockMovement(
            product_id=product.id,
            movement_type="purchase",
            quantity=quantity,
            notes=notes
        )

        db.add(movement)

        db.commit()

        db.refresh(product)

        return product

    @staticmethod
    def remove_stock(
        db: Session,
        product_id: int,
        quantity: int,
        notes: str = None
    ):
        product = (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        if product.quantity < quantity:
            raise HTTPException(
                status_code=400,
                detail="Insufficient stock"
            )

        product.quantity -= quantity

        movement = StockMovement(
            product_id=product.id,
            movement_type="sale",
            quantity=quantity,
            notes=notes
        )

        db.add(movement)

        db.commit()

        db.refresh(product)

        return product