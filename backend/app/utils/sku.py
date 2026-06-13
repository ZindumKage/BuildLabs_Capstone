import re

from sqlalchemy.orm import Session
from app.models.product import Product


def generate_sku(product_name: str, db: Session) -> str:
    words = product_name.upper().split()

    initials = "".join(
        word[0]
        for word in words
        if word.isalpha()
    )

    match = re.search(
        r"(\d+)([A-Z]+)",
        product_name.upper()
    )

    if match:
        qty = match.group(1)
        unit = match.group(2)

        base_sku = f"{initials}-{qty}-{unit}"
    else:
        base_sku = initials

    existing = (
        db.query(Product)
        .filter(Product.sku.like(f"{base_sku}%"))
        .count()
    )

    if existing == 0:
        return base_sku

    return f"{base_sku}-{existing + 1}"