from datetime import datetime
from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.sale import Sale


class DashboardService:

    @staticmethod
    def get_dashboard_data(db: Session):

        today = date.today()

        current_month = datetime.now().month
        current_year = datetime.now().year

        total_products = (
            db.query(Product)
            .count()
        )

        total_stock = (
            db.query(
                func.coalesce(
                    func.sum(Product.quantity),
                    0
                )
            )
            .scalar()
        )

        low_stock_products = (
            db.query(Product)
            .filter(
                Product.quantity <= Product.reorder_level
            )
            .count()
        )

        sales_today = (
            db.query(
                func.coalesce(
                    func.sum(Sale.quantity),
                    0
                )
            )
            .filter(
                func.date(Sale.created_at) == today
            )
            .scalar()
        )

        sales_this_month = (
            db.query(
                func.coalesce(
                    func.sum(Sale.quantity),
                    0
                )
            )
            .filter(
                func.month(Sale.created_at) == current_month,
                func.year(Sale.created_at) == current_year,
            )
            .scalar()
        )

        revenue_today = (
            db.query(
                func.coalesce(
                    func.sum(Sale.total_amount),
                    0
                )
            )
            .filter(
                func.date(Sale.created_at) == today
            )
            .scalar()
        )

        revenue_this_month = (
            db.query(
                func.coalesce(
                    func.sum(Sale.total_amount),
                    0
                )
            )
            .filter(
                func.month(Sale.created_at) == current_month,
                func.year(Sale.created_at) == current_year,
            )
            .scalar()
        )

        best_product = (
            db.query(
                Product.name,
                func.sum(
                    Sale.quantity
                ).label("units_sold")
            )
            .join(
                Sale,
                Product.id == Sale.product_id
            )
            .group_by(Product.name)
            .order_by(
                func.sum(
                    Sale.quantity
                ).desc()
            )
            .first()
        )

        best_selling_product = (
            best_product.name
            if best_product
            else None
        )

        return {
            "total_products": total_products,
            "total_stock": total_stock,
            "low_stock_products": low_stock_products,
            "sales_today": sales_today,
            "sales_this_month": sales_this_month,
            "revenue_today": revenue_today,
            "revenue_this_month": revenue_this_month,
            "best_selling_product": best_selling_product,
        }