import os

from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password


def seed_admin():
    db = SessionLocal()

    try:
        admin = db.query(User).filter(User.role == "admin").first()

        if admin:
            print(" Admin already exists.")
            return

        admin = User(
            full_name="System Administrator",
            email=os.getenv("ADMIN_EMAIL"),
            password=hash_password(os.getenv("ADMIN_PASSWORD")),
            role="admin",
        )

        db.add(admin)
        db.commit()

        print(" Admin created.")

    finally:
        db.close()