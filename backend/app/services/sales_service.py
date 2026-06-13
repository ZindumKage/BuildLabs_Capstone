from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.sale import Sale
from app.models.stock_movement import StockMovement


class SalesService:

    @staticmethod
    def create_sale(
        db: Session,
        product_id: int,
        quantity: int
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

        total_amount = (
            quantity * product.price
        )

        sale = Sale(
            product_id=product.id,
            quantity=quantity,
            unit_price=product.price,
            total_amount=total_amount
        )

        movement = StockMovement(
            product_id=product.id,
            movement_type="sale",
            quantity=quantity,
            notes="Sale Transaction"
        )

        db.add(sale)
        db.add(movement)

        db.commit()

        db.refresh(sale)

        return sale