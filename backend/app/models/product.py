from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

from datetime import datetime

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(255),
        nullable=False
    )

    sku = Column(
        String(100),
        unique=True,
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    category = Column(
        String(100),
        nullable=True
    )

    price = Column(
        Float,
        nullable=False
    )

    quantity = Column(
        Integer,
        default=0
    )

    reorder_level = Column(
        Integer,
        default=10
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    sales = relationship(
    "Sale",
    back_populates="product"
)
    

    @property
    def is_low_stock(self):
        return self.quantity <= self.reorder_level