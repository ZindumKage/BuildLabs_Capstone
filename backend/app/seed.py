import os

from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def seed_admin():
    db = SessionLocal()

    try:
        admin = db.query(User).filter(User.role == "admin").first()

        if admin:
            return

        admin = User(
            
            email = os.getenv("ADMIN_EMAIL"),

            password = os.getenv("ADMIN_PASSWORD"),

            username = os.getenv("ADMIN_USERNAME", "admin"),
            role="admin",
        )

        db.add(admin)
        db.commit()

        print("✅ Admin seeded.")

    finally:
        db.close()