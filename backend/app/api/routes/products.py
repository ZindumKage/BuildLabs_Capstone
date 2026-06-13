from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException


from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.product import Product
from app.models.user import User
from app.utils.sku import generate_sku

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
)

from app.core.security import (
    get_current_user,
)

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


def build_product_response(product: Product) -> ProductResponse:
    response = ProductResponse.model_validate(product)

    response.is_low_stock = product.quantity <= product.reorder_level

    return response


@router.post("", response_model=ProductResponse)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    product = Product(
        name=payload.name,
        sku=generate_sku(payload.name, db),
        description=payload.description,
        category=payload.category,
        price=payload.price,
        quantity=payload.quantity,
        reorder_level=payload.reorder_level,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@router.get("", response_model=ProductListResponse)
def get_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    products = db.query(Product).all()

    items = [build_product_response(product) for product in products]

    return {
        "items": items,
        "total": len(items),
        "page": 1,
        "page_size": len(items),
        "pages": 1,
    }


@router.get("/categories")
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    categories = db.query(Product.category).distinct().all()

    return [category[0] for category in categories if category[0]]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return build_product_response(product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return build_product_response(product)


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}
