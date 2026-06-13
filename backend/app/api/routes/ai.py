from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.product import Product
from app.models.sale import Sale
from app.models.user import User
from app.schemas.ai import AIQueryRequest, AIQueryResponse
from app.services.ai_service import AIService
from datetime import timedelta

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"],
)


@router.post(
    "/query",
    response_model=AIQueryResponse,
)
def ai_query(
    payload: AIQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        intent_data = AIService.detect_intent(payload.question, payload.history)
        print("INTENT DATA:", intent_data)
    except Exception as e:
        return {"answer": f"AI Error: {str(e)}"}

    intent = intent_data.get("intent")
    print("INTENT:", intent)

    if not intent:
        return {"answer": "Unable to determine intent."}

    # Best Selling Product
    if intent == "best_selling_product":
        best = (
            db.query(
                Product.name,
                func.sum(Sale.quantity).label("sold"),
            )
            .join(Sale, Product.id == Sale.product_id)
            .group_by(Product.name)
            .order_by(func.sum(Sale.quantity).desc())
            .first()
        )

        if not best:
            return {"answer": "No sales recorded yet."}

        return {
            "answer": f"{best.name} is the best selling product with {best.sold} units sold."
        }

    # Low Stock Products
    if intent == "low_stock_products":
        products = (
            db.query(Product).filter(Product.quantity <= Product.reorder_level).all()
        )

        if not products:
            return {"answer": "No low stock products."}

        names = [p.name for p in products]
        return {"answer": "Low stock items: " + ", ".join(names)}
    if intent == "sales_today":
        total = (
            db.query(func.coalesce(func.sum(Sale.quantity), 0))
            .filter(func.date(Sale.created_at) == date.today())
            .scalar()
        )
        return {"answer": f"{total} items were sold today."}

    # Sales Today Details
    if intent == "sales_today_details":
        sales = (
            db.query(Sale, Product)
            .join(Product, Product.id == Sale.product_id)
            .filter(func.date(Sale.created_at) == date.today())
            .all()
        )

        if not sales:
            return {"answer": "No sales today."}

        result = [f"{product.name}: {sale.quantity} units" for sale, product in sales]
        return {"answer": "\n".join(result)}

    # Sales This Month
    if intent == "sales_this_month":
        total = (
            db.query(func.coalesce(func.sum(Sale.quantity), 0))
            .filter(
                func.month(Sale.created_at) == datetime.now().month,
                func.year(Sale.created_at) == datetime.now().year,
            )
            .scalar()
        )
        return {"answer": f"{total} items have been sold this month."}

    # Sales Month Details
    if intent == "sales_month_details":
        sales = (
            db.query(Sale, Product)
            .join(Product, Product.id == Sale.product_id)
            .filter(
                func.month(Sale.created_at) == datetime.now().month,
                func.year(Sale.created_at) == datetime.now().year,
            )
            .all()
        )

        if not sales:
            return {"answer": "No sales this month."}

        result = [f"{product.name}: {sale.quantity} units" for sale, product in sales]
        return {"answer": "\n".join(result)}

    # Total Products
    if intent == "total_products":
        total = db.query(Product).count()
        return {"answer": f"You currently have {total} products."}

    # Total Stock
    if intent == "total_stock":
        total_stock = db.query(func.coalesce(func.sum(Product.quantity), 0)).scalar()
        return {"answer": f"You currently have {total_stock} units in stock."}

    # Out Of Stock Products
    if intent == "out_of_stock_products":
        products = db.query(Product).filter(Product.quantity <= 0).all()

        if not products:
            return {"answer": "No products are out of stock."}

        return {
            "answer": "Out of stock products: " + ", ".join(p.name for p in products)
        }

    # Highest Stock Product
    if intent == "highest_stock_product":
        product = db.query(Product).order_by(Product.quantity.desc()).first()

        if not product:
            return {"answer": "No products found."}

        return {
            "answer": f"{product.name} has the highest stock with {product.quantity} units."
        }

    # Lowest Stock Product
    if intent == "lowest_stock_product":
        product = db.query(Product).order_by(Product.quantity.asc()).first()

        if not product:
            return {"answer": "No products found."}

        return {
            "answer": f"{product.name} has the lowest stock with {product.quantity} units."
        }

    # Revenue Today
    if intent == "revenue_today":
        revenue = (
            db.query(func.coalesce(func.sum(Sale.total_amount), 0))
            .filter(func.date(Sale.created_at) == date.today())
            .scalar()
        )
        return {"answer": f"Revenue today is ₦{revenue:,.2f}"}

    # Revenue This Month
    if intent == "revenue_this_month":
        revenue = (
            db.query(func.coalesce(func.sum(Sale.total_amount), 0))
            .filter(
                func.month(Sale.created_at) == datetime.now().month,
                func.year(Sale.created_at) == datetime.now().year,
            )
            .scalar()
        )
        return {"answer": f"Revenue this month is ₦{revenue:,.2f}"}

    # Stock Remaining
    if intent == "stock_remaining":
        product_name = intent_data.get("product_name") or intent_data.get("product")

        if not product_name:
            return {"answer": "Please specify a product."}

        product = (
            db.query(Product).filter(Product.name.ilike(f"%{product_name}%")).first()
        )

        if not product:
            return {"answer": "Product not found."}

        return {
            "answer": f"{product.name} currently has {product.quantity} units in stock."
        }

    # Stock Forecast
    if intent == "stock_forecast":
        product_name = intent_data.get("product_name") or intent_data.get("product")

        if not product_name:
            return {"answer": "Please specify a product."}

        product = (
            db.query(Product).filter(Product.name.ilike(f"%{product_name}%")).first()
        )

        if not product:
            return {"answer": "Product not found."}

        first_sale = (
            db.query(Sale)
            .filter(Sale.product_id == product.id)
            .order_by(Sale.created_at.asc())
            .first()
        )

        if not first_sale:
            return {"answer": "Not enough sales history for prediction."}

        total_sold = (
            db.query(func.coalesce(func.sum(Sale.quantity), 0))
            .filter(Sale.product_id == product.id)
            .scalar()
        )

        days_active = max(
            1,
            (datetime.now(timezone.utc).date() - first_sale.created_at.date()).days,
        )

        avg_daily_sales = total_sold / days_active

        if avg_daily_sales <= 0:
            return {"answer": "Not enough sales data."}

        days_left = product.quantity / avg_daily_sales
        day_text = "day" if round(days_left) == 1 else "days"

        return {
            "answer": f"{product.name} may run out in approximately {days_left:.0f} {day_text}."
        }

    if intent == "product_price":
        product_name = intent_data.get("product_name")
        product = (
            db.query(Product).filter(Product.name.ilike(f"%{product_name}")).first()
        )
        if not product:
            return {"answer": "Product not found"}
        return {"answer": f"{product.name} costs ₦{product.price:,.2f}"}

    if intent == "sales_yesterday":
        yesterday = date.today() - timedelta(days=1)

        total = (
            db.query(
                func.coalesce(
                    func.sum(Sale.quantity),
                    0,
                )
            )
            .filter(func.date(Sale.created_at) == yesterday)
            .scalar()
        )

        return {"answer": f"{total} items were sold yesterday."}

    if intent == "sales_yesterday_details":
        yesterday = date.today() - timedelta(days=1)

        sales = (
            db.query(Sale, Product)
            .join(Product, Product.id == Sale.product_id)
            .filter(func.date(Sale.created_at) == yesterday)
            .all()
        )

        if not sales:
            return {"answer": "No sales yesterday."}

        result = [f"{product.name}: {sale.quantity} units" for sale, product in sales]

        return {"answer": "\n".join(result)}

    return {"answer": "I couldn't understand that request."}
